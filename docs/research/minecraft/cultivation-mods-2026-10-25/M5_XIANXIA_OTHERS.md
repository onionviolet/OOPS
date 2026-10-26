# M5: other xianxia/cultivation Modrinth mods

Static absorption research, 2026-10-25. No runtime changes, installation, Minecraft launch, build, commit or push. Findings and proposals are not accepted design. Highest state: source-spot-checked, with the explicit coverage limits below.

## Authority, evidence and finite budget

Followed [COMMON](../../../gm/dispatch/minecraft-cultivation-mods-2026-10-25/COMMON.md), [rules router](../../../RULES_INDEX.md), [systems register](../../../SYSTEMS_REGISTER.md), [current cultivation comparison](../../itch-io-2026-10-22/CULTIVATION_ABSORPTION_CHECK.md), PROJECT and USER_VISION. Applied AD5/AD38, WPR1–7, WPR14–23, WPR27/31, AU1–12/14–15; UR10/14/21–26 for proposed desktop UI borrowing. The active cultivation implementation retains its existing owners and acceptance gates. No owner document was edited.

**SHOWN** means read in the pinned jar's code/data; **SHOWN text** means packaged wording, whose executor may still be unread; **STATED** means an official page claim; **INFERRED** means an interpretation. These distinguish static evidence from tested gameplay. Numbers below describe references, not proposed universal YAIR balance.

A/P/M/U follow the CG audit: A = functional native analogue with inspected producer and consumer, P = partial with named remainder, M = missing in the inspected native seams, U = insufficient reference or binding evidence. A never means exact parity or player acceptance. The older audit's status is not copied over newly implemented native systems.

Budget used: one coordinator, five fresh Luna-low helpers, one per mod, at most three concurrent. Each had a 12,000-source-word/six-response limit and no descendants or retry reservation. Helpers delivered bounded extracts; coordinator reopened consequential code, corrected errors and synthesized. Five of five reserved invocations used. Host quota/precise token telemetry unavailable; no paid fallback. Deterministic full extraction does not imply full semantic reading.

The prescribed receipt-format document `docs/research/minecraft/MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md` was absent. Receipts follow COMMON's explicit fields. Initial sandbox DNS denied public access; the authorized acquisition ran through the reviewed network route. No login, access wall or account was encountered.

## Acquisition and reproducible private evidence

Official API: `https://api.modrinth.com/v2/project/<slug>` and `/version`. Selected the first returned version and its primary file, per COMMON. All five primary downloads passed the published SHA-512. Receipts also retain SHA-256, byte count, version ID, game versions, loaders, exact CDN origin and UTC acquisition date.

| Mod | Selected version / loader | Download bytes | SHA-256 |
|---|---|---:|---|
| [journey-to-immortality](https://modrinth.com/mod/journey-to-immortality) | 1.0.0 / fabric | 7,475,769 | `f35d9c14f18afcfd6f7cd446db9e139798e7bd97f6230e0658dab0974d88b63d` |
| [immortal-cultivation-mod](https://modrinth.com/mod/immortal-cultivation-mod) | 1.5.3 / neoforge | 69,594,565 | `81f1cb600f485f5ade504f3904f2ed92a50ca0a60a18414d4660d7207f86a2ce` |
| [xianxia](https://modrinth.com/mod/xianxia) | 1.2.1 / neoforge | 1,279,358 | `762ffc4d1e4129f2c033a082d7bd22e0ad1be45fab7c9fe5d2c89e4e5bea89dc` |
| [pill-refinement](https://modrinth.com/mod/pill-refinement) | 0.7.1 / fabric | 731,678 | `1889887111070766bd8275871299db3774367d25a40cc757454784928fe70681` |
| [ascended-arts](https://modrinth.com/mod/ascended-arts) | 0.3.1-1.21.1 / neoforge | 7,154,832 | `93abc4f817500a355bcbdc8086ed6b6e6df3bad759a4727e59b34fd86bda82c5` |

Total: **86,236,202 bytes**. The two plugins below received project metadata only; no plugin versions endpoint, jar, repo or dependency was downloaded. Mods' dependencies were likewise not acquired.

Private evidence home: `docs/research/minecraft/private/cultivation-2026-10-25/<slug>/`. Each mod has `receipt.json`, `archive-inventory.json`, original jar, `extracted/`, Vineflower `decompiled/`, `vineflower.log`, `process.json`, `static-index.json`, `text-inventory.json`, `lang-dump.txt`, `data-text-dump.txt`, `screen-controls.txt`, `analysis.md` and GUI contact sheets. The private folder is gitignored. Plugins have `project.json`; their page bodies are metadata, not binary inspection. Do not commit full language or guide dumps.

| Mod | Archive entries | Text files preserved | Decompiled Java files | Language files | Indexed GUI PNGs |
|---|---:|---:|---:|---:|---:|
| journey-to-immortality | 939 | 306 | 368 | 1 | 3 |
| immortal-cultivation-mod | 6121 | 2102 | 1344 | 3 | 185 |
| xianxia | 748 | 115 | 267 | 1 | 22 |
| pill-refinement | 421 | 197 | 46 | 1 | 3 |
| ascended-arts | 1181 | 559 | 65 | 1 | 19 |

Vineflower used `/opt/homebrew/bin/vineflower -dgs=1 -rsy=1 <jar> <private-output>`; no target code executed. Five logs had zero `ERROR` lines; that is not proof of perfect decompilation. Eight contact sheets cover all 232 indexed GUI PNGs. The coordinator viewed all eight, plus Pill Refinement's 28 manual PNGs as a ninth sheet. Texture inventory includes icons/frames and unused assets, not 232 screens. Every available language was dumped; missing zh_cn files were not invented. Some manual text is image-based, so JSON dumps alone would miss it.

## Journey to Immortality

### Realms, growth and breakthrough

**SHOWN.** `kairoku/immortality/cultivation/CultivationRealm.java:5-32,54-100` has 27 enum entries: Mortal; Condensation I–XIII; Foundation Establishment; Virtuoso; Nascent Soul; Incarnation; Voidbreak; Wholeness; Completion; Nirvana; True Immortal; Golden Immortal; Jade Immortal; Zenith; Dao Ancestor. The code groups these into 14 major tiers (Mortal 0, Condensation 1, Foundation 2 … Dao Ancestor 14); the page calls it “26 realms across 14 major tiers” (`project.json`, `description` and `body`). Nirvana is a preparation phase, Dao Ancestor max; Nirvana is excluded from `hasSubstages` while the other later named realms have early/middle/late substages.

`CultivationProgression.java:12-47,131-203,241-274` gives XP maxima, per-minute passive XP and stage lower bounds. Mortal max is 12; Condensation I–XIII maxima are 24, 49, 98, 195, 391, 781, 1,563, 3,125, 6,250, 12,500, 25,000, 50,000, 100,000. Thereafter the three substage maxima are: Foundation 200k/400k/1m; Virtuoso 2m/4m/10m; Nascent Soul 20m/40m/100m; Incarnation 200m/400m/1b; Voidbreak 2b/4b/10b; Wholeness 20b/40b/100b; Completion 200b/400b/1t; True Immortal 2t/4t/10t; Golden Immortal 20t/40t/100t; Jade Immortal 200t/400t/1 quadrillion; Zenith 2/4/10 quadrillion; Nirvana max ~1.000000000001t; Dao Ancestor 10 quadrillion. Each stage starts at the prior stage’s cap (with explicit transitions in lines 241–274). `CultivationSubTier.java:3-30` labels progress <30% Novice, 30% Proficient, 60% Adept, 90% Completion, 100% Perfection. Overflow is capped at 110% (`CultivationProgression.java:8-9,277-281`).

**SHOWN.** Lifespan constants span Mortal 100 years through Zenith 50 million, with Dao Ancestor set apart; one cultivation year is 2,500 ticks (`CultivationProgression.java:112-126`; lifespan accessors later in same file). This provides code constants for the lifespan clock described on the page, but exact death/aging triggers were not traced in this pass. **STATED:** breakthrough involves realm-scaled, multi-phase Heavenly Tribulation and failure loses the breakthrough (`project.json`, feature text). Code inventory contains `cultivation/HeavenlyTribulation.java`, `cultivation/CultivationManager.java`, and breakthrough scene classes; detailed failure branches were not extracted here.

### Roots, qi and resources

**SHOWN.** Roots are five strengths 0–100; strength ≥30 is active (`CultivationRoots.java:5-8,17-32`). Active-root counts multiply cultivation speed by 1.0/1.9/1.6/1.3/1.0/0.7 for zero through five active roots (lines 9,29-32). Adjacent generating pairs add 5% max qi each (34-45); each active overcoming pair subtracts 3% qi regeneration, halved when strengths differ by ≥30, with 0.1 lower bound (47-68). Wuxing maps Metal→Water→Wood→Fire→Earth→Metal for generation and Metal overcomes Wood, Wood Earth, Earth Water, Water Fire, Fire Metal (187-209). Reveal UI allows reroll/lock; its screen says closing locks roots (`client/RevealRootsScreen.java:36-83,132-138`). The page says three free rerolls, but the inspected screen’s initial count is supplied by payload; its origin/count policy was not traced.

**SHOWN.** Named stone grades run low, mid, high, supreme, perfect, heavenly, grand heavenly (`assets/journey-to-immortality/lang/en_us.json:18-25,73-79`); code includes `cultivation/QiDensityField.java:15-20` (regional density multiplier 0.5–2.0, vein scan/bonus) and `sect/VeinTier.java` (not line-extracted). Herb/seed names include Spirit Grass, Earth Dragon Root, Blood Spirit Flower and White Spirit Mushroom (lang lines 29-43). **STATED:** seclusion trades lifespan and spirit stones for cultivation; karma, toxicity and deviation exist (`project.json`, feature text). Seclusion UI exposes years, lifespan cost, stone fuel, deviation risk and toxicity purge (`client/SeclusionScreen.java:20-38,65-97`); formula/server consequences were not fully traced.

### Pills, alchemy, techniques, artifacts and combat

**SHOWN.** `alchemy/AlchemyRecipes.java:13-22,72-103` defines eight pill tiers (Condensation I, Foundation, Virtuoso, Nascent Soul, Incarnation, Voidbreak, Wholeness, Completion). Each has three recipes: qi-gathering uses 2 herbs + 1 tier-matched monster core (75%, 200 ticks); recovery uses 3 herbs + 1 core (80%, 200); breakthrough uses 2 herbs + 2 cores (50%, 400). Tier herb/minimum age pairs: Spirit Grass 50/100 years (Condensation/Foundation); White Spirit Mushroom 240/500 (Virtuoso/Nascent Soul); Earth Dragon Root 480/1,000 (Incarnation/Voidbreak); Blood Spirit Flower 1,440/3,000 (Wholeness/Completion). Special recipes: Marrow-Cleansing (40%, 600 ticks; 2 Blood Flower aged 500y + 2 Dragon Root aged 300y + 1 Mushroom aged 100y); Longevity (35%, 800; 3 Mushroom aged 800y + 2 Blood Flower aged 800y + 3 Yellow Maple Leaf); Reincarnation (20%, 1,200; 4 Blood Flower aged 1,000y + 4 Root aged 500y + 3 Mushroom aged 300y + 2 Maple Leaf), lines 34-69. Pill quality multipliers: Crude .5, Normal 1, Refined 1.75, Perfect 3; roll odds are 50%, 35%, 12%, 3% respectively (`alchemy/PillQuality.java:7-11,47-56`). Furnace has three ingredient slots, fuel slot and output (`alchemy/SpiritFurnaceScreenHandler.java:15-17`). **STATED:** discovery-gated guide and biome-grown replantable herbs (`project.json`).

**SHOWN.** Technique data defines named root-gated scroll arts and per-layer passive bonuses/active skills; example `technique/Technique.java:21-34` gives Azure Sword Art, and `:36-68` gives two Wood arts. Nine mastery layers and active radial-wheel skills are also page claims (`project.json`). GUI permits equipping techniques and assigning skill slots; detailed full catalog and all ability implementations not enumerated. Artifacts expose a grade enum, inscriptions and sword-array/nest management (`weapon/SpiritArtifact.java`, `weapon/SwordInscription.java`, `weapon/SwordArrayManager.java`, `weapon/SwordNestManager.java`; exact grade values not line-extracted). **STATED:** flying sword, sword flight, parry, charged heavies, Sword Domain and Sword Qi (`project.json`).

**SHOWN.** Eight laws and their per-depth speed/regen values are encoded in `dao/Law.java:3-11`; depth names and gates are `dao/LawDepth.java:3-14` (Glimpse, Insight, Profound, Domain, Origin). **STATED:** five depths, primary Dao and projectable domains (`project.json`); depth enum has NONE plus five named levels. Combat class inventory includes Qi pressure, Void Step, tribulation, sword and Nascent Soul systems. Exact ability costs/damage were not comprehensively extracted.

### GUI inventory: screens, choices and visual assets

All screen class names below are present in `static-index.json:screens` and are readable as source under `decompiled/kairoku/immortality/client/`; GUI texture paths are `static-index.json:gui_textures`.

- **Cultivation hub** (`CultivationHubScreen.java:25-53`): rows for Journal, Dao Comprehension, Techniques, Stats, Spiritual Sense, Spatial Folding (Completion gate), Sword Nest (Foundation gate), plus additional context rows in code, Controls and Display Settings. Hub key is G per page and key localization (`project.json`; `lang-dump.txt` first entries).
- **Progress and cultivation choices:** `CultivationStatsScreen` shows realm/substage, XP, qi, sense, combat, technique buffs, Dao heart/laws and roots; scroll/back-to-menu and roots link (`CultivationStatsScreen.java:42-63,110-198`). `RootsScreen` displays five roots and Back to Stats (`RootsScreen.java:26-59`). `RevealRootsScreen` presents roots, speed/qi/regen previews, Re-roll and Lock In; closing locks (`RevealRootsScreen.java:36-83,102-138`). `MarrowRerollScreen` is a distinct reroll prompt (class indexed; detailed controls not line-read). `SeclusionScreen` slider chooses years and Enter Seclusion, with displayed lifespan/fuel/risk costs (`SeclusionScreen.java:20-38,65-125`).
- **Knowledge and controls:** `TechniqueScreen` has technique list, Menu, Skills; nested Skill Slots, Skill Picker (slot selection), and Radial Screen (utility/action wheel) (`technique/TechniqueScreen.java:45-140,577,841-981`). `DaoScreen` exposes law comprehension; `TimeFreezeScreen` is an overlay/control screen (`dao/DaoScreen.java`, `dao/TimeFreezeScreen.java`). `JournalScreen` is milestone journal (`journal/JournalScreen.java:27-33`). `ControlsScreen`, `DisplaySettingsScreen`, `SenseSettingsScreen` are configuration screens; Sense controls passive/neutral/hostile/other/player visibility, player/hostile lines, range and Save (`SenseSettingsScreen.java:25-72`).
- **Travel, sword and defense:** `TeleportMenuScreen` has teleport, Save & Close, quickwarp 1–3 and menu-distance settings (`TeleportMenuScreen.java:25-92`). `SwordNestScreen` supports Deposit All, Equip All to Array, per-sword Inscribe/Equip/Withdraw and Close (`SwordNestScreen.java:27-74`). `SwordInscribeScreen` handles inscription (`SwordInscribeScreen.java:26-83`). `BarrierScreen` is radius setup; slider/action details not extracted (`barrier/BarrierScreen.java:23-39`).
- **Alchemy:** `SpiritFurnaceScreen` is the container GUI with recipe-guide button (`client/alchemy/SpiritFurnaceScreen.java:29-42`); `RecipeGuideScreen` is the recipe/discovery list (`client/alchemy/RecipeGuideScreen.java:36`); texture paths are `assets/journey-to-immortality/textures/gui/container/spirit_furnace.png`, `burn_progress.png`, `lit_progress.png` (static-index).
- **Sect interfaces:** `SectHallScreen` has tab variants (`SectHallScreen$Tab`), and `PeakHallScreen` has rows; `MonumentScreen` is management/territory (`client/sect/SectHallScreen.java:77`, `PeakHallScreen.java:33`, `MonumentScreen.java:34`). Exact tab/button inventory not read; indexed nested MissionRow/Row classes show scrollable entries.
- **Overlays and event screens:** `HeartDemonIllusionScreen` (illusion choice/mode; buttons not inspected); `TribulationScreenOverlay`, `HeartDemonBacklashOverlay`, and `TimeFreezeScreen` are indexed overlays/effects; no buttons evidenced for the latter overlays. `CultivationHudRenderer` and `TechniqueSkillHud` are HUDs, not menus. `ControlsScreen$Row`, nested technique screens, and network `Open*ScreenPayload` classes establish the additional GUI/entry routes (`static-index.json:screens`).

Screenshot paths in the project page’s gallery are remote URLs, not PNGs in the extracted directory. Indexed local GUI PNGs are only the three furnace textures above. The page gallery labels screenshots for meditation, root awakening, qi meditation, breakthrough, sword arrays (two sizes and autolock), qi flight (hover/sprint), furnace, recipe menu, furnace UI, ward array, seclusion parts 1–2 and Fire Dao Domain (`project.json:gallery`). These are **STATED gallery labels**, not runtime verification.

### Coverage gaps

Unread/incompletely inspected: exact breakthrough success/failure mechanics and tribulation phases; full lifespan-aging/death code; exact seclusion and pill toxicity/deviation formulas; complete scroll/technique catalog, mastery progression and every combat ability; artifact grade values/inscription effects; full sect tab/button semantics; Controls/Display/Marrow/Barrier/Heart Demon/Time Freeze screen interactions; all `Open*ScreenPayload` routing details; worldgen rates, dimension gates, mob scaling/loot and sect war resolution. Where source was present but not traced, this report intentionally leaves page language as STATED rather than treating it as implemented behavior. No gameplay/runtime verification was performed.

### Coordinator additions and corrections

**SHOWN / STATED discrepancy:** `CultivationRealm.java:5–32,78–100` has 27 enum values and major-tier indices 0–14. The page's “26 realms / 14 major tiers” is retained as STATED, not a counted code result. Mortal plus thirteen Condensation values plus thirteen later names gives 27. `CultivationProgression.java:39–44` gives Nirvana's deliberately narrow XP window; do not replace it with an ordinary tenfold stage.

**SHOWN:** actual tribulation executor is `cultivation/HeavenlyTribulation.java`, not a `TribulationManager` file. It defines 30-tick telegraphing and a 3-block radius (`:71–75`); the phase dispatcher handles pause, bolt barrage, passive drain, final strike and summoned beasts (`:434–461`), with revive-block and heart-demon flags (`:464–489`). These are actual differentiated phases; exact per-realm profile numbers and every terminal failure/rollback branch remain unread. This supports a richer performance-trial reference than a probability-only confirm, without claiming its fight feel was played.

**SHOWN:** `SeclusionManager.java:31–35,48–62,85–110` has a 300-tick window, hard-cap 1,000 requested years, 5-year safety constant and .0015 base risk/year; it reserves actual spirit-stone fuel, rejects insufficient lifespan/fuel, and handles disconnect by emerging. Full yearly reward, purge and refund branches remain incompletely read. This is a compressed paid retreat under its own clock, not proof of ordinary offline simulation.

**SHOWN:** `weapon/SpiritArtifact.java:23,77–94,275–279` stores owner, grade, level and XP; max level 9, next-level XP `level² × 40`, initial binding starts at Spirit grade/level 1. Grades are Mortal Tool, Spirit Tool, Treasure, Immortal Artifact (exact Chinese/English display strings remain in source). Damage/speed/range/on-hit inscription consumers exist at `:235–272`. Do not infer that every inscription is universally usable.

**SHOWN GUI controls added to the preceding catalogue:** `SectHallScreen.java:107–118,205–427,796` has Overview, Contribution, Shop, conditional Manage, Path, War and Library. Contribution buttons submit missions; Shop purchases offers; Manage sets MOTD, changes/removes members and territory permits, or disbands; Path selects sect path; War declares against a typed name; Library learns for 80 contribution points and supports donation. `PeakHallScreen.java:33–63` submits contribution missions. `MonumentScreen.java:89–104` adjusts numeric configuration with plus/minus and closes. `BarrierScreen.java:23–76` exposes radius plus Raise/Dispel/Cancel. `SwordInscribeScreen.java:40–65` supports Inscribe/Erase and returns to Nest. `DisplaySettingsScreen.java:22–34` toggles aura and returns to hub. `HeartDemonIllusionScreen.java:20–36` imitates death/title buttons whose handlers dismiss the illusion. `TechniqueScreen.java:841–981` contains the additional Skill Picker and Skill Slots screens; radial selection is a nested screen, not a separate jar. Configuration and illusion affordances are source-confirmed; server permission/cost outcomes were not all traced.

## Immortal Cultivation (修仙)

### Realm ladder and exact stage data

**SHOWN:** `CultivationLevels.java:10-25` names Mortal (凡人), Qi Refining (练气), Foundation Establishment (筑基), Half-Step Golden Core (半步金丹), Golden Core (金丹), Nascent Soul (元婴), Spirit/Deity Transformation (化神), Void/Refinement (炼虚), Body Integration (合体), Great Ascension (大乘), and Tribulation Transcendence (渡劫). Major realms have early/middle/late stages (`:21-24,26-108`). Half-Step Golden Core is a special bridge, not one of the normal three-stage realm definitions: it reuses Foundation Establishment late-stage stats and doubles that stage's Qi requirement (`:182-205`).

The `StageDef` tuple is `(max HP, max age, max Qi, armor, cultivation Qi needed, breakthrough-failure multiplier)`, as defined at `CultivationLevels.java:352-361`. Each normal stage's failure multiplier is `0.01F` in the table.

| Realm and stage | Max HP | Max age | Max Qi | Armor | Qi needed |
|---|---:|---:|---:|---:|---:|
| Mortal | 20 | 100 | 20 | 0 | 10 |
| Qi Refining early / middle / late | 50 / 80 / 120 | 105 / 115 / 130 | 50 / 120 / 250 | 1 / 1.5 / 2.5 | 100 / 800 / 2,500 |
| Foundation Establishment early / middle / late | 250 / 400 / 700 | 180 / 230 / 300 | 500 / 900 / 1,500 | 5 / 8 / 14 | 8,000 / 25,000 / 80,000 |
| Golden Core early / middle / late | 1,500 / 2,500 / 4,000 | 500 / 700 / 1,000 | 3,000 / 5,000 / 8,000 | 30 / 50 / 80 | 200,000 / 600,000 / 2,000,000 |
| Nascent Soul early / middle / late | 8,000 / 13,000 / 22,000 | 2,000 / 3,000 / 4,500 | 15,000 / 25,000 / 40,000 | 160 / 260 / 440 | 5,000,000 / 15,000,000 / 50,000,000 |
| Spirit Transformation early / middle / late | 50,000 / 80,000 / 130,000 | 8,000 / 12,000 / 18,000 | 100,000 / 160,000 / 250,000 | 1,000 / 1,600 / 2,600 | 120,000,000 / 400,000,000 / 1,200,000,000 |
| Void Refinement early / middle / late | 300,000 / 500,000 / 800,000 | 30,000 / 50,000 / 80,000 | 600,000 / 1,000,000 / 1,600,000 | 6,000 / 10,000 / 16,000 | 3,000,000,000 / 9,000,000,000 / 30,000,000,000 |
| Body Integration early / middle / late | 2,000,000 / 3,500,000 / 6,000,000 | 150,000 / 250,000 / 400,000 | 4,000,000 / 7,000,000 / 12,000,000 | 40,000 / 70,000 / 120,000 | 80,000,000,000 / 250,000,000,000 / 800,000,000,000 |
| Great Ascension early / middle / late | 15,000,000 / 25,000,000 / 40,000,000 | 1,000,000 / 1,800,000 / 3,000,000 | 30,000,000 / 50,000,000 / 80,000,000 | 300,000 / 500,000 / 800,000 | 2,000,000,000,000 / 7,000,000,000,000 / 25,000,000,000,000 |
| Tribulation Transcendence early / middle / late | 100,000,000 / 180,000,000 / 300,000,000 | 10,000,000 / 30,000,000 / 100,000,000 | 200,000,000 / 350,000,000 / 600,000,000 | 2,000,000 / 3,600,000 / 6,000,000 | 100,000,000,000,000 / 500,000,000,000,000 / 2,000,000,000,000,000 |

**SHOWN:** the data tuples appear consecutively at `CultivationLevels.java:25-108`. Mortal is a separate level with no stage. A notable implementation detail is that `maxAge` is an integer per stage and climbs sharply; it is not the same field as current age. `getNextStage` maps mortal to Qi Refining early and Half-Step Golden Core to Golden Core early (`:208-224`). Exact subsequent helper behavior beyond the cited region table was not exhaustively traced.

### Entry, progression, and breakthrough

- **STATED:** the project page presents the Enlightenment Pill as the entry item from mortal to Qi Refining (`project.json`, `body`, “Getting Started / Enlightenment Pill”). The page's English starter spell names/values are cited in the spell section.
- **SHOWN:** local text includes an Enlightenment Pill item (`lang-dump.txt:551`) and separate breakthrough-pill item/message keys (`:552,906-909`). The stat UI has a breakthrough button and a realm requirement label (`:824,829`); the page's listed stats align with the local stat screen vocabulary but are page claims until the screen is examined.
- **SHOWN, local simulated-life text:** breakthrough can surface as an event offering “attempt now,” “continue consolidating foundation,” or “buy breakthrough assistance”; the accompanying narrative mentions assessing Qi/blood, foundation, and mindset, while the assistance choice buys pills and seeks guidance (`lang-dump.txt:260-266`). This is the life-simulation event's wording, not proof that the real-time breakthrough evaluator uses exactly those factors.
- **SHOWN:** Golden Core has its own formation/breakthrough screen. `screen/JindanBreakthroughScreen.java:64-114,160-170,239-253` shows a formation interaction with reset, paged rules, optional debug-skip, and tile rotation by left/right click while active. The localization names rules paging, reset, formation status, success in Golden Core, and failure (`lang-dump.txt:1439,1445,1453,1468-1469`). This is a consequential bespoke subgame rather than a simple numeric confirm. Exact puzzle solution rules were not fully abstracted here.
- **SHOWN:** the ladder names “Half-Step Golden Core” as a real special state; the `getRealm` logic models it as Foundation late stats with double Qi-needed and `getNextStage` leads to Golden Core early (`CultivationLevels.java:182-205,208-224`). It is therefore a threshold/bridge in code, not merely a translated nickname.
- **SHOWN:** the page describes Lingbeng stacking blast radius; packaged Chinese text says the effect can stack to ten (`lang-dump.txt:1179`). Prefer the local current artifact for that finer cap; the page gives no cap.

### Resources, roots, methods, and cultivation practice

**SHOWN:** the project and packaged text use Qi/灵气, cultivation progress/修为, maximum age/lifespan, health, moral character, luck, soul, thoughts, and spirit roots as surfaced stats (`project.json`, `body`; `lang-dump.txt:142-159,801-829`). Root labels include none, pseudo, triple, dual, single, and heavenly (`lang-dump.txt:136-142`). Realm-stage data separately sets HP, age, Qi capacity, armor, and Qi needed.

**SHOWN:** method and spell progression are separate vocabulary and UI families: learned methods, active method, method learning/activation, method tier, and spell selection appear as distinct labels (`lang-dump.txt:159,1039-1050`; screens `MethodLearningScreen.java`, `SpellSelectionScreen.java`, `SpellWheelScreen.java`). Cultivation methods may be learned and activated; the local text warns of method-specific cultivation caps (`lang-dump.txt:1043-1050,1065`).

**SHOWN:** packaged specialties describe non-spell method effects as well. Blood Demon method converts blood essence into blood Qi and lets spells/cultivation use it instead of Qi (`lang-dump.txt:1211`). Cold Yin method freezes moisture and meridians and unlocks further techniques (`:1219`). Body tempering text defines a cost/reward loop: each use deals 5% max-HP damage, enough uses raise max HP by 5%, at most three successful gains per major realm; melee attacks have a 15% chance of 30% bonus damage (`:2014-2020`). These are exact localized stated mechanics; not runtime-tested here.

**SHOWN:** terrain traversal, flight, detection, shields, healing, cleanse, stealth/illusion, undead control, Qi theft, and pressure effects all appear in packaged spell descriptions. Examples: earth escape spends Qi underground; Qi gathering boosts recovery while removing attack/defense and increasing incoming damage; Huti Qi maintains/reforms a mundane-weapon shield; Weiya drains 2% maximum Qi per second and expands from 12 to 64 blocks by realm; self-explosion burns remaining lifespan after a three-confirmation sequence and has realm-scaled radius (`lang-dump.txt:1182,1184,1191,1199-1201`). Treat spell details as **SHOWN localized descriptions**; exact server implementation for each spell was not traced.

### Spells and combat

**STATED, project page starter roster:** Fireball (Qi Refining early, Fire, 10 Qi); Lingbeng (Qi Refining late, Thunder, 50 Qi; punch block/entity to detonate, recasting stacks radius); Regeneration (Qi Refining middle, Wood, 20 Qi); Beam (Qi Refining early, Light, 30 Qi); Earth Escape (Qi Refining late, Earth); Cleanse (Qi Refining early, Water, 10 Qi); Qi Gathering (Qi Refining early, Wind, zero Qi, but disables attack/block and triples damage taken); Ignite Flare (Qi Refining early, Fire, 10 Qi); Spirit Sight (Qi Refining early, Light, 5 Qi/second); Zhenshan Palm (Foundation middle, Earth, 130 Qi on page); Light Ball (Foundation late, Light, 30 Qi summon plus 10 each shot, six balls, up to three rings, punch to fire one or shift-punch all, 50 damage each and up to 24 blocks pierced) (`project.json`, `body`, “Spells”).

**SHOWN, current packaged text:** the artifact's cost localization has Zhenshan Palm at 390 Qi, not the page's 130 Qi (`lang-dump.txt:1108,1198`). This discrepancy is intentionally preserved: it may reflect version drift, configuration, or a page error; the local packaged localization is direct evidence for the exact saved jar. Local Light Ball wording says six balls and punch firing, but its detailed numeric behavior is not repeated in this extract. Do not silently merge the two sources.

Further local text shows a broad combat toolkit: low-cost spirit bullets and wind blades; wind step/dash and flight; smoke blindness; layered water shields; qi body shield; earth dust cover; water trap; spirit sight; flight; pressure; self-destruction; cultivation absorption; undead command; sword control; cold techniques; and high-realm area/time effects (`lang-dump.txt:1117-1178,1185-1201,1234-1244,1267-1269,1419-1431,2234-2244,2310-2312,2436-2438`). Examples of unusual tactical costs/effects include sword riding only at Golden Core or above and a 1.5x selected flight speed (`:1259`); controlled flying swords orbit behind the player and can be fired individually or in a group (`:1267-1269`); Qi theft extracts one tenth of a lower-realm target's progress (`:1201`); and a spatial-sealing projectile creates a tier-scaled area that traps entities and inflicts suffocation (`:2436-2438`).

**INFERRED:** combat is meant to be spatial and environmental, not just cooldown/DPS selection: several descriptions alter terrain, movement, visibility, block interaction, projectile paths, or the target's Qi/thought resource. That is a design reading of the localized text, not observed play.

### Pills, alchemy, crafting, and toxicity

- **SHOWN:** localized item groups include pills, herbs, and recipes; separate pill, herb, and recipe creative subtabs exist (`lang-dump.txt:920,932-934`). Items include Enlightenment Pill and Breakthrough Pill (`:551-552`). The stat/encyclopedia vocabulary includes alchemy skill/proficiency (`:1352`, also life detail labels `:155`).
- **SHOWN:** source classes identify alchemy components and seams: `alchemy/AlchemyMenu.java`, `AlchemyForgeRecipes.java`, `AlchemyChemistry.java`, `AlchemyEffects.java`, `PillData.java`, `AlchemyPillItem.java`, `AlchemyHerbBlock.java`, `JadeBottleMenu.java`, `JadeBottleItem.java`, `PillToxicity.java`, and `PillToxicityConfig.java`. `screen/DingScreen.java` and `screen/DingMenu.java` are the named cauldron interface. I inspected class inventory and labels, not every recipe or each formula implementation.
- **SHOWN:** toxicity has a dedicated screen, settings screen, settings slider, and toxicity texture family (class names in `static-index.json:screens`; assets `assets/immortal_cultivation_mod/textures/gui/toxicity/veins_1-4.png`, `mist_1-4.png`, `edge_1-4.png` in `static-index.json:gui_textures`). This indicates a visible toxicity presentation/configuration layer; the visual meanings and exact accumulation/cleansing rules were not exhaustively decoded.
- **STATED:** the Modrinth body presents the Enlightenment Pill as the first advancement gate. It does not document the alchemy crafting loop, recipe inputs, grade outcomes, or toxicity (`project.json`, `body`).
- **INFERRED:** alchemy connects material acquisition, a skill-bearing craft station, pills as progression/combat resources, and a tracked toxicity cost. Exact recipe balance and failure semantics remain open static-reading work.

### Artifacts, equipment, and advancement of weapons

**SHOWN:** indexed/source class families include `item/HigherWeaponItem.java`, `HigherWeaponSpec.java`, `HigherWeaponCombat.java`, `HigherWeaponRecipes.java`, `HigherWeaponGeoItem.java`, `WeaponMoldItem.java`, `WeaponShardItem.java`, `WeaponShardSystem.java`, `WeaponBinding.java`, `WeaponTribulation.java`, `WeaponTribulationData.java`, `WeaponDurability.java`, `QiInfusedWeapon.java`, `ManifestedWeaponItem.java`, `FortuneArtifactItem.java`, `SoulStorageWeapon.java`, and `CultivationAccessoryItem.java`. This confirms distinct systems for weapon specification, combat, recipe/mold, shards, owner binding, tribulation, durability, Qi infusion, manifested arms, fortune artifacts, soul storage, and accessories. Class names alone do not establish precise behavior.

**SHOWN, localized text:** high-tier artifact materials and NPC requests mention refined-iron cores, cloud-pattern silver crystals, spirit scales, sword nourishment/sharpening materials, and family/royal artifact projects (`lang-dump.txt:1549-1552,1567-1572,1589,1595-1596`). Cultivation accessories include a jade pendant that doubles meditation progress and method proficiency (`:1290`). The project page's starter spell sample is not a complete weapon/artifact specification.

**INFERRED:** the code separates weapon growth from ordinary item rarity by giving weapons their own qi, binding, durability, shards and tribulation seams. Their actual thresholds, risks, and UI choices need targeted class review before treating that as a full mechanic description.

### Other loops that materially widen the game

**SHOWN:** localized/identified systems include simulated lifetime, inheritance, events/quests, relationship and NPC interaction, manual learning, spell merchants, beasts and realm pressure, guidance, systems/shop, talismans/restriction puzzles, and card combat (`system/LifeSimulation*.java`, `system/LifeCard*.java`, `screen/LifeSimulationScreen.java`, `screen/LifePlanningScreen.java`, `screen/NpcInteractionScreen.java`, `screen/LifeCardBattleScreen.java`; `lang-dump.txt:136-266,1517-1660`). These are source-family facts, not a complete map of every data-driven event or interaction.

**SHOWN, life simulation text:** generated life stories can offer morally qualified choices with enduring outcomes. Example: taking a wounded cultivator's manual is explicitly framed as theft, while reporting the attackers lets the sect rescue him and leaves the manual with him (`lang-dump.txt:328-334`). Breakthrough events can trade immediate attempt against consolidation or purchased help (`:260-266`).

### GUI inventory and high-consequence inspection

#### Catalog method

**SHOWN:** `static-index.json:screens` is the full 187-entry screen-related class catalog and `static-index.json:gui_textures` is the 185-entry GUI texture-path catalog. Those are the authoritative exhaustive filename inventories for this pass; this document does not reproduce 372 paths. To find every exact entry, filter those two arrays by `screen` or `gui_textures`. The actual GUI implementation has been skimmed in the especially consequential `JindanBreakthroughScreen.java`; key action and tab/state details below are code-confirmed. The artifact index was prepared locally and no game was launched.

#### Directly inspected controls, screens, and decisions

- `screen/JindanBreakthroughScreen.java:64-114,160-170,239-253`: Golden Core formation. Controls include previous/next rules-page arrows with localized tooltips, reset, optional debug-skip, and an active formation puzzle. Left-click rotates a tile one way; right-click reverses it. Buttons update with state and page boundaries. Linked tiles expose a tooltip (`:282`). Success/failure states have separate presentation (`:427-451`). **SHOWN.**
- `screen/StatMenuScreen.java` and `screen/ModScreens.java` are present; `lang-dump.txt:596,602-603,801-829` names the open-stat-menu key, stat menu, progression fields, next-level and breakthrough labels. The project page states the stat inventory (above). The full button geometry, tabs, and click map of StatMenuScreen were not read. **STATED page + SHOWN labels; screen internals unread.**
- `screen/MethodLearningScreen.java`, `ScrollLearningScreen.java`, `SpellSelectionScreen.java`, `SpellWheelScreen.java`, and `TechniqueDescriptionScreen.java` establish separate method scroll learning, spell selection/wheel, and technique-description surfaces. The packaged labels name activate-method, current method, method name/tier, and learned methods (`lang-dump.txt:159,1039-1050`). Selection list/wheel mechanics were not completely traced. **SHOWN class/UI vocabulary; detailed controls unread.**
- `screen/DingScreen.java`/`DingMenu.java`, `MedicineDrawerScreen.java`/`MedicineDrawerMenu.java`, `PillToxicityScreen.java`/`PillToxicitySettingsScreen.java`, and `AlchemyMenu.java` cover alchemy, ingredient/medicine storage, toxicity, and settings. Indexed slider/opacity controls indicate adjustable presentation (`static-index.json:screens`). Exact ingredient slots, recipe tabs, and settings decisions unread. **SHOWN class names; selected control details unread.**
- `screen/SystemScreen.java` has nested shop category/mode/entry, inventory entry, and request entry classes in the index. Text exposes pill shop category and separate kill-reward rules, including realm-relative contribution limits (`lang-dump.txt:377,447-449`). Exact tabs, purchase confirmation, price presentation, and inventory interactions unread. **SHOWN labels and class structure; screen flow unread.**
- `screen/LifeSimulationScreen.java` has `Tab`, `WindowLayer`, and `MapLayer` nested classes; `LifePlanningScreen.java` has a journal view and scrollbar. `LifeEncounterScreen.java`, `LifeWindowScreen.java`, and `LifeCardBattleScreen.java` are separate indexed screens. Text exposes life actions, story choices, realm/root/method/skill/lifespan/combat stats, relationships, events, and ending names (`lang-dump.txt:136-266`). The complete tab set, map controls, and encounter choices are unread; the names should not be mistaken for a verified visible tab inventory.
- `screen/NpcInteractionScreen.java`, `NpcOptionScreen.java`, `NpcDataScreen.java`, `AbstractNpcScreen.java`, and `NpcRelationshipDebugScreen.java` show multiple NPC interaction/inspection surfaces. Localized player choices include ask cultivation, gifts, quests, method instruction, and trust-qualified teaching (`lang-dump.txt:1517-1659,1620-1628`). Detailed page buttons and choice transitions unread.
- `screen/RestrictionTableScreen.java`/`RestrictionPuzzleScreen.java`, `TalismanDrawingScreen.java`/`TalismanMessageScreen.java`, and `LingqiTrajectoryScreen.java`/`LingqiTrajectoryHelpScreen.java` indicate restriction carving, talisman drawing, and Qi-path routing activities. Text names node types such as element, Qi channel, and overload, and provides help vocabulary (`lang-dump.txt:474-501,629-758`). Exact puzzle/tab/button mapping unread.
- `screen/QiPouchScreen.java` and `QiPouchMenu.java` include nested pouch inventory and pouch-chest containers/slots; source index additionally names screen hit targets. This is a custom storage UI, but its complete hover/click mapping was not read.
- Other indexed player-facing/configuration screens include `CultivationSettingsScreen`, `BlastQiSettingsScreen`, `BlockBreakingSettingsScreen`, `RingAiSettingsScreen`, `HudLayoutScreen`, `YinYangCompassScreen`, `BodyTypeSelectionScreen`, `BodyTypeDetailsScreen`, `SpiritRootSelectionScreen`, `SpiritRootDetailsScreen`, `EnlightenmentSelectionScreen`, `GenderSelectionScreen`, `WantedOrderScreen`, `XuanjinScreen`, `SteleSpellEditorScreen`, `ShentongDetailsScreen`, `TrainingDummyScreen`, `DisguiseMaskSkinScreen`, `DebugEyeScreen`, `DebugTimeScreen`, and the inherited `FittedMenuScreen`/`AbstractNpcScreen`. Their filenames are cataloged; individual controls and some may be developer/testing-only. **Named, not semantically inspected.**


### Coordinator: alchemy and toxicity executor

**SHOWN:** `alchemy/AlchemyChemistry.java:43–151` accepts a formula's required herbs plus recognized additives, up to 64 total. Extra incompatible herbs fail. It computes averaged element shares, trait-driven conversions, conflict reduction, toxicity and stability. Failure occurs at conflict ≥35, stability <20 or toxicity ≥60, or an incompatible additive. Harmonize contributes 18 conflict reduction and 15 toxicity reduction per count; purification adds stability; catalysts cap at +50%, Qi amplification at +300%, duration amplification at +200%, and duration at 72,000 ticks. Superior quality needs stability ≥90, Fine ≥70. Thus the source offers formula-core-plus-additives, rather than a recipe that accepts arbitrary fantasy names. Recipe catalogue and all station hooks were not read end-to-end.

**SHOWN:** `alchemy/PillToxicity.java:64–92,103–185` clamps body toxicity to 0–100 and derives four policy thresholds. Per-consumption gain combines configured base/pill potency, realized batch potency, quality, pill-versus-recipient realm difference and a bounded repeat count/window. The inspected detox pill ID `qingdu` bypasses that gain path. Natural Qi has a toxicity multiplier and fractional carry (`:186–190` onward). This is different from poison duration or a fixed permanent-pill capacity. Exact default policy values and every toxicity consequence are not claimed here.

### Coordinator: complete named screen catalogue, bounded semantics

**SHOWN:** All 60 top-level `*Screen.java` files across the mod are listed below, including abstract bases/debug tools. Default locators are `decompiled/com/example/immortal_cultivation_mod/screen/` plus the class name; the hair and ritual exceptions are named explicitly; `screen-controls.txt` preserves selected source lines and localization keys. SHOWN below means visible source affordance, not a proven server outcome. Rows combining classes enumerate each name explicitly. No standalone rendered screenshots were obtained. This catalogue closes filename coverage; full click-to-server execution coverage remains open.

| Screen class(es) | Shown surface / choices and boundary |
|---|---|
| `StatMenuScreen` | Realm/progress/stats, root/body detail, proficiency, breakthrough, Golden Core, shentong and portal entry buttons; conditions decide which appear. |
| `ProficiencyMenuScreen` | Skill/profession proficiency overview and return to stats. |
| `SpiritRootSelectionScreen` | Animated root reveal; refresh remaining draws, then continue to body selection. |
| `SpiritRootDetailsScreen` | Root grades/elements detail, Back. |
| `BodyTypeSelectionScreen` | Body reveal/refresh and Continue. |
| `BodyTypeDetailsScreen` | Body data/details, Back. |
| `GenderSelectionScreen` | Gender choices and Confirm. |
| `EnlightenmentSelectionScreen` | Abstract animation/reveal/input base, not an additional confirmed player menu. |
| `MethodLearningScreen` | Method-description subtype; Activate sends the selected method then closes. |
| `ScrollLearningScreen` | Scroll-description subtype; Learn or learned status. |
| `TechniqueDescriptionScreen` | Shared spell/method description modes and contextual primary action, Back/Done. |
| `SpellSelectionScreen` | Known-spell selection; toggle wheel membership; Done. |
| `SpellWheelScreen` | Radial choice of available spells. |
| `ShentongDetailsScreen` | Supernatural-power description and Back; not its combat executor. |
| `DaoGuidanceScreen` | Chapters, current state, progress/Qi/method/pill requirements and success chance; acknowledge/cancel/back. |
| `JindanBreakthroughScreen` | Rules paging, tile rotations, reset, puzzle status, success/failure and conditional debug skip. |
| `LearningMatchScreen` | Learning match-game board: swap, undo invalid swap, clear and fall states; score/modifiers/completion. |
| `LingqiTrajectoryScreen` | Ordered Qi-path board, strength/stability/element/gates/timers; Reset, Wait, Complete and Help. |
| `LingqiTrajectoryHelpScreen` | Node/rule explanation and return to the active path board. |
| `DingScreen` | Material slots, temperature/target marker, progress, output and Start. |
| `MedicineDrawerScreen` | Three medicine slots plus player inventory, no extra decision screen inferred from its menu container. |
| `PillToxicityScreen` | Toxicity stage/readout, Back. |
| `PillToxicitySettingsScreen` | Visual toxicity presentation settings/sliders, Back; not a cure action. |
| `RestrictionTableScreen` | Artifact/layer progress, carve/evolve choices and selected-layer status. |
| `RestrictionPuzzleScreen` | Selected node, left/right changes, targets/links/flags, move budget, instability, Hint and Withdraw. |
| `TalismanDrawingScreen` | Drawing, Qi injection and waiting phases; clear, insert mastered formula, paper/ink/output and cost displays. |
| `TalismanMessageScreen` | Recipient/content fields, Send and Cancel; source UI only, no message was sent. |
| `SteleSpellEditorScreen` | Current stele spell list, Clear and Close. |
| `QiPouchScreen` | Build and chest tabs; search, chest pages, camera reset, place/interact/camera help. |
| `YinYangCompassScreen` | Yin-Yang versus Qi readout, sample/zoom/overview/help and clear pin. |
| `XuanjinScreen` | Item/configuration viewer with custom `xuanjin.gui.*` fields; full click semantics unread. |
| `DisguiseMaskSkinScreen` | Skin selection list and help hint; full network validation unread. |
| `WantedOrderScreen` | Target/reward poster; no bounty completion claim from its texture. |
| `SystemBootScreen` | System introduction and Continue. |
| `SystemScreen` | Shop categories All/Pill/Food/Material/Talisman/Weapon/Accessory/Spell; buy/recycle/request modes, search, refresh, points, reward claim and gacha draws/tickets/rates. |
| `LifeSimulationScreen` | Life/Relationships/Cultivation/Activities/Map/Assets/Record tabs; start, advance one/five, settle, inheritance and new life. Map layers Terrain/Faction/Qi/Danger/Trade/Rumor. |
| `LifePlanningScreen` | Activities and journal views History/Endings/Leads/People; planning and recorded person state. |
| `LifeEncounterScreen` | Encounter/person/realm status and event-dependent action surface; all event choices not enumerated. |
| `LifeCardBattleScreen` | Hand/cards, energy/dice pools, HP and enemy intent; exact card/turn controls not fully traced. |
| `LifeWindowScreen` | Abstract detachable window base; not a separate encounter type. |
| `NpcOptionScreen` | Talk/Interact/Trade/Quest/Teach/Inventory/About tabs with person-specific choices. |
| `NpcInteractionScreen` | NPC interaction/options; packaged vocabulary includes gifts, questions, quests and teaching. |
| `NpcDataScreen` | NPC data/status inspection. |
| `AbstractNpcScreen` | Shared NPC base, not a new actor or independent feature. |
| `TrainingDummyScreen` | Dummy options/toggles, method/spell list, pagination, mastery apply/activate and Done; administration/testing affordances kept separate from ordinary progression. |
| `CultivationSettingsScreen` | Channeling, Golden Core flight, outward Qi/size, sword recall, sky and block-breaking preferences; Done. |
| `BlastQiSettingsScreen` | Blast/outward-Qi settings and Back; precise option semantics not fully read. |
| `BlockBreakingSettingsScreen` | Block-breaking options and Back. |
| `RingAiSettingsScreen` | Ring AI preferences and Back; no behavior guarantee from settings alone. |
| `HudLayoutScreen` | Select/reset one HUD component, reset all, Cancel/Done. |
| `DebugEyeScreen` | Freeze/resume visual debugger, copy, Done; debug surface. |
| `DebugStatEditorScreen` | Debug stat/age/roots/core/system fields; not an earned progression path. |
| `DebugTimeScreen` | Current/target speed/time adjustment, confirm/cancel; debug surface. |
| `DebugWeaponEditorScreen` | Weapon/stat/restriction/durability debug editing; not a crafting recipe. |
| `NpcRelationshipDebugScreen` | Relationship debug state and Done; not player diplomacy. |
| `FittedMenuScreen` | Shared fitted-container base, not a standalone station. |
| `HairScreen` | `hair/client/HairScreen.java`: Styles/Color/Skin tabs; style paging, front/side/back preview, zoom, HSV/RGB/hex color, skin search/own-skin sampling, layer/eyedropper, remove/cancel and apply. Cosmetic UI; no cultivation bonus inferred. |
| `CircleSelectionScreen` | `magicritual/ui/CircleSelectionScreen.java`: select Attack, Defense or Regeneration circle type. |
| `RadiusSelectionScreen` | `magicritual/ui/RadiusSelectionScreen.java:15,32–65`: choose radius 3/5/7/9/11; sends placement request then closes. |
| `CenterFuelScreen` | `magicritual/ui/CenterFuelScreen.java`: fuel/container plus settings/octagon/teleport tabs, hostile/passive/particle/enable toggles, radius input/adjust/apply, color swatches, blacklist/controllers and destination/code controls. Exact server permissions and ritual effects unread. |

Other indexed names such as `DingMenu`, `MedicineDrawerMenu`, `DebugWeaponEditorMenu`, `MenuViewport`, hit targets and inner classes are plumbing, not additional named screens. The full 187-entry name index retains them. HUD/effect textures and renderers sit outside the Screen table; those effects were inventoried and visually viewed, not all traced to their runtime trigger.

**SHOWN image inspection:** parchment two-pane spell/proficiency screens, centered breakthrough symbol, book-like manual, a spectrum temperature strip, toxicity veins/mist/edge layers, reusable window chrome, numerous restriction circles and portrait sprites. The 185 `textures/gui` PNGs include many icons and state variants. A picture does not establish an operable minigame. Full combat timing, every recipe, alchemy/weapon tribulation executor, all life/card/NPC events and click-to-server flows remain unread.

## Xianxia

### Realms and exact thresholds, corrected against executor

**SHOWN:** `decompiled/net/mcreator/xianxia/procedures/RealmStringFormatProcedure.java:20–38` labels realm 1 Mortal Realm and realm 2 Divine Realm. `LayerstringformatProcedure.java:20–130` labels Mortal Realm layer 0 Mortal; 1–3 Qi Condensation Low/Mid/Peak; 4–6 Foundation Establishment Low/Mid/Peak; 7–9 Core Formation Low/Mid/Peak. Divine Realm layer 1 is Divine Condensation Low. Numeric `playerRealm` plus `playerLayer` are separate dimensions, not ten invented named realms. The helper initially missed these formatting files; the following replaces its “no names found” result.

All ten `Ascension*.java` executors were compared, including their assignments rather than inferring from filenames. Their exact-equality Qi gates, prior layer and resulting layer/cap form this continuous inspected chain:

| From | Qi equality required | To | New max Qi |
|---|---:|---|---:|
| Realm 1, layer 0 | 100 | 1/1 | 1,000 |
| 1/1 | 1,000 | 1/2 | 3,000 |
| 1/2 | 3,000 | 1/3 | 15,000 |
| 1/3 | 15,000 | 1/4 | 50,000 |
| 1/4 | 50,000 | 1/5 | 150,000 |
| 1/5 | 150,000 | 1/6 | 750,000 |
| 1/6 | 750,000 | 1/7 | 2,000,000 |
| 1/7 | 2,000,000 | 1/8 | 5,000,000 |
| 1/8 | 5,000,000 | 1/9 | 20,000,000 |
| 1/9 | 20,000,000 | 2/1 | 60,000,000 |

Each transition sets current Qi to zero. `AscensionL4L5Procedure` actually advances layer 3 to 4; `AscensionL8L9Procedure` advances 7 to 8; `AscensionL8L92Procedure` advances 8 to 9. There is no evidenced missing 3→4 or duplicate 9 transition. Equality gates deserve overflow/overshoot scrutiny before adapting them; no runtime failure was reproduced.

### Resources, pills, alchemy, techniques, artifacts and combat

**SHOWN:** persistent variables distinguish current/max Qi from `addQi` (initial .1), realm/layer and cultivation toggle (`network/XianxiaModVariables.java`). `QirefinefunctionProcedure.java:6–11` permanently adds .1 to `addQi`; this pill changes future throughput rather than directly granting current Qi. `Qipillmg1effectProcedure.java` gives `QIABSORPTION_3` for 3,600 ticks: **180 seconds at 20 ticks/second**, not the helper's mistaken hour conversion. Grade-labelled pills 1–9 exist in language/item registration; their complete formulas are not inferred from one sample.

**SHOWN:** `RebirthpillfunctionProcedure.java:40–74` resets current Qi, realm/layer, Qi cap, speed and jump to mortal values. Its tooltip says cultivation is reset (SHOWN text). It is not evidence of native heir/retention mechanics. `PlayerstateMortalProcedure.java:30–78` applies actual baseline health 20, attack 1, speed .1, jump .4, safe-fall 3 and related environmental attributes. Higher-layer player-state classes are stat consumers; the full combat curve is unread.

**SHOWN text/data inventory:** grade 1–9 spirit stones, spirit grass/seeds/dust, Golden Lotus, Blood Bulb, Condensed Qi, mortar/pestle and three spatial rings. **SHOWN:** Pill Furnace is a seven-slot persisted container with player inventory; its GUI has no custom action buttons. Targeted recipe-path inventory found six recipe-named paths under `data/`, rather than searching the wrong `assets/` root. A complete furnace cooking/recipe executor was not established, so alchemy remains U where it requires that reference behavior. No complete technique/manual combat library was established. Combat feel remains INFERRED: growth-driven Minecraft stats plus cultivation resources and storage; no played timing evidence.

### GUI, menus, overlays and assets

The class inventory in `static-index.json` intentionally includes both actual client screens (`client/gui/*Screen.java`), a HUD overlay (`client/screens/QidisplayOverlay.java`), and container/menu implementations (`world/inventory/*Menu.java`). A menu is slot/packet plumbing, not automatically a separate visible screen. The actual named screens found in `static-index.json` are:

| Visible screen/overlay | Shown content and decision controls | Texture evidence |
|---|---|---|
| `StatsScreen.java` | Qi, Qi absorption rate, layer number/name, realm number/name; Stats/Sects/Config navigation via four buttons with opaque/empty localization strings (`lang-dump.txt:158,249-251`). | `small_stats.png`, `small_newstats.png`, `stats_menu.png` (`StatsScreen.java:54-62`). |
| `StatsConfigScreen.java` | Max speed/max jump fields and two Set buttons; tabs for Stats/Sects/Config. | `settings_menu.png`; lines 93-99, 106-150. |
| `StatsSectsScreen.java` | Create-name and join-name fields; Create Sect and Join Sect controls, Invites navigation. | `sect_menu.png`; lines 90-186. Join button handler is empty at lines 151-154, so visible affordance is not proof of working join action. |
| `StatsSectsInvitesScreen.java` | Accept-invite field, Join Sect and X controls, three tabs. | sect menu; lines 80-156. |
| `StatsSectsCreateInviteScreen.java` | Invite-player field, Invite Player action, X, three tabs. | sect menu; lines 80-164. |
| `StatsSectsJoinedScreen.java` | Joined-sect/member details, Leave Sect and tabs. | sect menu; lines 70-123. |
| `StatsSectsJoinedLeaderScreen.java` | Leader view; Invite, Kick, Disband Sect, Settings, tabs. | sect menu; lines 74-146. |
| `StatsSectsMembersScreen.java` | Sect Members label/list context, X and tab controls. | sect menu; lines 65-116. |
| `StatsSectsKickScreen.java` | Kick-member field and Kick Member button, X/tabs. | sect menu; lines 72-156. |
| `StatsSectsSettingsScreen.java` | PvP On checkbox, explanatory tooltip, X/tabs. | sect menu; lines 43-130. |
| `PillfurnanceguiScreen.java` | Seven-slot furnace container and title; no visible decision button in screen class. | `pillfurnancegui.png`; lines 18-62. |
| `SpacialRingMG1GUIScreen.java` | Small Storage Ring plus player inventory. | `spacial_ring_mg_1_gui.png`. |
| `SpacialRingMG2GUIScreen.java` | Large Storage Ring plus player inventory. | `spacial_ring_mg_2_gui.png`. |
| `SpacialRingMG3GUIScreen.java` | Spatial Storage Ring plus player inventory. | `spacial_ring_mg_3_gui.png`. |
| `XianxiaguidebookuiScreen.java` | Guidebook introduction, keybinds C=hold Cultivate and V=Stats, “More pages soon...” (`lang-dump.txt:127-128,135,254`); informational, not a demonstrated realm guide. | `xianxiaguidebookui.png`; screen lines 40-79. |
| `QidisplayOverlay.java` | HUD Qi bar and Qi label; drawn at screen top. | `pixelqibarnew.png`, `pixelqibarglassnewtransparentmore.png` (`QidisplayOverlay.java:43-46`). |

Screen artwork also includes `stats.png`, `qi_bar.png`, `small_qi_bar.png`, `condensedqioverlay.png`, `pixelqibar.png`, `pixelqibarglass.png`, `pixelqibarglassnew.png`, `tiny_qi_bar_hue.png`, `very_small_qi_bar.png`, and `xianxiaguibook.png` (`static-index.json` GUI texture inventory; `decompiled/assets/xianxia/textures/screens/`). Presence in the archive does not prove each texture is presently used. Button labels/actions are resolved by the corresponding `Stats*ButtonMessage` handlers; the sect classes include many intentionally empty/opaque buttons, so navigation/control IDs should not be treated as affordances with confirmed behavior without tracing each handler.


Coverage correction: 22 indexed GUI textures, not the helper's stray “489” in its final gap paragraph. All 22 were viewed in a contact sheet. Fifteen named Screen classes plus Qi HUD are cataloged above; 209 broad screen-related entries include packet handlers and helpers. All packet executors, later state rules, pill variants, worldgen, every recipe and the functioning furnace chain remain unread or unestablished.

## Pill Refinement

### Realm, progression, power, and thresholds

- **SHOWN:** No cultivation realms, named ranks, realm numbers, breakthrough evaluator, tribulation, cultivation practice, or character cultivation state appears in the inspected Java/data. The system is a two-workstation recipe chain.
- **STATED:** The page frames pills as a “semi simplified” cultivation-fiction feature, and says manuals are intended to unlock through progression by crafting prior pills (`page-body.md`, Manuals section). This progression claim is not implemented by the inspected recipes: `recipe/manual.json`, `recipe/misc_manual.json`, and `recipe/herb_manual.json` each use a vanilla book plus one common item; no prior pill is required. A fourth item/manual is registered but has no matching `recipe/tang_clan_manual.json` in the prepared data.
- **SHOWN:** Ginseng has variants `ginseng`, `ginseng_100_year`, and `ginseng_1000_year`; the crop block has `MAX_AGE=6` and age property 0–6 (`block/custom/GinsengCropBlock.java:13-35`; `item/ModItems.java:147-155`). These names do not encode a ticking or cultivation threshold. Shapeless slicing gives 4, 6, and 8 sliced ginseng respectively (`recipe/sliced_ginseng.json`, `100_year_ginseng.json`, `1000_year_ginseng.json`).
- **SHOWN:** Four placed features use rarity-filter chance values 1, 2, or 3, then in-square, motion-blocking heightmap, biome placement (`worldgen/placed_feature/{death_blossom,eternal_herb,ginger_100_year,ginger_1000_year}.json`). These are worldgen placement parameters, not realm thresholds. Configured random patches use 96 tries, x/z spread 7, y spread 3 (`worldgen/configured_feature/*.json`).

### Resources, alchemy, pills, artifacts, and combat

- **STATED:** Vanilla dust bases: glowstone dust, redstone, gunpowder, blaze powder, sugar. Custom dust: wheat, cherry, poison, six poisons, Yin Yang, True Death. Binders: wheat, honeycomb, slime ball, snowball, turtle scute, phantom membrane (`page-body.md`, Dust/Binder sections).
- **SHOWN:** Mortar recipes consume one base item plus nine ingredient slots and yield 10 dust: wheat from 10 wheat; poison from sugar + nine poisonous potatoes; cherry from sugar + eight pink petals + one sliced ginseng; Six Poisons from gunpowder, spider/fermented spider eyes, death blossom, poison dust, and stone; Tang/Yin-Yang dust from blaze powder, golden carrots, eternal herb, glistering melon, and six-poisons dust; True Death dust from redstone + nine wither roses (`recipe/wheat_from_mortar_and_pestle.json`, `poison_from_mortar_and_pestle.json`, `cherry_blossom_from_mortar_and_pestle.json`, `six_poisons_from_mortar_and_pestle.json`, `tang_clan_from_mortar_and_pestle.json`, `true_death_from_mortar_and_pestle.json`). Recipe schema requires all ten ingredient positions to match (`recipe/MortarAndPestleRecipe.java:16-60`).
- **SHOWN:** Cauldron recipes pair a dust with a binder; ordinary outputs are ten pills, while some combinations intentionally output ten `random_pill`. Additional vanilla recipes turn blaze powder + gunpowder into 10 fire charges and gunpowder + gunpowder into 20 firework stars. Several binder/dust combinations map to Random Pill rather than a named pill; see the complete JSON family `recipe/*_from_pill_cauldron.json`. Random Pill selects uniformly from the registered `pills` item tag at craft time (`block/entity/custom/PillCauldronBlockEntity.java:110-131`).
- **SHOWN:** Both workstations advance one tick per server tick and require 72 progress ticks; they consume one item from every input slot on completion (`block/entity/custom/PillCauldronBlockEntity.java:39-46,92-139`; `MortarAndPestleBlockEntity.java:32-47,93-134`). The mortar has 11 block inventory slots total: base dust, nine ingredient inputs, output (`MortarAndPestleBlockEntity.java:33-44`). The page says one base plus “10 slots” for ingredients, so its count differs from the implementation (`page-body.md`, Mortar and Pestle section).
- **SHOWN:** Pills are food items. `item/ModFoodComponents.java:9-324` assigns food values, status-effect entries, durations and some amplifiers. Names of the effect registry fields remain intermediary identifiers in this dump, so this note does not guess their human names. Examples: glow variants use `field_5912` at durations 100/300/900/20; gunpowder variants use `field_5919` or `field_5913`; Six Poisons applies six effect entries; Tang Clan/Yin Yang applies three or four; True Death uses `field_5920`. Wheat pills also provide 10.0 saturation (`:165-178`). Many variants change effect duration/amplifier according to binder. The English language file sometimes collapses variants to a shared display name (`lang-dump.txt`).
- **SHOWN:** Thematically named resources/items include Ginseng, Death Blossom, Eternal Herb, manuals, dusts, pills, and the two workstation blocks. The inspected code does not implement cultivation techniques, meridians, breakthrough, artifact equipment, weapon/power progression, combat actions, or combat-specific UI. Pills can grant ordinary status effects when eaten; any combat consequence is an inference from Minecraft effects, not an explicit combat subsystem here.

### Every observed GUI screen, menu, overlay, and recipe view

Three screen classes and three registered screen-handler types occur in the static index. They are distinct from their block-entity inventories.

1. **Pill Cauldron screen** (`screen/custom/PillCauldronScreen.java:11-38`): background plus a progress arrow while crafting. Texture: `assets/pillrefinement/textures/gui/pill_cauldron/pill_cauldron_gui.png`; arrow: `assets/pillrefinement/textures/gui/arrow_progress.png`. Handler slots are dust input, binder input, output, player inventory and hotbar (`PillCauldronScreenHandler.java:16-35,77-88`). No custom tabs or buttons.
2. **Mortar and Pestle screen** (`MortarAndPestleScreen.java:11-38`): background plus crafting arrow. Texture: `assets/pillrefinement/textures/gui/mortar_and_pestle/mortar_and_pestle_gui.png`; shared arrow texture above. Handler lays out one base input, nine ingredient inputs, output, player inventory and hotbar (`MortarAndPestleScreenHandler.java:16-44,85-96`). No custom tabs or buttons.
3. **Manual page overlay/screen** (`ManualItem.java:14-28`; `screen/custom/ManualScreen.java:10-50`): right-arrow `--->` button cycles pages and wraps to page 0; no previous button, tabs, or choices. Four registered manual items point to standard (8 pages), misc (6), herb (4), and Tang Clan (9) PNG page lists (`item/ModItems.java:163-209`). Handler type `ManualScreenHandler` is registered (`screen/ModScreenHandlers.java:25-29`) but has no slots, returns no quick-move result and denies interaction (`ManualScreenHandler.java:10-25`); the manual item opens `ManualScreen` directly, not this handler.

REI is an integration inside the existing recipe viewer, not another standalone mod screen: it registers Mortar and Pestle and Pill Cauldron recipe categories, their workstation icons, ingredient/output slots, and click areas over the arrow area of each workstation screen (`compat/PillRefinementREIClient.java:18-42`; `compat/MortarAndPestleCategory.java:19-109`; `compat/PillCauldronCategory.java:19-63`). No tabs, branch choices, confirmation dialog, or overlay decision controls were found. The page calls REI compatibility out and says manuals can be ignored (`page-body.md`, Manuals section).

#### GUI and manual image locators

- Workstation PNGs: `decompiled/assets/pillrefinement/textures/gui/pill_cauldron/pill_cauldron_gui.png`, `.../mortar_and_pestle/mortar_and_pestle_gui.png`, `.../arrow_progress.png`.
- Packaged page images: `decompiled/assets/pillrefinement/textures/manual/standard_manual/standard_page1.png`–`standard_page8.png`; `.../misc_manual/misc_page1.png`–`misc_page6.png`; `.../herb_manual/herb_page1.png`–`herb_page4.png`; `.../tang_clan_manual/tang_clan_page1.png`–`tang_clan_page9.png`. `gui-contact-1.png` is the prepared contact image alongside the packet, not an in-game asset path.

### Explicit boundaries

No runtime behavior was exercised. The prepared page and metadata are source statements; Java/data describe this exact 0.7.1 archive. No techniques, cultivation-realm labels/numbers, breakthrough thresholds, artifact mechanics, combat rules, or custom combat screens were found in the inspected packet. Recipe data and selected classes above were inspected; this is not a full line-by-line audit of every registration, worldgen class, or resource asset. The version history, prior releases, external wiki/source links, and gameplay behavior remain unread/unverified.

### Coordinator visual review

**SHOWN:** viewed all 28 `textures/manual` PNGs, comprising 27 authored pages plus blank-page art, in `manual-contact.png`. Most communicate recipe grids/icons; several contain sparse explanatory text. The standard manual explains the cauldron and binder substitution, while the Tang Clan pages depict a poison-related chain. This is image-based instructional content, preserved separately from the language dump. Recipe art can be a learning surface without constituting a tested recipe unlock. The mortar screen's nine-cell ingredient grid matches its handler; the page's “10 ingredient slots” does not.

## Ascended Arts

### Cultivation stages, costs, and advancement

- **SHOWN:** Two named ascension skills form a linear branch: Qi Building then Foundation Establishment. The English names and descriptions are in `decompiled/assets/ascended_arts/lang/en_us.json:116-124`; tree data puts Qi Building at `(20,30)`, costs 5 ability points, and Foundation at `(20,130)`, costs 15, with Qi Building as parent (`decompiled/data/ascended_arts/epicskills/entry/path_to_ascension.json:2-40`; generated equivalently by `decompiled/net/arcane/ascended_arts/data/AscendedArtsSkillTreeProvider.java:20-42`). Foundation's condition is at least 20 Evoker kills, represented as the Minecraft player `minecraft:killed` stat (`entry/path_to_ascension.json:14-27`).
- **SHOWN:** Qi Building's data parameters give +10% total attack damage, +9 Epic Fight stamina, +4 max health, and `regen_rate: 5` (`decompiled/data/ascended_arts/skill_parameters/qi_building.json:1-24`). Foundation gives +20% total attack damage, +20 Epic Fight stamina, +8 max health, +10 armor, and `regen_rate: 20` (`.../foundation_building.json:1-30`). Both classes load `regen_rate` and on each kill restore a percentage of missing stamina, capped at 2 stamina per kill (`decompiled/net/arcane/ascended_arts/skill/ascension_path/QiBuildingSkill.java:26-58`; `FoundationBuildingSkill.java:26-58`). The data values therefore mean nominal 5% / 20% of the missing amount, subject to the cap.
- **SHOWN:** Both are passive `Skill.Resource.NONE` skills in the Ascension Path category (`decompiled/net/arcane/ascended_arts/skill/ascension_path/AscensionSkill.java:13-20`; `AscendedSkills.java:26-36`). Their kill effect also triggers the Stamina Pillager death sound/body-ashes effect and a white flash (`QiBuildingSkill.java:31-55`).
- **STATED:** Page text calls Qi Building the “first step,” says it is a small bonus, and says cultivation expansion is planned (`page-body.md:19-35`). This page statement is stale relative to shipped code/data, which also contains Foundation Establishment.
- **INFERRED:** These are the only explicit cultivation/ascension rank names in the inspected pack. No realm ladder beyond these two, realm-number scheme, cultivation meter, accumulation loop, breakthrough ceremony/failure branch, or lifespan implementation is present in the inspected source/data. “Better longevity” appears in Foundation's tooltip prose but the parameter file only supplies damage, stamina, health, and armor modifiers (`lang/en_us.json:121-122`; Foundation parameters above). Advancement is represented by the skill tree's ability-point costs and kill condition; how ability points are earned/spent and the dependency's unlock/equip click behavior are not defined in this addon.

### Sects, techniques, pills, alchemy, artifacts, and combat

- **SHOWN:** One martial-sect skill, registered as `plum_blossom`, is named “Hua Sect”; tooltip text describes Mount Hua's righteous path, cherry-leaf visuals while sprinting, and slower falling (`AscendedSkills.java:34-36`; `lang/en_us.json:114-115`). Tree data sets its cost to 10 ability points and requires mining at least 2,500 cherry-leaf blocks (`entry/path_to_ascension.json:43-65`; provider `AscendedArtsSkillTreeProvider.java:43-56`). Its parameter data gives +15% total attack damage, +20 Epic Fight stamina and +20% base max health (`skill_parameters/plum_blossom.json:1-23`). At Epic Fight-mode ticks, sprinting outside water/crouch/fall-fly conditions emits cherry-leaf particles and applies 5 ticks of Slow Falling; the other branch removes a short remaining Slow Falling effect (`decompiled/net/arcane/ascended_arts/skill/MartialSect/PlumBlossomSect.java:27-116`).
- **SHOWN:** Six weapon innate attacks are named in English strings: Celestial Punishment (rapid back-and-forth), Celestial Onslaught (relentless strikes/dive), Reaping Grasp (extra strikes), Chasing Sweep (forward dash and knockdown), Repeating Sweep (forward/back dash), and Mountain Splitter (`lang/en_us.json:97-108`). Their registrations/properties are in `decompiled/net/arcane/ascended_arts/gameasset/AscendedSkills.java:37-135`; implementations include two-stage dive/follow-up attacks with failure animations and stun immunity (`skill/weaponinnate/CelestialPunishmentSkill.java:27-95`, `CelestialOnslaughtSkill.java:26-91`), four scythe combo extensions (`ReapingGraspSkill.java:24-67`), and a held charge attack with 12-tick minimum, 45-tick normal maximum, 90 allowed maximum (`MountainSplitterSkill.java:32-125`). These are Epic Fight combat skills, not additional cultivation ranks.
- **SHOWN:** The addon adds weapon families and special named weapons, including Jian, small scythes, `Regret`, `Etherveil`, and `Skysplitter`; the page describes the standard material tiers and armor/equipment scope (`page-body.md:5-17`; `decompiled/net/arcane/ascended_arts/world/item/AscendedCreativeTab.java:20-62`; item names in `assets/ascended_arts/lang/en_us.json:1-16`).
- **STATED:** The page describes Epic Fight, Epic Fight Skill Tree, and modpack/dependency use (`page-body.md:65-71`).
- **INFERRED / absent in inspected scope:** No cultivation pill, elixir, alchemy loop, artifact-relic advancement system, or cultivation-specific consumable appears in the searched addon Java/data/page. The `Regret`, `Etherveil`, and `Skysplitter` names are weapons/items here; do not infer artifact progression from them. Search terms included pill/alchemy/elixir/potion/breakthrough/realm/cultivation/artifact; “Pillager” hits are the stamina-restoration kill VFX/audio code above.

### GUI, menu, HUD, and dependency integration inventory

- **SHOWN:** Static index explicitly reports `screens: []` (`static-index.json:1-6`), and the decompiled source inventory contains no addon Screen implementation. This means no custom screen is shown by this pack's index/source; it does not describe screens owned by Minecraft or the dependencies.
- **SHOWN:** Epic Fight Skill Tree integration is the main cultivation GUI. The addon generates one page, `ascended_arts:path_to_ascension`, with gold menu-bar RGB `(255,215,0)`, and three nodes at fixed positions: Qi Building, Foundation Establishment, and Plum Blossom/Hua Sect (`AscendedArtsSkillTreeProvider.java:20-57`; packaged entry JSON above). Page metadata says `hidden:false`, `locked:false` (`decompiled/data/ascended_arts/epicskills/tree/path_to_ascension.json:1-9`). Foundation depends on Qi Building; Plum Blossom sits separately (`entry/path_to_ascension.json:28-65`). No addon-provided page-level or node action callback is present. Ability-point requirements and kill/mined-stat decisions are the explicit node gates. Any actual dependency-owned click, unlock, equip, tab, or confirmation controls remain **INFERRED from the EpicSkills integration**, not inspected in this pack.
- **SHOWN:** Epic Fight categories and slots are registered as `ASCENSION_PATH` and `MARTIAL_SECT`; both categories are saveable, synchronized, modifiable, and have skillbook icons. Their displayed labels are “Path to Ascension” and “Martial Sect”; the ascension category's localized name is “Inner Cultivation” (`skill/AscendedSkillCategories.java:7-50`; `AscendedSkillSlots.java:6-24`; `lang/en_us.json:112,118-120`). Client setup conditionally registers category-slot textures only when EpicSkills is loaded (`Ascended_arts.java:49-63`; `compat/EpicSkillsCompat.java:6-9`). Slot texture enum dimensions/offsets are `(6,6,44,44)` for each (`client/AscendedArtsCategorySlotTextures.java:5-42`; parallel `skill/AscendedSlotTextures.java`). The node state image sets are equipped/unlockable/locked/acquired for both categories, paths listed below.
- **SHOWN:** Skill classes draw 24x24 skill icons on Epic Fight's Battle Mode GUI and overlay a number derived from `maxResource - resource` (`AscensionSkill.java:22-27`; `MartialSectSkill.java:22-27`). Their resources are declared `NONE`; the rendered number therefore follows the dependency container's resource semantics and should not be read as a cultivation counter without runtime evidence.
- **SHOWN:** Built-in Minecraft Creative Inventory has an “Ascended Arts” tab, iron Jian icon, and enumerated equipment/material/trim/banner items (`world/item/AscendedCreativeTab.java:12-89`). This is an inventory tab, not a custom screen. No addon buttons or dialog decisions are coded there.
- **SHOWN:** Skill hover/tooltips supply regen percentages and combat descriptions; weapon innate skills generate phase tooltips (`QiBuildingSkill.java:60-64`; `FoundationBuildingSkill.java:60-64`; `weaponinnate/CelestialPunishmentSkill.java:84-89`; `MountainSplitterSkill.java:121-125`). No additional addon tooltip panel or overlay class was found in the source index.

#### GUI PNG/resource paths

All of these paths are relative to `decompiled/`. `static-index.json:6-25` inventories the GUI resources; the image contact sheet `gui-contact-1.png` visually confirms the four node states, three cultivation/sect icons, six combat icons, page background and page icon.

- EpicSkills node states: `assets/epicskills/textures/gui/widget/node/ascension_path/{equipped,unlockable,locked,acquired}.png`; `assets/epicskills/textures/gui/widget/node/martial_sect/{equipped,unlockable,locked,acquired}.png`.
- Skill icons: `assets/ascended_arts/textures/gui/skills/ascension_path/qi_building.png`, `.../foundation_building.png`; `.../skills/martial_sect/plum_blossom.png`; `.../skills/weapon_innate/{chasing_sweep,celestial_punishment,reaping_grasp,repeating_sweep,mountain_splitter,celestial_onslaught}.png`.
- Skill-tree page art: `assets/ascended_arts/textures/gui/skill_tree/background/path_to_ascension.png`; `assets/ascended_arts/textures/gui/skill_tree/icon/path_to_ascension.png`.
- Skillbook category icons (used by category definitions, outside the static index's `gui_textures` list): `assets/ascended_arts/textures/item/skillbook_ascension.png`, `.../skillbook_martial.png`.

### Coverage and limits

Covered: project/version receipt, page description, language dump, static GUI index/contact sheet, skill tree provider/data, cultivation and sect classes/parameters, weapon innate registration/selected implementations, category/slot and EpicSkills compatibility integration, creative tab. Explicitly absent in the inspected addon scope: custom screen class, pill/alchemy or breakthrough subsystem, broader named realm ladder, additional sect nodes or cultivation resource loop. Not read: unrelated armor rendering, most recipes and item capability files, worldgen structures/loot, emotes, animation frame data, mixin/runtime behavior, EpicSkills or Epic Fight dependency implementation. No network, launch, build, install, or runtime test was performed.

### Coordinator check

**SHOWN:** `data/ascended_arts/epicskills/entry/path_to_ascension.json:12–43` specifically requires **20 Evoker kills** for Foundation, in addition to its Qi Building parent and 15 AP. This is not an unrestricted kill counter or qi-time breakthrough. Code/data spot-check also reopened both parameter files, Foundation's capped missing-stamina restoration, the tree's Hua Sect mining requirement and the provider/slot inventory. The page's “only the first step” remains STATED and stale relative to this pinned two-step artifact; longevity prose does not create a lifespan executor.

## Immortal Cultivation server plugin, list-only

All statements in this section are **STATED**, from the [official plugin page](https://modrinth.com/plugin/immortal-cultivation), preserved in `immortal-cultivation/project.json`. This is a different project from the 69.6 MB mod above. No binary/source/version download or runtime inspection.

The page claims ten realms Mortal→Mahayana, nine stages except Mortal; weighted root rarities with Mortal/Earth/Heavenly/Divine gains ×1/×2/×4/×8. Meditation forbids movement, checks solid ground, displays progress and uses realm caps; pools boost practice and Nether pools protect from fire. Breakthrough resets Qi/XP and adds realm-specific lightning trials. Combat uses armor reduction `damage × 100/(100+armor)`. Nascent Soul Qi infusion costs 1,000 Qi/second for Strength II and Resistance I. Walking on water and flight consume Qi.

It also claims sect creation/invites/ranks/leadership; generated multi-floor cultivation towers with sequential personal unlocks; environment-sensitive races; spirit-stone temporary boosts with cooldown and remaining-time boss bar; custom mobs and realm-scaled drops. Server age increments every ten hours: growing era gains +2% Qi per age, peak era holds, decline trends to zero. That is a regional/time-law proposal source, not proof the plugin implements it.

**Page-listed surfaces:** `/ic realms` interactive realm GUI with stages; meditation action bar; spirit-stone boost boss bar; custom 3×3 alchemy GUI with bulk crafting; unlocked recipe-book/mastery GUI; admin configuration GUI. Alchemy uses spiritual herbs/stones, crop mutation and persistent skill tiers. Sect/ability/race/tower controls are documented largely as commands. Exact screen list, tabs, every realm name, price/recipe tables, artifact system and failure edge cases are unverified by design. Page numbers are not executable defaults.

## Dao Path server plugin, list-only

All statements here are **STATED**, from the [official plugin page](https://modrinth.com/plugin/dao-path), preserved as `dao-path/project.json` and `page-body.md`. No plugin binary/source/version acquisition.

The page claims ten tiers Mortal→Transcendent, starting level 0 with 50 Qi, regeneration each second, XP from kills and `level × 100` next-level XP. Example kill rewards: zombie/spider 10, skeleton 12, creeper 15, Enderman 20, Warden 100; a level grants +50 Qi and higher max Qi. Breakthrough requires level ≥10, current Qi ≥90% and separately accumulated Qi-progress threshold; success resets level to 1 and Qi/progress. Tier 4+ trials provide a 5-second warning and dodgeable lightning, failing on death.

Config examples give 1 Qi/second base, ×1.5 per realm; Qi Gathering 100 cap/1,000 progress, Foundation 500 cap/5,000 progress; Qi Blast 20 Qi/3-second cooldown/10 damage/20 range; Qi Shield 30 Qi/8-second cooldown/5-second duration/50 absorption. Flight example unlocks tier 3 and costs 5 Qi/second. Combat example has base damage 5, ×2 per realm, ×2 critical damage and 10%/15% critical odds for tiers 4–6/7–9; prose claims up to 50% defensive reduction. These are page/config examples, not proven live defaults.

**Page-listed surfaces:** action-bar Qi, `/cultivate info`, `/cultivate realm`, `/breakthrough info`, skills/bindings and admin/status commands. Eleven skills and three input slots are claimed, with new skills filling empty bindings. Page introduction uses sneak+click while its later overview says click; preserve that input inconsistency. No dedicated inventory GUI or page-by-page screen implementation is established. Realm potion effects are described, but no pill/alchemy/artifact pipeline is established. Its separate current reserve, accumulated breakthrough progress and kill XP are useful distinctions even if a world chooses different acquisition verbs.

## Current native source reconciliation

Read current working files on 2026-10-25, including concurrent cultivation additions; none edited. The older audit called several of these missing. Native locators below identify current producers and consumers, not rerun gameplay acceptance:

| ID | Current producer → consumer inspected | Credit and boundary |
|---|---|---|
| N1 | `src/cultivation_root.js` draw/test/rootRateBonus → `src/absorb_p23/world_adaptation/techniques.js:23–30` | Birth/inherited flow/still affinity affects actual method rate; no five-element root-generation/conflict graph. |
| N2 | `src/absorb_p23/world_adaptation/discipline.js:16–47`, `src/vessel_geometry.js`, `src/vessel_mantras.js` → cultivationView/advanceCultivation in techniques | Nodes, ring adjacency, law depth/comprehension and composed mantra bonuses affect intake/odds/work. These are real existing mechanisms, not empty descriptors. No named 27-stage/lifespan ladder is implied. |
| N3 | `src/craft_resolver.js:113–202`, `src/crafting_frontier_runtime.js:126,168–207` → `src/crafting_domain.js` quote/commit | Directional order, thermal residue, mind/apparatus control, product identity and real stock exist. Source exact recipes are palettes, not required parity. |
| N4 | `src/craft_body_treatment.js:5–48` → runtime consumeTablet/startTreatment and `src/crafting_domain.js:16–18` | Permanent conditioning, body-bound residue/capacity, timed purge/cap/channel treatment and apparatus exist; conditioning changes actual max stamina. No realm-relative four-stage toxicity policy established here. |
| N5 | `src/home_cultivation_content.js`, `src/home_cultivation.js:20–33` → existing home jobs, study/teaching and current field | Finite powered household qi field and qualified teaching are real; not Minecraft world veins or a complete sect-government/tower economy. |
| N6 | `src/breakthrough_trial.js:25–56`, `src/pledges_domain.js` | Paid-risk trial, pressure/stability/scar costs and outcome consumer exist. Local authored tempering is not a moving lightning scene or tile-rotation Golden Core puzzle. |
| N7 | `src/vessel_thread.js`, `src/vessel_thread_domain.js` support/bind → Mistglass preparation join; `src/absorb_p23/living_gear/index.js` wornMinutes/memoryTempering → native equipment path | Actual named equipped/body-bound carrier and played-time living weapon growth exist. Not a sword nest, controlled many-sword array or weapon-specific ascension trial. |
| N8 | `src/techniques.js`, `src/energy_resources.js`, `src/combat_math.js`, `src/combat_readout.js`, `src/equipment_stats.js` | Actual learned/body/source and shared combat/stat owners. Not evidence for direct 3D combo timing, an Epic Fight dependency GUI or stamina-on-kill cultivar integration. |
| N9 | `src/gear_work.js`, `src/gear_affixes.js`, `src/loadouts.js`, `src/artifact_collection.js` | Craft/affix/equipment and exact-item custody/assembly mechanisms exist. Framework artifact definitions do not prove every collection is activated. |
| N10 | `src/cultivation_guidance.js` → Mistglass current frame/action targets | Discovered bottleneck advice checks actual pending work, reserve, impurity, law depth and comprehension. No need to propose a second progression guide owner. |

## Combined absorption matrix

Each row is one mechanism family; counts are over these rows, not over every item/icon. Every row first maps to an existing CG family, so no new lane gap IDs are necessary. A row's mark is for the specific native mechanism named, not the entire source mod. Both source approaches can be world defaults under AD5; AD38 asks for a mechanism and cost rather than a label permission list.

| Row / CG | Reference variants and how they differ | Native mark, producer/consumer | Proposed extension / default, dial and reason | Done check if selected / level, effort |
|---|---|---|---|---|
| M5-01 / CG04 | Journey: five-element strengths, narrow-root speed vs multi-root capacity/conflict. Immortal: root/body selection plus method caps. Plugin roots use rarity multipliers. | P, N1/N2. Actual affinity rate and node geometry exist; elemental generation/conflict, root-conditioned technique ecology incomplete. | Extend existing root/method laws with optional element graph. Dial speed/capacity/control separately because concentrated and broad roots handle energy differently. | Two tested roots change two real operations under one world's graph; hidden root stays undisclosed until earned test. L2, medium. |
| M5-02 / CG06/07 | Journey: 27 enum values plus substage/lifespan/flight/sense. Immortal: nine three-stage realms plus Half-Step bridge. Xianxia: realm and layer dimensions. Arts: two AP/deed nodes. | P, N2/N4/N8. Method/law/body progression exists; source-scale named realm ladders and their lifespan/stat/travel consumers do not follow automatically. | Author realm data using existing progression/body owners. Dial transition breadth and material consequences by world, not a universal realm enum. | One stage changes a concrete supported action and exposes earned next gate, with body/carry boundaries. L2, medium. |
| M5-03 / CG01 | Journey uses differentiated telegraphed phases; Immortal Golden Core rotates formation tiles; Dao Path page claims dodge lightning. | P, N6. Real paid-risk trial exists, spatial/puzzle execution absent in inspected seams. | Extend existing trial owner with an optional causal formation/response phase. Default local tested risk law; dial type, warning and failure cost according to actual threat. | Two preparation/response choices alter a real attempt; costs and partial/failure aftermath survive reload. L3, high. |
| M5-04 / CG04/12 | Journey paid seclusion compresses years/fuel/lifespan; plugins recover Qi by time and keep accumulated progress separate; Xianxia refinement pill raises future intake. | P, N2/N5. Practice allocation, actual reserves and funded jobs exist; year-compressed personal retreat is distinct. | A funded retreat job on existing clock, with disclosed time/lifespan/fuel, interruption policy and choice stop. Dial density/risk by site. | Interrupt/reload one retreat and settle exactly consumed fuel, elapsed cost and retained progress; no invented offline equivalence. L2–3, medium/high. |
| M5-05 / CG15 | Pill Refinement exact dust→binder two-station chain; Journey herb-age/core-tier/probability recipe; Immortal formula core plus elemental additives/stability/conflict. | P, N3. Actual chemistry/order/thermal/grade and stock are present; age/core eligibility and source additive topology not full parity. | Reuse craft recipes/material provenance/stations. Dial herb maturity, matching core and additive effects because material development changes reaction. | A known recipe accepts a supported substitute, predicts distinct result/residue, then consumes exact stock and persists product. L2, medium. |
| M5-06 / CG19 | Immortal toxicity scales recipient realm, quality, repeated pill and potency; Journey has quality/age; native has permanent conditioning/residue capacity. | P, N4. Real residue/conditioning/treatment exists; contextual repeat/realm toxicity differs. | Add policy factors to current dose/treatment owner, default existing residue rule. Dial integration stress by recipient and repeated exposure; preserve poison as separate mechanism. | Same pill has justified different consequence for two recipients/repeat histories; cure pays real cost and persists. L2, medium. |
| M5-07 / CG18 | Journey owner-bound levelled artifact and sword inscription; native named carrier retains preparation and living blade grows with actual wear. | A, N7/N9, for actual instance growth/binding analogue. Sword arrays/multiple controlled carriers remain outside this A credit. | Extend existing physical instance records if another world needs inscription compatibility or a different growth input. | Equip/use/remove actual item and observe reversible effect; growth record travels once without duplication. L2, medium. |
| M5-08 / CG18/21 | Journey nest manages many swords and assignments; Immortal weapon growth/binding/tribulation families; Arts weapon innates alter maneuvers. | P, N7–N9. Equipment/loadouts/affixes/actual item custody exist; controlled sword-array and weapon tribulation consumers incomplete. | Optional real carriers reserved into a supported combat command. Dial attention/fuel/formation and agency costs; it need not be restricted by “sword” label. | Reserve two real items, execute one supported joint action, reject unavailable carrier, reload exact state. L3, high. |
| M5-09 / CG06/17 | Arts AP/deed unlock grants passive modifiers and capped stamina-on-kill; Journey root/manual arts; Immortal method-specific caps and learning puzzles. | P, N2/N8. Practiced methods and consumers exist, no equivalent deed/AP-to-capped-kill-recovery loop inspected. | Bind an earned technique/deed to existing combat event and resource owner; dial benefit by learned mechanism rather than importing Minecraft kill counts. | Natural unlock followed by real kill/use changes declared resource exactly once; removing source suppresses benefit. L2, medium. |
| M5-10 / CG05/22 | Journey contributions/shop/path/permissions/war/library; Immortal NPC teach/trade/quests; plugin sect ranks/leadership. | P, N5 plus home work/office and standing owners. Funded teachers/offices real; full sect governance and declared war not implied. | Extend existing person/job/standing owners with bounded membership service and contribution consideration. | Named person earns a service from real contribution, executor rechecks access and stock; refusal/relationship aftermath visible. L2, medium. |
| M5-11 / CG10/11 | Plugins claim pools and staged towers; Journey regional density and territory. | P, N5 plus known_routes/structured_expedition_runtime. Finite household field and authored routes exist; reference tower/world density chain not complete. | One known qi-rich site can alter real practice and upkeep, or one declared trial floor can settle risk/reward. Dial density/ownership/decay from site mechanism. | Travel/preparation reaches supported site, actual rate/encounter changes, leaving restores conditions and records aftermath. L2–3, medium/high. |
| M5-12 / CG16 | Journey hub/journal/discovery recipe guide; Immortal DaoGuidance; Xianxia guide mostly controls; native live bottleneck advice. | A, N10, for actionable discovered bottleneck guidance. No source catalogue parity implied. | Enrich existing guide when a selected real gate has another known remedy; do not add a rival universal checklist. | Changed reserve/impurity/gate updates existing actionable advice and target resolves the same quote. L1–2, low/medium. |
| M5-13 / CG07/21 | Immortal text promises risky Qi gathering, terrain spells and self-sacrifice; Journey kinetic aerial/sword combat; Arts dash/charge/combo innates. | U, N8. Native combat is real; complete reference execution/timing and native comparable journey were not established. | Research a named timing/terrain question before selecting adaptation. If selected, use abstract response windows/terrain consequences suitable for idle combat. | First trace exact executor; then compare two rebuilt desktop encounters using the selected cause. L3, high, research-first. |
| M5-14 / CG23/24 | Immortal life tabs, relationships, delayed favors/events, planning and inheritance sit beside real-time cultivation. | U. Chronicle/continuation/person owners exist; source life executor and reward crossing not read sufficiently. | Keep simulated-life reward export separate from natural heir or body continuation until traced. | Trace one full event→settlement→inheritance route before assigning A/P/M. L1 research, medium. |
| M5-15 / CG15/16 | Xianxia has a named furnace and seven slots; Pill Refinement has proven recipe evaluators and two progress screens. | U for Xianxia furnace operation, N3 cannot resolve a reference uncertainty. | Preserve a visible container versus a functioning process as separate evidence. | Locate recipe/executor and prove static input→output binding before calling an alchemy gap. L1 research, low. |
| M5-16 / CG06/29 | Dao Path separates reserve, progress and kill XP; Immortal plugin advertises era-dependent Qi decline. | U, page-only plugin laws. Native reserve/practice/clocks exist, no binary verification allowed here. | Keep as a world-law palette: reserve funds action, progress expresses integration, era conditions the source. Dial can vary independently. | If later authorized, source-read exact counters and one era transition before executable adaptation claims. L1 research, low/medium. |

Counts: **A 2, P 10, M 0, U 4** over 16 rows. Zero M is not “nothing missing”: most families contain existing native producers plus a named missing extension, which is P. U is not a mandate to implement unknown reference behavior.

## Desktop UI patterns to borrow separately

| Pattern | Source evidence | Proposed native fit and check |
|---|---|---|
| Contextual hub and return labels | Journey hub and explicit Menu/Nest/Stats destinations | Reuse current center-mode history and persistent nav, UR9/10/21–24. At 1920×1080 keep work/log visible; no imported vertical ten-button stack if it crowds the current frame. |
| Risk and material consequence beside action | Journey seclusion years/fuel/lifespan; Immortal toxin/temperature and Golden Core status | Extend existing quote/preview region with actual cost, consequence and stop reason. No independent UI math; changed input must change the executor's quote. |
| Knowledge versus execution | Journey discovered recipe guide; Pill Refinement manuals plus REI; native bottleneck guide | Keep discovered explanation adjacent to the actual station/action. Native instructions should identify actionable input/output and distinguish image-based advice from recipe availability. |
| Multiple mechanics sharing one progress surface | Immortal ordinary stats plus special Golden Core puzzle; Arts dependency-owned skill-tree states | Same progression owner may open different earned interaction types. Retain back route and clear result/cost; node art does not justify a new resource owner. |
| Fewer unlabelled controls | Xianxia's blank/opaque tab strings and empty join callback | Use explicit destination labels and disabled reasons, UR10/14/26. A visible button needs the actual native transaction behind it before any completion claim. |

No UI was built or browser-tested. Target is desktop 1920×1080, with MacBook and 1536×864 checks if selected later; mobile remains deferred. PNG viewing here is reference inspection, not rebuilt native evidence.

## Proposed first five, scope and acceptance

All five are proposals for coordinator selection, not a new build order or permission to change runtime:

1. **M5-01:** elemental root tradeoffs on existing affinity/method consumers, L2 medium. A different root must change actual rate and capacity/control in a supported world, with earned reveal.
2. **M5-05:** mature-herb/core eligibility plus additive effects on current crafting, L2 medium. Preview and settled batch must agree on exact material custody, result and residue.
3. **M5-06:** contextual pill toxicity using the current body/dose ledger, L2 medium. Recipient and repetition affect a real consequence and a paid treatment clears the declared state.
4. **M5-03:** one causal Golden Core/tribulation interaction under the existing trial owner, L3 high. Preparation and response change actual outcome with persistent cost/aftermath.
5. **M5-08:** a bounded multi-carrier artifact command, L3 high. Two owned instances are reserved, used and restored/consumed under explicit local terms without duplication.

ACT NOW: acquired/hashed/extracted the five mods; dumped text and viewed GUI/manual assets; cataloged screens, reconciled live native seams and corrected reader errors in this report. ACCOUNT FOR NOW: AP/deed, qi-time, body integration and material maturity solve different progression problems; count them separately and allow both as world defaults. Localized descriptions, page promises, inventory screens and executed mechanisms retain separate evidence states. LATER: exact station/pill/combat/tribulation/life executors and several screen click routes remain the named reading gaps, with level/effort above; this pass does not authorize Minecraft launch, dependency download or a new research wave.

## Review, checks and unread remainder

Coordinator reviewed high-consequence helper claims against source: Journey enum/thresholds/roots/recipes/artifact and tribulation paths; Immortal realm tuples, Golden Core controls, alchemy failure predicates, toxicity factors and major tab enums; Xianxia all ten ascension assignments, actual naming files, pill duration/rate changes and mortal stat consumer; Pill Refinement slot grid, tick cost, random-pill selection, recipe matching and manual page loop; Arts AP/deed gates, both stat parameter files, capped kill restoration and tree/slot integration. Corrections are incorporated above; private helper notes remain original bounded returns. This is independent coordinator review of helper extracts, not a second whole-corpus read.

| Command/check | Result / gaps |
|---|---|
| Official API acquisition + `hashlib.sha512` comparison | PASS, five jars match published SHA-512; two plugin metadata-only captures. |
| `zipfile` inventory/path-contained extraction | PASS, inventories retained; no jar/repo installed or executed. |
| Vineflower five static decompilations | Java output present for all five; zero ERROR log lines. Decompiler correctness not independently established for all methods. |
| Python text/index/contact-sheet generation | All available language and text assets preserved, screen class names/GUI paths indexed; coordinator viewed eight GUI sheets plus manual sheet. Not full semantic reading of every class/text. |
| Targeted `rg`, `sed` and Python transition extraction | Native producers/consumers and consequential mod claims source-read; helper errors corrected above. |
| Python document/receipt/native snapshot validation | PASS: five byte/hash and ZIP CRC checks; seven source identities; local Markdown targets resolve; two plugins contain no jar or versions capture; 16 unique matrix rows produce A2/P10/M0/U4. 28 current native files SHA-256 recorded in private `M5_NATIVE_EVIDENCE.json`. Screen-name sweep found four outside-package screens, now included. |
| Python report whitespace/structure validation; `git diff --check -- <M5 report>`; private ignore check | PASS explicit whitespace/row checks after removing one trailing space; diff check returns zero but does not inspect this untracked report. Private receipt matches repository ignore rule. Report remains untracked and uncommitted. |
| Gameplay build/tests/browser/app/publication | Not run; docs-only research and private static extraction. No gameplay acceptance claim. |

Unread/unverified: complete Journey technique/combat/sect/aging/seclusion termination catalogues and per-realm tribulation outcomes; Immortal every spell/recipe/weapon-trial/NPC/life/card executor, full custom-screen click-to-server flows and default toxicity policy; Xianxia full stat curve/pill grade effects/recipe and furnace execution, worldgen and sect handlers; Pill Refinement intermediary effect-field semantic names and unsampled recipe/plant class details; Arts dependency-owned menus, all combat animation timings/item capabilities and unrelated armor/emote code. Plugins intentionally remain page-only. No claim of “every feature tested” or full-source read is made.

Research index integration belongs to the wave coordinator under COMMON's docs-only ownership boundary. This report is the M5 return; no protected owner or sibling lane file was edited.
