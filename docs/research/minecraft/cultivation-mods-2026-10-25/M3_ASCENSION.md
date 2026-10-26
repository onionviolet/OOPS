# M3: Ascension (MrEizy), source absorption audit

2026-10-25. **Research delivered; static source/data evidence, no Minecraft play verification.** No runtime edits, mod execution, installation, build, commit or push. Findings and adaptation proposals are not accepted design decisions.

## Scope, authority and evidence

Follows [COMMON](../../../gm/dispatch/minecraft-cultivation-mods-2026-10-25/COMMON.md), [systems register](../../../SYSTEMS_REGISTER.md), [cultivation comparison definitions and CG ledger](../../itch-io-2026-10-22/CULTIVATION_ABSORPTION_CHECK.md), and the current working-tree source. Rules applied: AD5/6–8/32/34/36/38/41; WPR1–5/9–23/27–32; AU1/2/5–7/10–12; MR1/5/21–23; UR49/59–64. Desktop adaptation target is 1920×1080; mobile optimization remains deferred. This report proposes no UI implementation.

**SHOWN** means source, data or inspected artwork establishes the claim. **STATED** means author documentation, guide prose or metadata says it. **INFERRED** identifies an interpretation or unproved reachability. No label means played evidence. A/P/M/U use the existing audit's meanings: functional analogue with producer and consumer; partial analogue; missing within inspected paths; insufficient reference/integration evidence. These marks do not mean copied, shipped, installed or director-accepted.

Budget: one root plus three fresh Luna-medium extraction jobs, each bounded to 12,000 source words and six responses, owning separate private notes. No paid fallback. Allowance telemetry unavailable. Root reconciled source versions, read the release's guide prose, spot-checked reader claims and inspected native consumers. Model requested: Sol medium; this report does not assert an API-side model change.

## Acquisition receipt and version reconciliation

**F1. The June release and October main branch are substantially different implementations.** The release source was recovered separately; no decompilation was needed.

| Artifact | Pinned identity | Result |
|---|---|---|
| Official jar | [Modrinth project versions API](https://api.modrinth.com/v2/project/perfect-ascension/version), primary `ascension-0.1.8.4.jar`, version ID `Br6cza2J`, published 2026-06-20 16:43:58 UTC | **8,224,250 bytes**; 4,354 ZIP entries; official SHA-512 verified |
| Default branch shallow clone | [main snapshot](https://github.com/MrEizy/Ascension/tree/1f11509c38dc59f07362ebd24b4dee07d8499516), `1f11509c38dc59f07362ebd24b4dee07d8499516`, Oct 8 UTC | `0.2.0-bugTest`, MC `26.1.2`, NeoForge `26.1.2.95`; package `net.zic` |
| Exact-version release source | [release snapshot](https://github.com/MrEizy/Ascension/tree/187a839caf7d1522ff7ad15b42bcd5bec07e95b6), `187a839caf7d1522ff7ad15b42bcd5bec07e95b6`, June 20 16:35:51 UTC | `0.1.8.4`, MC `1.21.1`; package `net.thejadeproject`; direct Java reads |
| Retained release branch | `e2f51a683a1057a4a2699973babdc29aa21f664c` | `0.1.8.7`, MC `1.21.1`; retained for comparison, not confused with downloaded release |
| Initial date-only history probe | `787f2cce128d983a4f3958b736b241a96f134540` | Already targets `26.1.2` / `0.2`; not a release-source match. Corrected by querying the `1.21.1/release` branch history |

Jar SHA-256: `ed9fefc24835a16534ebc99d20f8dbb4240a45237365809c594b95f03a2a748d`.

Verified SHA-512: `2a77e6e5dff7d4dfda4585289f851ad3b0f54437617880bea3842f35843cc6b54e6a7fe5a6466e68bbe1dc69f472b4c84b7fd403fa7121490fc5734b6122137f`.

Private evidence home: [perfect-ascension](../private/cultivation-2026-10-25/perfect-ascension/). Files: `receipt.json`, `archive-inventory.json`, `resource-diff.json`, `release-branch-resource-diff.json`, `release-0.1.8.4-resource-diff.json`, complete resource inventories, language dumps, guide text dumps, `source-path-catalog.json`, `source-data-catalog.json`, `release-registries.json`, recent commit/API captures and three reader notes. Original source/assets remain gitignored. Main checkout including its Git store is about 24.9 MB; extracted 0.1.8.4 source is 10,475,817 bytes, 0.1.8.7 source 10,872,537 bytes, and date-only probe 6,814,583 bytes. These are local-tree byte counts, not network transfer sizes.

### Data/assets diff

Merged main and generated resource directories before comparing. ZIP directories, compiled classes and META-INF are excluded from the resource comparison.

| Comparison to the jar's 3,169 data/assets files | Identical bytes | Changed bytes | Source-only | Jar-only |
|---|---:|---:|---:|---:|
| Current main, 2,517 resources | 667 | 426 | 1,424 | 2,076 |
| 0.1.8.7 release branch | 2,793 | 376 | 68 | 0 |
| Exact-version 0.1.8.4 source | 2,814 | 355 | 0 | 0 |

The 355 changed files in the exact-version source are **formatting/line-ending differences only** after JSON comparison or newline normalization: **zero semantic changes**. Two extra non-data/assets source resources (`accesstransformer.cfg`, mixin configuration) are recorded in the complete source resource inventory, not counted in the table. All jar data/assets paths exist in the recovered 0.1.8.4 source. This is strong resource parity evidence, not a reproducible-build proof for Java bytecode.

Main has 379 custom Ascension registry JSONs, including 47 paths, 57 physiques, 39 bloodlines, 32 techniques and 154 skills. Jar has no corresponding custom `data/ascension/ascension` subtree; its progression content is Java-registered. Jar data includes 332 recipes, 247 loot tables, 131 loot modifiers, 333 modern singular-folder advancements plus four journal files in the older plural folder, and 42 worldgen JSONs. Main's merged generated resources instead include 60 recipes, 98 loot tables, 47 modifiers, 60 singular-folder advancements and 236 worldgen JSONs. Do not infer deleted gameplay simply from lower checked-in generated counts.

### License and dependencies

**F2. Licensing metadata conflicts.** [LICENSE.txt](https://github.com/MrEizy/Ascension/blob/1f11509c38dc59f07362ebd24b4dee07d8499516/LICENSE.txt) is All Rights Reserved with conditional developer/owner-permission language. Both version snapshots' Gradle properties and jar mod metadata say MIT. The actual license file is the conservative authority for reuse; the MIT metadata is not treated as permission to copy this mod. This report copies no implementation or artwork. Source is retained privately for the authorized inspection. Design mechanisms are paraphrased for original implementation.

README texture credits point to `malcolmriley/unused-textures`, `Foreck1/foreck-textures` and `Futureazoo/TextureRepository`. Main's `THIRD_PARTY_LICENSES.md` additionally names MIT-licensed Scannable and Graveless rendering ancestry. These are texture/rendering references, not cultivation-mod candidates.

Jar metadata: required NeoForge `[21.1.0,)`, Minecraft `[1.21.1,1.22)`, Easy GUI `2.0`; optional Curios `9.5.1+1.21.1`, JEI `19.21.2.313`, Modopedia `[1.1.11,)`, Jade `15.10.3+neoforge`. Main also refers to Builders-Zenith and ZenithLib integration. Dependencies are not automatically cultivation-themed recommendations.

## Source locator key

`R` = private `source-0.1.8.4/`; `S` = private `source/`. `RJ` = `R/src/main/java/net/thejadeproject/ascension/`; `SJ` = `S/src/main/java/net/zic/ascension/`. `RP` = `RJ/refactor_packages/`. Paths below are relative to these pinned roots. This keeps the released Java implementation distinct from current main. Full raw tables stay private, with original files and stable line locators.

## Realms, resources and cultivation laws

### Released 0.1.8.4

**F3. SHOWN: progression separates realm progress, accumulated foundation quality, spendable qi, path affinity and technique history.** Those are different quantities, despite some progress functions being named `getMaxQiForRealm`.

| System | Source behavior and important numbers | Primary locator |
|---|---|---|
| Essence | Named realms: Mortal, Qi Condensation, Formation Establishment, Golden Core, Nascent Core | `RP/paths/ModPaths.java:36–50`, release `en_us.json` |
| Body | Mortal Body, Skin Tempering, Sinew Weaving, Bone Forging, Heart Kindling | Same file:53–67 |
| Soul | Mortal Soul, Battle Soul, Azure Soul, Silver Soul, Gold Battle Soul | Same file:69–83 |
| Secondary paths | Poison; fire/water/wood/earth/metal; lightning/wind; sword/axe/blade/spear/bow/trident/mace/shield/fist; Buddhist/demonic/virtuous. **23 registrations total** | `RP/paths/ModPaths.java:14–284`; full IDs in private registry inventory |
| Minor stages and caps | Generic path defaults return maximum major index 5 and minor index 9, while principal registries name five major realms. Technique overrides control actual caps. Do not call this a fully named six-realm shipped ladder | `RP/paths/custom/GenericPath.java:87–139`; `RP/paths/data/IPathData.java:50–66` |
| Realm threshold curve | Generic base 6,485; minor multiplier 1.3; major multiplier 3.5; multipliers grow by 0.03 and 0.2 respectively per major realm. Each prior major iterates nine minor multiplications before the major jump | `GenericPath.java:98–135`. Technique overrides can replace it |
| Foundation | Suppression redirects cultivation into foundation rather than ordinary realm progress, adding one foundation-progress unit per call. Essence/soul requirements at major indices 0–4: 100k/200k/300k/400k/1m; body: 10k/20k/30k/40k/1m | `RP/util/CultivationUtil.java:23–54`; `ModPaths.java:36–77`; `RP/paths/custom/FoundationPath.java:125` |
| Foundation stages | Logarithmic stability handler; stage boundaries every 25 percentage points; negative foundation yields a broken state; full foundation plus primordial flag gives stage 5. Foundation stages apply identified `0.1 × stage` final stat modifiers. The realm-name list duplicates one translation key, so labels are not a clean unique six-name ladder | `RP/paths/data/foundation/RealmFoundation.java:24–98`; `FoundationPath.java:46–100` |
| Spendable qi | Actual inspected `EntityQiContainer` is one scalar reserve clamped to max, with regen and spend checks. Its comment describes attributed sections/random spending, but those are not implemented by this class | `RP/qi/EntityQiContainer.java:28–82` |
| Cultivation rate | Amount is multiplied by main and attributed path bonuses, then passed through a cultivation event. At the threshold, minor change or eligible major change occurs directly; ordinary growth is blocked during an active breakthrough | `RP/util/CultivationUtil.java:35–80` |
| Technique memory | Current technique, per-technique data and completed-major-realm technique history are saved separately; old technique data may be removed if neither current nor in history | `RP/paths/data/SimplePathData.java:31–50,148–186,240–277` |

Distinct acquisition laws are real, rather than merely different path names. **SHOWN:** Open Sky Breathing requires sky visibility at start and every continuation check; base rate 3 per cultivation call (`RP/skills/custom/cultivation/essence/OpenSkyBreathingCultivationSkill.java:24–67`). Generic cultivation channels while the skill-cast input remains held, with no cooldown (`.../cultivation/GenericCultivationSkill.java:153–183`). Soul methods have their own cast/continuation requirements; sun/moon specializations, poison refinement, weapon use, bloodfeast kills and elemental-body combinations have dedicated implementations. Registries contain **53 technique**, **94 skill**, **70 physique** and **15 bloodline** literal registrations; these are declarations, not proof of every item's natural acquisition.

**SHOWN example of genuinely different body practice:** Marrow Furnace advances from damage the practitioner deals, not damage taken. It requires damage ≥4, spends qi equal to `damage × 0.35`, and grants `sqrt(damage) × 2`, with multiplier +0.35 when the player is at or below half health (`RP/skills/custom/cultivation/body/MarrowFurnaceCultivationSkill.java:23–62`). The bloodline/physique layer can grant paths, stats and skills; evolution handlers cover medicinal treatment, kills and elemental transformation. Meridian conditions are represented as physiques, skills/debuffs and effects. No general anatomical meridian graph was established.

### Breakthroughs and failure

**F4. SHOWN class, INFERRED reachability:** `NineHeavenlyTribulations` waits at least 40 ticks between strikes and requires an air column up to y=350. Damage scales with strike number and elapsed waiting time; nine strikes complete a major realm change. Death clears the breaking-through flag. Its save method returns null and network encoder is empty (`RP/breakthroughs/NineHeavenlyTribulations.java:20–96`). Technique factories return this class, but the inspected ordinary `CultivationUtil.tryCultivate` directly advances realms and a bounded search found no `setBreakingThrough(true)` call. Do not describe ordinary release progression as proven to start this trial or claim a working persisted failure/retry loop. `handlers/tribulation/BreakthroughHandler.java` is only a map holder.

**SHOWN alternative setback:** foundation can become negative, previous foundations persist by realm, and downward realm changes have explicit callbacks (`RealmFoundation`, `FoundationPathData`). This is not proof that every failed breakthrough lowers a realm. Separate death, medicinal corruption, damaged channels and actual trial failure instead of inventing one universal penalty.

### Current main 0.2 snapshot

**SHOWN:** 47 path JSONs comprise three foundation, 29 elemental and 15 weapon paths. The principal ladders now have twelve major realms and three minor stages (Low/Mid/High); elemental ladders have nine majors and weapon ladders six. Private `source-path-catalog.json` retains every name and threshold.

| Foundation | Major realm names, in order |
|---|---|
| Essence | Qi Formation; Foundation Building; Core Formation; Core Tempering; Core Perfection; Nascent Core; Dao Foundation; Dao Formation; Dao Ascension; Heavenly Dao; Immortal Foundation; Immortal Ascension |
| Body | Body Tempering; Bone Forging; Marrow Refinement; Tendon Strengthening; Blood Refinement; Flesh Sanctification; Iron Body; Diamond Body; Vajra Body; Divine Body; Immortal Body; Eternal Body |
| Soul | Soul Awakening; Spirit Forging; Soul Fixation; Spirit Tempering; Soul Condensation; Spirit Severing; Soul Ascension; Divine Spirit; Soul Transcendence; Immortal Soul; Divine Soul; Eternal Soul |

The actual three foundation JSON ladders use thresholds **`10^(2n+3)`, `10^(2n+4)`, `10^(2n+5)`**, for major index `n=0…11`: first major 1k/10k/100k, next 100k/1m/10m. This corrects the extraction note's mistaken `3n` formula and 1,000× statement. The next major scales by 100×, with adjacent high/low thresholds equal. These are declared progress thresholds, not qi costs or measured session durations (`S/src/main/resources/data/ascension/ascension/paths/foundation/{body,essence,soul}.json:9–201`).

Elemental IDs: blood, chaos, dark, death, earth, fate, fire, gravity, ice, illusion, karma, life, light, lightning, metal, moon, order, poison, reincarnation, sound, space, star, sun, time, water, wind, wood, yang, yin. Weapon IDs: axe, blade, bow, fan, fist, halberd, hammer, knife, mace, shield, spear, staff, sword, umbrella, whip. Each is data presence; a name such as time or reincarnation does not prove world-clock or rebirth mechanics.

`SJ/impl/core/path/simple/SimplePathInstance.java:63–77,110–124,178–192,239–247` caps progress, supports explicit/instant breakthrough behavior and starts configured tribulations with completion callbacks; the non-instant timer branch remains TODO. The inspected foundation data did not establish ordinary tribulation assignments. The one test tribulation file is not evidence that all paths use it.

**SHOWN:** current attributes default to max qi 100, qi regen 1, health regen 1, max stamina 100, stamina regen 10 and regen delay 40 ticks (`SJ/common/util/AscensionAttributes.java:15–52`). Body-cultivation service accumulates tempering, simulates costs and then spends resources for progress. Stamina recovery scales with food state: 1.10 with saturation, 1.00 at food ≥12, 0.70 at ≥6, 0.35 above zero, zero at zero food (`SJ/impl/resource/stamina/StaminaService.java:47–73`). Chunk qi has its own capacity, regen and persisted amount (`SJ/chunks/atmospheric_qi/ChunkQiHandler.java:15–126`). This supports environmental scarcity/renewal as a mechanism; full biome-to-player intake and formation consumers were not exhaustively traced.

## Techniques, skills, body traits and attributes

**SHOWN current main:** 154 skill JSONs: 82 castable, 48 passive, nine body-cultivation, 15 mob-skill. Thirty-two technique JSONs include one example and 31 rank-grouped entries (13 Ordinary, nine Profound, nine Heaven). Fifty-seven physiques and 39 bloodlines are data definitions. Registry sizes do not establish every combination as reachable.

**STATED in author docs:** active skills support instant/charged/channelled casts, costs, cooldowns and ordered actions. Passives can be toggleable, gated, upkeep-bearing or trigger-driven. Mastery ranks run Initiate → Minor → Major → Perfection → Transcendence, with documented default XP transitions 100/300/900/2500. Techniques grant skills and set training ceilings, realm gates and optional realm overrides. Bloodline purity is 1–100, with purity-point handlers. Source classes confirm named definitions for effects/projectiles/fields/networks/constructs/barriers/stagger/beams (`SJ/api/ascension/core/skill/SkillDefinitions.java:24–100`), but the whole action-codec and mastery execution catalogue was not traced.

Physique author docs and actual JSON use different field shapes: old `base_stats`/`stat_modifiers`/`base_path_bonuses` prose versus `stats`/`path_bonus` containers in inspected examples. Follow decoder plus data, not documentation alone. Example current bloodline data grants body/earth paths and purity-dependent stat/affinity changes; this is not proof of a native breeding algorithm. Attributes, skills, path capability and inherited identity should remain distinct owners in an adaptation.

**SHOWN release:** four registered core stats are vitality/agility/strength/intelligence (`RP/stats/custom/ModStats.java:15–22`). Current main uses spirit-oriented data as well. Body, soul and essence methods weight growth differently, but no balance recommendation is made from labels alone. Dedicated release skills include cultivation channels, body passives, weapon mastery/projections, flight/mobility, qi manipulation and meridian/poison debuffs. Full release IDs are privately indexed rather than treated as ninety-four separate absorption requirements.

## Items, pills and alchemy

**F5. The release's physical temperature-control workshop is more useful as a reference than a generic pill list.** Its replacement on current main is a different composition-based furnace.

| Version/mechanism | SHOWN behavior, numbers and source |
|---|---|
| Release cauldron workstation | Three adjacent ingredient pedestals, flame stand, optional spirit condenser; advances only while a recipe matches and temperature is in range. Missing ingredients/out-of-range temperature resets progress; blocked output pauses it. Recipe time is converted to ticks. `RJ/common/blocks/entity/PillCauldronLowHumanEntity.java:219–255,258–355` |
| Heat control | Flame stand maximum 1000, ignition 200; fan raises heat and heat decays. Condenser purity bonus +10. `FlameStandBlockEntity.java:40–51,109–116,150–160`; `SpiritCondenserBlockEntity.java:31` |
| Quality versus realm | Completion-time temperature precision plus condenser/flame/herb bonuses sets purity, capped at 100. Realm clamped 1–9. Purity below 10 can downgrade realm; purity exactly 100 permits upgrade, base chance 15%, total capped 85%; downgraded purity rerolls 1–89. Separate recipe success roll chooses pill or failed output. `PillCauldronLowHumanEntity.java:306–392` |
| Release pills | Separate body/essence/soul cultivation effects registered with base 100, qi restoration base 35; effect implementations determine final scaling. Meridian/poison debuff pill registrations use 400-tick durations. Marrow cleanse constructor has 0.01 and 0.20 parameters. Do not relabel these as current-main percentage effects. `RP/alchemy/ModPillEffects.java:24–163` |
| Release catalogue | Fasting, regeneration, cultivation, cleansing/marrow treatment, antidotes and offensive pills; physique/bloodline essences; technique manuals/pages/binder; spiritual stones/metals, herbs, spatial storage, talismans and destruction tablets. There are 127 literal `ModItems` registrations, plus generated families; raw regex count is not total items |
| Main pills | Seven registered pills: fasting, qi replenishing, regeneration, stamina, body/soul/essence cultivation. Handlers default to hunger/saturation 20, qi 30% max, health 20%, stamina 40%, cultivation 5% stage maximum. Full-resource/ineligible cases are rejected; strength multipliers apply. `SJ/common/item/artifacts/pills/ModPills.java:22–129`, `PillItem.java:17–60` |
| Main alchemy furnace | Up to 12 inputs, insert/refine/merge, empty-hand condensation, shift-clear, saved batch. Seven formula JSONs. `SJ/common/blocks/alchemy/AlchemyFurnaceBlock.java:30–167`; `.../blocks/entity/AlchemyFurnaceBlockEntity.java:15–75` |
| Main property chemistry | Heat × control versus difficulty affects purity/amplifier/instability. Generative/destructive/related path interactions alter affinity/energy; unsafe energy worsens the result. Condensation chooses best quality, then priority and deterministic ID, and consumes formula substance for up to 64 passes. Output has rank/grade. `SJ/api/ascension/core/alchemy/{AlchemyRefinementResolver,AlchemyMergeResolver,AlchemyFormulaResolver}.java` |
| Main process dials | Inspected furnace hooks return heat 1, refinement control 2.5, safe energy 3, explosion energy 8. Config still exposes older cauldron heat values. A bounded reference search found no furnace reader of those fields: INFERRED stale/disconnected tuning, not a proven live control. `AlchemyProcessHooks.java:3–25`; `AscensionCommonConfig.java:38–64` |

**SHOWN release technique fusion:** twenty authored pair rows follow the generative five-element cycle, building two through five-element body methods. Lookup uses the current method and candidate, not accumulated history. Requirements: two elements at major index ≥2, three at ≥3, four at ≥4, five at major ≥4 and minor ≥9. The screen lets the player attempt or defer; the server handles the result (`RP/techniques/merge/TechniqueMergeHandler.java:24–220`; `RP/gui/screens/TechniqueMergeScreen.java:29–116`). This is a bounded authored mechanism, not evidence of arbitrary symbolic method synthesis.

## Every screen and keybind-driven interface

**SHOWN in source and inspected assets, not in a running game.** All four release container-screen registrations, the Easy GUI introspection entry, fusion screen, overlays and config/book/JEI surfaces were checked. Main's additional screens are separate rows.

| ID / version | Screen or menu | Information, controls and consequential choice |
|---|---|---|
| UI1 / release | Introspection, Main | I opens a centered frame. Main shows player/physique/bloodline, detail buttons and foundation suppression. Tabs: Main, Stats, Skills, Cultivation. Suppression packet changes actual cultivation behavior |
| UI2 / release | Stats tab | Core stats and attribute detail; suppression/modifier controls distinguish effective attributes from underlying growth. Existing stat containers and `UpdateSuppressionValue` packets own changes |
| UI3 / release | Skills tab and assignment | Available/owned skills, descriptions, active slots/presets and passive listing; select/assign/clear through `UpdateSkillSlot`, `SetActiveSlot`, `ClearSlot`. Selection and learned ownership are distinct |
| UI4 / release | Cultivation tab | Known path choices, realm progress and separate foundation progress; select a path to inspect it. A full progress bar is not proof of a started tribulation |
| UI5 / release | Skill wheel / HUD | Hold R to choose an active slot; V casts. Health, qi and cultivation bars are distinct overlays. A held channel follows cast-input state |
| UI6 / release | Spatial Ring inventory | G opens via server payload; scrollable storage plus player inventory. Storage belongs to the ring's component, not a global extra purse |
| UI7 / release | Spatial Ring modification | Separate two-row groups for spatial stones and upgrades, plus inventory/hotbar; insertion restrictions and quick-move. Player trades capacity/utility materials against carried storage. `SpatialRingModifierMenu` and component handlers own state |
| UI8 / release | Herb Pouch | Grouped herb summary and extraction/insertion operations, with player inventory. Capacity `27 × 64` items. Guide calls this 27 slots, but implementation is a component/summary store, not simply 27 ordinary exposed herb slots |
| UI9 / release | Low Human Pill Cauldron | Inventory/output, crafting arrow, smoothed temperature bar, marked recipe window and lit indicator; hover gives actual temperature/recipe details. Operate flame/fan/material setup to keep the batch in its band |
| UI10 / release | Technique Resonance | Current eligible merge set, Attempt Merge / Not Now. Sends selected set through `MergeResponsePayload`. No implemented cycling control was established despite a selected-index field |
| UI11 / release and main | Ancestor Journal / Modopedia | Book, category and entry navigation; recipes and multiblock diagrams. Guide prose mixes narrative, instructions, incomplete observations and archive material. Treat as STATED unless code corroborates |
| UI12 / dependency surfaces | Mod configuration / JEI category | Standard config factory exposes config definitions. JEI cauldron category visualizes inputs/process/output; not a distinct cultivation state owner |
| UI13 / main | Starter selection | Stage-specific bloodline/physique cards, description/path preview, Confirm and Cancel selection. Confirm sends `ChooseStarterOptionPacket`; incomplete closing is not completion. Server manager owns accepted choice |
| UI14 / main | Reworked Introspection | Main, Stats, Skills, Cultivation; Cultivation now separates Paths and Techniques. Skill slots/passive toggles and growth suppression have validated server packets. Identity and mastery detail share the inspection frame |
| UI15 / main | Auction House | Owner, Create, My Auctions, Owner Detail, Nearby Houses, House Listings, Bid Detail, Inbox, Current Bids. Quantity/start bid/duration; navigation/paging, bid adjustment, notifications, cancellation before a bid, item/currency claims. Server AuctionManager handles mutations, not local panel state |
| UI16 / main | Jade Bottle | One pill-only slot, capacity eight tagged pills, plus inventory/hotbar; quick transfer, persisted into item component on close |
| UI17 / main | Reworked HUD/wheel | Health, qi, stamina and path progress; radial skill choice with 12-pixel center dead zone. Hides in spectator/hidden-HUD contexts |

Release locators: `RJ/AscensionCraftClient.java:58–73`; `RP/handlers/player/InputHandler.java:36–64`; `RP/gui/elements/introspection/IntrospectionContainer.java:28–116`; `RP/gui/elements/introspection/{stats_display,skill_display,path_display,main}/`; `RJ/menus/custom/{spirit_ring,herb_pouch,pill_cauldron}/`; `RP/gui/screens/TechniqueMergeScreen.java`; `RP/network/server_bound/`. Main locators: `SJ/common/gui/screens/`, `.../elements/introspection/`, `.../elements/starter/`, `.../elements/auction/`, `.../menus/jade_bottle/`; `SJ/network/` and `.../network/auction/`. Private `ui-notes.md` gives packet/class line spans for each new screen.

| Version | Default input | Action |
|---|---|---|
| Release | I / held R / V / G | Introspection / skill wheel / cast selected skill / open spatial ring |
| Release | M | Tablet drop/artifact mode when holding the applicable tablet |
| Main | I / held R / V | Introspection / skill wheel / cast selected skill |
| Main | V, separately registered | Cycle destruction-tablet modes, sharing the cast default. This default collision is a finding, not a pattern to reproduce |
| Main | Shift + mouse wheel | Cycle Ascendant Destruction Tablet shape when held |

Release input authority: `InputHandler.java:36–39`, `RJ/util/KeyBindHandler.java:102,144–177`. Main: `SJ/client/keybind/ModKeybinds.java:10–36`, `ClientSkillCastKeybind.java:18–29`, `TabletKeybindHandler.java:18–31`, `TabletScrollHandler.java:13–28`.

### Visual patterns worth adapting

**INFERRED proposals under UR49/59–64:** keep identity, capability and detailed progression inspectable together; show method mastery beside assigned execution rather than equating them; use separate bars for pool, stage progress and foundation quality; put the thermal operating band beside actual batch progress; present transfer/upgrade costs beside the owned container. Adapt through existing OOPS panels at 1920×1080, with labelled text equivalents and stable commands. Do not copy tiny Minecraft pixel dimensions, artwork, radar-shaped graphs without a useful comparison, or conflicting shortcut defaults.

Source GUI contact sheet has **53 PNGs**; release has **46**. Both sheets were viewed. Main adds auction, stamina, jade-bottle and explicit technique/starter controls; release retains old aggregate atlases and fusion art. Some unused art survives in both trees, so an atlas does not establish a reachable screen. Deep art inventories and private sheets: `ui-contact-sheet.png`, `jar-ui-contact-sheet.png`.

## Text, guides, world content and configuration

Only **en_us** language files were found in either pinned version: release **1,395 keys**, main **1,502**. No `zh_cn` was found in source or jar inventories. Complete raw language dictionaries are preserved privately. UI/control namespaces, realm names and relevant mechanic descriptions were read; every non-UI flavor string was not semantically audited.

The Ancestor Journal contains **42 category and 154 entry files** in each version. Extracted actual title/text/name/description strings total **11,168 words**; reader's larger 12,864 count included other JSON strings. Root read the extracted entry prose, including recovery of the initially truncated pills/physiques/techniques spans. Seven item entries complete the text pass. Main/release guide text was extracted separately. This is guide-text reading, not validation of its assertions. The integration guide (`S/docs/modopedia-guide.md`) and format docs (`S/documentation/`) were inspected by the bounded readers.

**STATED guide direction:** narrative discovery leads from ordinary life through hidden places and learning, then physique identity, method compatibility, bloodlines, resources and alchemy. Physiques can be changed or evolved, so initial talent is not destiny. Methods emphasize different stat growth and acquisition environments. Several entries explicitly say a source is unknown. **Contradictions retained:** one guide entry describes death-recall as fatal-injury rescue while its dedicated talisman entry describes returning to a death location; herb habitat descriptions disagree between overview and dedicated entries; compatibility is described as both dangerous and merely inefficient in different passages. Do not encode narrative claims as hard mechanics without the consumer.

World data covers herbs and spiritual trees, ores/materials, treasure/structure loot, technique/physique acquisition and cultivation-ranked creatures. Main extends dimension/biome definitions, mob profiles, villager trades and formations. Generated JSON inventories were merged before counts; the item reader's main-resources-only counts (59 worldgen, no recipes/loot) are superseded by the merged counts above. Structure templates were inventoried, not fully decoded into a placement/connectivity audit. Sects, social behavior or a living economy mentioned by prose are not proven by that prose.

| Config/default | Version and interpretation |
|---|---|
| Starter kit | Both config classes enable it by default. Release: one lesser spatial-rupture talisman and eight tier-1 fasting pills. Main retains a similar list; compare actual IDs before adopting the run-fixture config |
| Cauldron config | Heat items 8 / 16 / 200, tuple extras for bonuses; heat loss 1 every 20 ticks; max heat 1000. These declarations should not be assumed to control either the release's flame-stand constants or the new furnace hooks without tracing |
| Repair artifact | Release defaults repair 2 durability every 100 ticks |
| Armor wear | Limiter enabled; maximum 1% max durability per hit, minimum loss 1 |
| Ore Sight | Eighteen vanilla ore/variant entries with configurable colors |
| Main client HUD | Exact health/qi/stamina values enabled by default |

Locators: `RJ/AscensionCommonConfig.java:28–158`; `SJ/AscensionCommonConfig.java:38–160`; `SJ/AscensionClientConfig.java:5–17`; runtime constants are separately located in the alchemy/resource tables. This is a tuning map, not an exhaustive numerical balance review of all 673 main Java files.

README is short and supplies credits/distribution links rather than a detailed feature spec. Main [Changelog.MD](https://github.com/MrEizy/Ascension/blob/1f11509c38dc59f07362ebd24b4dee07d8499516/Changelog.MD) **STATES** 47 new paths, 44 new physiques, 39 new bloodlines, 20 new techniques, 11 herbs, five artifacts; twelve/nine/six-realm path families; datapack support; stamina/mastery; alchemy/formations; and a WIP, explicitly buggy Jianghu world type of height 416. These change counts are not total registry counts.

Recent twenty main-branch messages were read through the GitHub API, independently of shallow history. Oct 8 fixes bloodlines/JSON; Oct 6 messages discuss mined spiritual clusters, chunk affinity, saved qi loading, dimension/biome data-map configuration, powered formations and initial mob-cultivation growth. This suggests active engine/data migration and bug repair, not a stable released completion claim. No separate wiki corpus was retrieved; checked-in docs/documentation and Journal were the documentation routes used.

## Native absorption check against current source

**F6. Native coverage is broader than the Oct 24 static gap wording.** Current source has real vessel nodes, impurity, laws, mantras, attention forks, graded ordeals and root retuning. Those are credited below rather than repeated as missing. Inspected paths and hashes are retained in `native-evidence.json`; this is static producer/consumer evidence, not new browser proof.

| Code / CG family | Distinct mechanism | Mark | Current native producer → consumer, exact remaining boundary |
|---|---|:---:|---|
| M3-01 / CG04 | Spendable qi separate from progress | A | `energy_resources.js:20–43` owns learn/recover/use/refund; `simulation_effects.js:294` and `absorb_p23/host_joins/world_adaptation.js:84–86` apply it. Capacity/strain/output/control are real; no need for another reserve engine |
| M3-02 / CG06 | Mechanically different cultivation verbs | P | `absorb_p23/world_adaptation/techniques.js:9–15,24–36` → `world_adaptation/index.js:91` → host join. Breath/settling change actual rate/purification/work, but no full open-sky/kill/weapon-damage/sun-moon route catalogue |
| M3-03 / CG07 | Suppress growth to build persistent foundation | P | `world_adaptation/discipline.js:14–27` → method view/advance and host method actions. Body minutes/law/nodes already matter; no separate per-major stored foundation-quality ladder selected |
| M3-04 / CG04 | Vessel channels and impurity | A | `discipline.js:14–25,35–55` computes nodes, forced absorption, impurity and purge; `techniques.js:24–30` consumes rate/odds/work changes. Anatomical meridian simulation is not required to credit the causal analogue |
| M3-05 / CG08 | Inherited aptitude affects cultivation | A | `cultivation_root.js:5–10` → `lineage_domain.js:61` → host's root affinity → `techniques.js:26`. Current body binding/testing and rate effect are real; older descriptive-only inheritance wording is stale for this bounded quality |
| M3-06 / CG07–08 | Replace/evolve physique and retained knowledge | P | `body_progression.js:118`, `techniques.js` and `root_retuning_domain.js:18–21` govern current faculty/real costs. No general source-style physique grant/removal/evolution catalogue with every skill/stat rebinding |
| M3-07 / CG06 | Current-method + candidate elemental fusion | M | `vessel_geometry.js`/`vessel_mantras.js` operate on nodes/mantras; `techniques.js` chooses known drills. No inspected body-method candidate-to-result fusion consumer equivalent to the release's twenty-pair chain |
| M3-08 / CG01 | Nine-strike sky-exposure trial | U | Native `pledges.js:32–70` and `pledges_domain.js:84` now implement real graded, withdrawable ordeals. Reference ordinary-trial reachability/persistence remains unestablished; do not grade it missing solely from a dormant class |
| M3-09 / CG01 | Learn from failure, grade a trial | A | `pledges.js:51–65` records grade/history/failure learning; domain projection/milestone counters consume it. Source's exact lethal-lightning rule is a world dial, not a replacement requirement |
| M3-10 / CG06/17 | Technique-owned unlocks, mastery ceilings and active/passive loadout | P | `techniques.js`, `ascension_paths_mistglass.js` and native practice/insight consumers implement learned/current practice. No inspected generic method-to-granted-skill removal/upkeep/mastery-cap contract spanning all paths |
| M3-11 / CG15 | Temperature/process affects purity and output | P | `craft_content_frontier.js:144–151` → `craft_resolver.js:88–105,119+` → `crafting_frontier_runtime.js:185–198` → `crafting_domain.js:21`. Ordered materials and thermal degradation exist; no physical flame/fan/pedestal operating-band job with completion-time purity |
| M3-12 / CG15 | Emergent formula discovery and repeated condensation | P | Shared craft law/resolver/product registry already models material properties, reactions and outputs; `stageCrafting` executes. Exact best-quality formula competition and iterative extraction from one changing batch are not established |
| M3-13 / CG19 | Targeted medicine and residue/treatment | P | `crafting_domain.js:54`, crafting-depth dose/treatment owners and `root_retuning_domain.js:20` consume actual medicine/residue. No source-wide rank/purity pill catalogue or universal permanent upgrade promise |
| M3-14 / CG04 | Local qi stock, recovery and powered sites | P | `home_cultivation_content.js` → `home_cultivation.js:13–32` plus Mistglass resource joins. Paid condensate powers a real four-hour field; no fully inspected chunk/biome affinity depletion/regrowth loop |
| M3-15 / CG18 | Upgradable spatial item storage | P | Existing inventory, loadouts, exact-item custody and continuation carry have consumers. General item-contained inventory with its own spatial-stone capacity and utility modules was not found in those paths |
| M3-16 / CG16 | Bottleneck guidance and provenance-rich manual | P | `cultivation_guidance.js:3–12` → `world_adaptation_ui.js:24` links real known actions. No comprehensive discovered journal tying every method origin, compatibility and observed failure to a personal reading record |
| M3-17 / CG05/22 | Auction creation/bid/inbox settlement | M | Native shops/money/custody and funded job escrow are incumbents; no auction/bid/listing/inbox consumer found by bounded auction/bid search over domain modules. Single-player adaptation would need real NPC motive/funds, not a simulated multiplayer shell |
| M3-18 / CG11/21 | Individually cultivated opponents | P | `combat_math.js`, `absorb_p23/encounter_profiles/profile.js:29–73`, `absorb_p23/host_joins/encounter_profiles.js:34–51`, `dojo_tower_domain.js` produce and consume real opponent stats. A lifetime mob-practice/affinity/trait-growth producer equivalent to main's new mob system is not established |

**Counts: A 4; P 11; M 2; U 1, across 18 causal-loop rows.** This is coverage classification, not an absorption percentage. Existing CG families cover every row, so no new missing-family owner is created. Lane row codes merely identify this comparison.

## Top five adaptation proposals for the coordinator

All are **LATER/DELEGATE proposals**, not an implementation dispatch. Level L1 = bounded data extension, L2 = one new causal interaction on existing owners, L3 = a multi-owner feature. Effort is relative: S one focused slice, M several connected slices, L broad integration. Keep default, dial and in-world reason explicit under AD5/AD38.

| Priority | Mechanism and existing system degree | Default, dial and reason | Done check | Level / effort |
|---|---|---|---|---|
| O1 | Method grants + training ceilings using techniques, shared skill learning, path gates and body activation | Default a learned manual grants a bounded executable technique; dial which faculties/realms/body support it; reason is the method's actual circulation or bodily mechanism | Learn two methods, reach a cap, earn the next qualification, switch carrier/body and prove supported effects persist or deactivate correctly; save/reload/import | L2 / M |
| O2 | Thermal operating-band alchemy through existing crafting jobs, materials, stations and grade | Default recipe has a known working band; dial heat source, tool control, pause/reset policy and finish-time purity; reason is instability/refinement difficulty | Same ingredients at two thermal histories produce the predicted grade/residue difference; blocked output retains owned goods; interruption/reload conserves inputs | L2 / M |
| O3 | Progress versus foundation investment through vessel/law/ordeal owners | Default suppress direct advancement to condition the current vessel; dial stored quality and how it affects the next operation; reason is channel stability, not a universal mandatory grind | Divert real practice, show lower immediate progress but changed actual trial/conversion result, then cross a body boundary without duplicating physical benefit | L2 / M |
| O4 | Place-dependent cultivation through existing qi fields, sites and energy clock | Default an observed place changes one known method's intake; dial finite stock, replenishment and affinities; reason is local supply/environment | Move between two earned sites, exhaust/recover one supply under its owning clock, show changed acquisition and a truthful depleted stop reason | L2 / M |
| O5 | Consequential method resonance through existing method/gate/material law, with an explicit preview | Default a supported pair composes when current body/knowledge can maintain it; dial combination and instability costs per world; reason is interacting channels, not an arbitrary permission list | Two supported combinations differ at execution, unsupported attempts explain their missing means, and accepting/defer/reload consumes or preserves exact manuals/resources | L3 / M–L |

**ACT NOW completed:** pin exact release source, distinguish author assertions from handlers, correct numerical/inventory mistakes, keep assets/code private, supply candidate source links. **ACCOUNT FOR NOW:** per-method clocks/costs, capability removal when carrier changes, reference trial reachability, licence conflict, and generated-resource merging. None changes the live cultivation run's scope or acceptance gate.

## Checks and remaining coverage

| Check | Result and gap |
|---|---|
| Hook-disabled shallow `git clone`, then bounded `git fetch --depth 1` of named source commits | Completed. First sandbox DNS failure was resolved through network-approved execution. No hooks, Gradle, jar or Minecraft execution |
| Python ZIP inventory + SHA-512 against Modrinth metadata | Passed, 8,224,250 bytes and 4,354 entries. SHA-256 also saved |
| Python merged resource SHA-256/JSON/newline diff | Completed for main, retained release and exact version. Exact-version data/assets have zero semantic differences; compiled code reproducibility untested |
| Filesystem/JSON registry, language, guide and GUI inventories | Completed. Full private dumps; en_us only; 46 release and 53 main GUI PNGs visually inspected as contact sheets |
| Current native producer/consumer reads plus bounded searches | Completed for the 18 matrix rows; exact hashes in `native-evidence.json`. Static evidence only; no new gameplay receipt |
| Reader return spot-checks | Root checked version identity, foundation numbers, generated-resource inventory, breakthrough reachability, pill values and screen packets. Corrected `3n` threshold arithmetic, source-version title and generated-resource omissions in this report. Independent coordinator review remains pending |
| Report-only `git diff --check` and Markdown link/manifest validation | Passed: no whitespace errors; all local Markdown targets exist; matrix counts recomputed; private evidence ignored. Runtime build/tests intentionally not run for this document-only lane |

Read: README, licenses, recent commit messages, release/core guide prose, key release cultivation/foundation/qi/trial/fusion/alchemy/menu consumers; main docs/schema sections and sample data/handlers; native systems named above. Full data/lang/registry extraction and text reading are distinct from full semantic source coverage.

Still unread or not fully traced: most individual skill/technique/physique/bloodline handlers and JSON balance; all non-UI localization prose; large skill-schema doc middle sections; complete formula/material codec and matching math; all worldgen structure/NBT placement logic; every loot/datagen source row; mob growth and formation-to-qi execution chains; source dependencies' internal GUI behavior; complete wiki history; ordinary Minecraft interaction/persistence and exact jar bytecode equivalence. No claim of line-by-line whole-repository or every-number balance review. The named remaining playable gate is **none for this research lane**; any selected implementation needs its own fresh desktop/persistence journey under the live owner.

Final document validation (2026-10-25): 18 matrix rows recomputed as A4/P11/M2/U1; local-link check passed; `git diff --no-index --check /dev/null <report>` passed for this new untracked file; `git check-ignore <private receipt>` confirms exclusion. No runtime tests run. No shared owner edits or commits.

The COMMON receipt example `docs/research/minecraft/MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md` was absent at that exact path. Used COMMON's explicit receipt fields and the API/hash inventory instead. Coordinator should link this report from its wave index; this lane deliberately leaves shared owners untouched.

## Other cultivation source repos, ranked for coordinator triage

Metadata checked 2026-10-25; **no other mod repo was cloned and no other mod jar downloaded**. Only public metadata/README/licence/version pages were read. Stars are screening context, not a quality ranking. Last commit means default-branch committer date from `/commits?per_page=1`, not GitHub `pushed_at`. Ascension's README credits/dependencies yielded generic asset/rendering/UI projects, so these additional cultivation candidates came from GitHub capability searches.

Queries: `minecraft cultivation`, `xianxia minecraft`, `wuxia minecraft`, and topic searches `xianxia`, `cultivation`, `wuxia` (Minecraft context checked separately). An initial combined query returned zero; separate searches produced candidates. Topic-only results mostly concerned agriculture, unrelated games or novel tooling; those were excluded. Full result metadata stays private.

| Rank / disposition | Source repository | Stars | License signal | Minecraft / loader | Last commit UTC | Why inspect next |
|---|---|---:|---|---|---|---|
| C1 / inspect | [Timo's Murim Ascension](https://github.com/veryCoolTimo/timos-murim-ascension) | 1 | Code LGPL-3.0; assets ARR, explicitly distinguished in latest commit/README | 1.21.1 / NeoForge 21.1 | [2026-10-16, `0e123509f3`](https://github.com/veryCoolTimo/timos-murim-ascension/commit/0e123509f3) | README describes cultivation, twelve-star technique mastery/insight, pill-meridian flow and sect practice. Strong complement to Ascension's system/GUI mechanisms; these remain author-stated until source-read |
| C2 / inspect | [HungTeen/Immortal](https://github.com/HungTeen/Immortal) | 10 | LGPL-2.1 | 1.21.1; NeoForge project (version catalog also lists Forge/Fabric entries) | [2025-06-24, `fafda5d7ef`](https://github.com/HungTeen/Immortal/commit/fafda5d7ef) | Substantial established cultivation source; latest commit concerns qi-refining advancement trial. Version verified in [catalog](https://github.com/HungTeen/Immortal/blob/master/gradle/libs.versions.toml) |
| C3 / inspect historical design | [airesnoronha/wuxiacraft](https://github.com/airesnoronha/wuxiacraft) | 17 | LGPL-3.0 | Default branch `0.0.10.0-1.18.1`; loader not independently verified here | [2022-04-11, `a5a8e25d2b`](https://github.com/airesnoronha/wuxiacraft/commit/a5a8e25d2b) | Older independent wuxia reference: commit mentions sword flight, combat mode, cultivation/energy runes and elemental manual. Age matters for APIs, not for design usefulness |
| C4 / inspect bounded prototype | [Nine Tribulations](https://github.com/mandeel99/ninetribulations) | 0 | Source-available ARR custom license; not open source | 1.20.1 / Forge + Fabric, author-stated | [2026-08-21, `326ca79ec3`](https://github.com/mandeel99/ninetribulations/commit/326ca79ec3) | One initial commit; README advertises rhythm meditation, spiritual geography and nine-realm trials. Inspect a single causal loop first; [license](https://github.com/mandeel99/ninetribulations/blob/main/LICENSE) was read |
| C5 / park broad pass | [Kultivator-Minecraft](https://github.com/Mus460/Kultivator-Minecraft) | 0 | MIT | 26.3 / Fabric, [Gradle property](https://github.com/Mus460/Kultivator-Minecraft/blob/main/gradle.properties) | [2026-10-24, `626531353f`](https://github.com/Mus460/Kultivator-Minecraft/commit/626531353f) | Very recent broader cultivation/sect source; inspect runtime before treating design docs or future goals as implemented systems |

Lower-priority discoveries, not extra download requests: [zumaaaaaa/guimmortal-mod](https://github.com/zumaaaaaa/guimmortal-mod), 1 star, no detected license, NeoForge 1.21.1, last default commit 2026-08-06 (`3ab9abe710`); [AzureSkyzs/BreathofHeavenEarth](https://github.com/AzureSkyzs/BreathofHeavenEarth), 1 star, custom/NOASSERTION license, MC version unverified, last commit 2024-05-20 (`1127ab4031`); [Senri12/Immortality-The-Path-of-Cultivation](https://github.com/Senri12/Immortality-The-Path-of-Cultivation), 0 stars, MIT metadata, MC version unverified, last commit 2026-07-26 (`86ffe23674`). Search also surfaced release-only/issue-only repositories and cultivation-themed plugins; those are not presented as confirmed mod source candidates.
