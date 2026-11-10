# Foundational rules coverage, 2026-11-10

Audit, agent proposal (AD32). Weibao asked "Other reuls we should take into considertion? Other aspects to consider?" after seven rulebooks were drafted the same day ([log](../gm/USER_VISION_LOG_2026-11.md#levels-of-fate-cheats-further-no-forced-weakness-anywhere-2026-11-10)). This maps every aspect to its rule owner and ranks what is left. Findings are proposals; none authorizes a rulebook or a build. Method: the [rules index](../RULES_INDEX.md) register and router, the [area guide](../AREA_GUIDE.md) "Competing" lines, and a filename search of `docs/` for each aspect.

## Aspects with a rulebook

Bodies and health (BHR), combat (CBR), economy (ECR), skills (SLR), presence (PIR), making (MR), sites and maps (SR), generation (GR), abilities (ABR), gates (GTR), world entry (WER), world absorption (WA), UI (UR, DSG), prose (PRS), activity compression (ACR), and the seven drafted 2026-11-10: relationships (TIE), livelihoods (LVR), time (TMR), knowledge (KNW), standing and law (STN), story and fate (STY), cheats (CHT). Saves have a contract in [SAVES](../SAVES.md) with AR6, which is enough for now.

## Aspects with no rulebook, ranked

| Code | Aspect | What exists | Why it matters | Proposal |
| --- | --- | --- | --- | --- |
| FRC1 | **Mind, personality and mental state** (temperament, mood, stress, sanity, madness, loss of control) | BHR2 and BHR3 name the mind as a carrier; `person_temperament.js`; LOTM loss of control lives in LOTM files alone (ABILITY_RULES AB14); a temperament lane brief | LOTM's loss of control, Reverend Insanity's will, and every NPC's reactions read it; TIE12 (tempo is the person's) has no owner for the traits behind it | Rulebook first in this list |
| FRC2 | **Items, inventory and equipment** (identity, stacks, custody, storage, carrying, wear) | MR5 (conserved, custody), [equipment stat dimensions](../EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md), [gear depth](../GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md), an [inventory overhaul assessment](../reviews/INVENTORY_OVERHAUL_ASSESSMENT_2026-10-21.md) | Every system hands items around; no rule says when an item is an individual or a count, or where it lives | Rulebook |
| FRC3 | **Gods, faith and powers that act** (prayer, divine answers, patrons, churches as faith rather than offices) | STN6 treats a church as an institution; [FAITH palette](../gm/dispatch/procgen-2026-10-13/p31/FAITH.md); CHT5 lists "patron" as a backing; STY F3 is "an actor with an agenda" | Faith is central to LOTM (atlas LAYX203). A god, a fate actor, a cheat's patron and Heaven's Will share one shape: an in-world agent with goals, reach and sometimes a budget. One seam under AD51 | Rulebook built around that shared shape |
| FRC4 | **Creatures, monsters and ecology** (wild populations, spawning, territories, food webs) | CBR covers enemies in a fight; LVR covers animals kept for a living; [nonhuman monster side](../worlds/NONHUMAN_MONSTER_SIDE_2026-10-14.md); ecology palettes | His 2026-11-08 "environments to farm things, both like creatures to kill"; simple areas (LVR22) need a rule for where monsters come from and how they refill | Rulebook, or a section added to LVR |
| FRC5 | **Death, afterlife and continuation** | Rulebook 4–5, AD10–AD14, [death and reset considerations](../research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md), the continuation owner | Accepted AD lines cover the main line; heirs are deferred. What happens to the dead body, the estate, ties and knowledge is spread across TIE, KNW and BHR | Short rulebook or AD consolidation |
| FRC6 | **Language and communication** (who understands whom, translation, scripts, codes) | [language stack](../gm/dispatch/codex-parallel-2026-10-25/D3_language_stack.md), [rune language](../gm/dispatch/maker-arts-2026-10-14/RUNE_LANGUAGE.md) | Crossing worlds raises it at once (WER); KNW16 texts need readability; rumor spread (KNW17) assumes a shared tongue | Section in KNW, or a short rulebook |
| FRC7 | **Nonhuman bodies, senses and scale** | [nonhuman starts spec](../worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md), [senses and scale UI](../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md), BHR carriers | Accepted direction allows nonhuman starts; KNW6 means depend on senses | Section in BHR |
| FRC8 | **Settlements and building** (growing a place, founding a society, public works) | AD23 homes, STN12 founding groups, LVR holdings, settlement palettes | "choosing to start a society" (2026-11-06) | Later; STN and LVR cover the first steps |
| FRC9 | **Travel, journeys and mounts** | SR maps, TMR14, `travel_legs` and `cast_journeys` (two routes) | Two code routes; no rule for vehicles or mounts | Section in SR when touched |
| FRC10 | **Weather, environment and disasters** | TMR2, LVR7, weather modules, an environment lane | Disasters are events with causes (STY) and conditions (LVR7) | Covered enough by STY and LVR |

## Rules to take into consideration across the new books

| Code | Finding | Disposition |
| --- | --- | --- |
| FRC11 | **None of the seven new books binds yet.** Each is a proposal under AD32 until Weibao accepts it, by book or by line. | Done 2026-11-10 by AD56: working defaults, except the [limiting lines](LIMITING_LINES_REVIEW_2026-11-10.md) held for his answer |
| FRC12 | **The new books overlap and need owner rows.** Rumor spread (KNW17) and audience spread (STN3); the recap (TMR10, AD17, KNW25); hidden motives (STY26) and truth (KNW1); companions (TIE19) and groups (STN7); fate actors (STY F3) and cheat patrons (CHT5) | ACT NOW (done below): owner lines added to the rules index |
| FRC13 | **AD55 reached five lines; the palettes still hold older "every power has a counter" wording.** The sweep sampled rulebooks, not every palette | LATER: a palette sweep with a reword pass, haiku, small; done when `grep` finds no unqualified mandatory counter |
| FRC14 | **The area guide's "Rules:" lines and missing modules** (`authority.js`, `positions.js`, `organizations.js`, `heat@1`; the stale "no shared day reader") | Done 2026-11-10: Rules lines point at the new codes; the four modules and the day reader are corrected |
| FRC15 | **`check:rule-behavior` has no groups for the new books.** | Done 2026-11-10: groups ties, standing, time, fate, cheats and routes in `scripts/check_rule_behavior.mjs` |
| FRC16 | **One shape repeats across books: an agent with goals and reach.** Fate actors, gods, patrons, authorities (STN14) and storytellers differ by what they may touch | ACCOUNT FOR NOW: FRC3's rulebook should name the shared shape; STN14's claim, knowledge and reach is the nearest built seam (`authority.js`) |

## Round 2, 2026-11-10: world kinds, source kinds and what is left

Weibao asked "foundational implementation rules for types of worlds and more? also types of source? other aspects to consider?" ([log](../gm/USER_VISION_LOG_2026-11.md#world-kind-and-source-kind-rulebooks-2026-11-10)). Drafted: [WORLD_KIND_RULES](../WORLD_KIND_RULES.md) (WKR1–WKR21) and [SOURCE_KIND_RULES](../SOURCE_KIND_RULES.md) (SKR1–SKR21). Both build on code that already exists: the thirteen world axes, presets, origin kinds and licence tiers in `src/world_pack_manifest.js`, and the HP pack's evidence rows. FRC4–FRC10 above are unchanged.

| Code | Aspect | What exists | Why it matters | Proposal |
| --- | --- | --- | --- | --- |
| FRC17 | **Content authoring and pack format** (manifest, families, revisions, hashes, which loader) | Two pack systems (`world_pack_*`, `structured_pack_*`) with separate loaders; three window shapes; `window_chain.js` intended and unadopted; WKR9 names the default | The most code pain per new world; every world kind and source kind lands through it | Rulebook first in this round |
| FRC18 | **Between worlds: the hub, cross-world value and travel authority** | WER (entry), [multiverse structures](../worlds/MULTIVERSE_STRUCTURES.md) OD5 and OD11, `AUTHORITY_MODELS`, WKR17 | Many worlds is his direction; what money, items and titles are worth across worlds has palettes only | Rulebook, after FRC17 |
| FRC19 | **Creatures, monsters and ecology** (repeats FRC4) | CBR, LVR, nonhuman monster side | His 2026-11-08 environments to farm and creatures to kill | Rulebook, or LVR section |
| FRC20 | **Player settings and live world dials** (difficulty, tone, spoiler, who may change a dial in play) | AD22, PRS4 spoiler dial, WDI16 director edits, WKR14 tone axis, [settings survey](../research/COMPREHENSIVE_SETTINGS_SURVEY_2026-11-04.md) | Weibao is the only player; dials he can turn in play are cheap freedom | Short rulebook or UI section |
| FRC21 | **Language, translation and scripts** (repeats FRC6, adds translated names) | NMR names, KNW texts, translator notes SM10 | Crossing worlds and translated sources both raise it | Section in KNW |
| FRC22 | **Sound and diegetic look per world** | DSG look and skins; no audio rule | Later; nothing plays sound yet | Later |
| FRC23 | **Many-world scale budget** (save size, loaded packs, frozen worlds) | AR6 saves, TMR7 frozen worlds, SAVES contract | Matters once five or more worlds are enterable at once | Later; AR section when measured |

Ranked recommendation for the next drafts: FRC17, FRC18, FRC19, FRC20, FRC21. The rest wait for a reader.

## Round 3, 2026-11-10: making the rules followed, and old code

Weibao asked "Other aspects to consider? Rules we need to setup and make followed? changing prior implementation for these rules once other stuff is addressed?" ([log](../gm/USER_VISION_LOG_2026-11.md#making-rules-followed-and-bringing-old-code-in-line-2026-11-10)). Evidence: `.claude/rules/`, `scripts/rule_routes.mjs`, `package.json` scripts, `.git/hooks` (no hooks installed).

| Code | Finding | Disposition |
| --- | --- | --- |
| FRC24 | **WKR and SKR had no path rules,** so nothing loaded them while editing world packs or research notes. | ACT NOW (done): `.claude/rules/world-kinds.md` and `source-kinds.md`; `tests/rule_routes.test.js` checks both route and have no stale glob |
| FRC25 | **The commit-time rule check runs only by hand.** `check:rule-routes` is warning-only and nothing calls it; `check:rules` runs only its stale-glob pass. | LATER: run `check:rule-routes -- --message` inside the guarded commit recipe in [shared worktree practice](../gm/SHARED_WORKTREE_PRACTICE.md), still as a warning. Sonnet, small. Done when a commit touching `src/heat.js` without an STN code prints the warning during the recipe |
| FRC26 | **Old code that does not meet the new books** has no list and no policy. | ACT NOW (done): [rule conformance ledger](RULE_CONFORMANCE_LEDGER_2026-11-10.md), RCL1–RCL4 policy (move when touched; dedicated consolidation only for conflicting writers, blocked slices or per-world cost; after the current checkpoint) and RCL5–RCL17 ranked rows |
| FRC27 | **Mechanical rules can be linted cheaply.** Candidates: no new clock counter outside `world_day_index.js` (TMR1); no reader branching on a preset id (WKR1); new story windows import `windowKit` (STY17); source rows name a medium once the source table exists (SKR1). | LATER, proposals: warning-first lints in `check:rules` with a baseline that only shrinks, the way `check_player_text.mjs` works. Sonnet, small each. Done when each lint reports today's count as its baseline and fails only on a new case |
| FRC28 | **`check:rule-behavior` has no groups for WKR, SKR or STY33–STY34.** Routing is tested; behaviour is not. | LATER: a group per book once a test pins its behaviour (RCL14's route test is the first candidate for STY33). Haiku, small |
| FRC29 | **Rule changes leave code stale without a signal.** | ACCOUNT FOR NOW: RCL4; a changed rule line gets a dated note, and its ledger rows are re-checked in the same change |
| FRC30 | **Agent reading load grows with each book** (twelve on 2026-11-10 alone). | ACCOUNT FOR NOW: path rules stay one paragraph; briefs cite codes rather than whole books; overlapping lines get owner rows in the rules index rather than restatement. LATER: a reconciliation pass when two books restate the same line twice |

## Round 4, 2026-11-10: which world fills which gap

Weibao asked "WHat about chainsaw man and more? more to consider? Pet systems and more?" ([log](../gm/USER_VISION_LOG_2026-11.md#chainsaw-man-other-worlds-and-pet-systems-2026-11-10)). Holdings from `python3 -I scripts/library_coverage.py --series` on 2026-11-10; the standing world order puts Harry Potter, D&D and the book worlds ahead of anime and manga worlds (PROJECT standing priorities). Pets went to round 12 of the [companion palette](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md#round-12-pets-against-the-2026-11-10-rulebooks-and-todays-code-2026-11-10) (CPR1–CPR13).

| Code | World | Held source | Gaps it fills best | Disposition |
| --- | --- | --- | --- | --- |
| FRC31 | **D&D (Phandalin)** | SRD 5.2.1 rows shipped in `src/data/srd521/` (monsters, spells, conditions); design in `docs/worlds/dnd/` | Creatures and ecology (FRC19, from licensed monster rows), familiars and beast companions (CPR12), the class-and-level ladder kind with no fixture yet (WKR10, WKR11), numbers that may ship (SKR12) | Strongest next fit in the lead tier; proposal for after the current checkpoint |
| FRC32 | **Reverend Insanity** | Held, in the active line | Second world for fate and acting powers (STY24, AGT1, LLR26), care and hunger (LVR13, CPR10), making, windows (RCL9) | Already active; use it deliberately as the validating world |
| FRC33 | **Mother of Learning** | Held, Arc 1 played | Loop kind fixture, routes to the same result across loops (STY33, RTC10), memory as the kept carrier | Active; first route-variety sweep target after LOTM |
| FRC34 | **Jujutsu Kaisen** | 286 held records | Belief and emotion as a resource (AGT10, cursed energy), binding vows as self-chosen terms (CHT, AGT), shikigami between pet and patron (CPR5), inherited techniques | Best-sourced of the anime and manga tier; later by the standing order |
| FRC35 | **Chainsaw Man** | 0 held; wiki-only pack proposal in `docs/worlds/chainsaw-man/` (snapshot 2023-11-27); DL113 queues the one prose spin-off | Fear as a population-level resource (AGT10, STN3 audiences), contracts as priced bargains with acting powers (AGT, CHT5), possession and fusion bodies (MND13–MND16, BHR carriers), a Devil as pet and heart (CPR1, CPR5) | ACCOUNT FOR NOW: the shared acting-power record (AGT1) and belief resource leave room for fear and contracts. LATER: hold the Part 1 manga through the governed manga queue before any build (SKR21, WKR21) |
| FRC36 | **Frieren** | 15 held records | Long lifespans and slow time (TMR15, aging deferred), ordinary life after the story ends, mana concealment as knowledge (KNW) | Later; best fit when aging and lifespan reopen |
| FRC37 | **Hunter x Hunter, Fullmetal Alchemist** | 0 and 5 held | Vows and restrictions (HxH), equivalent exchange in making (FMA, MR) | Later; acquisition first |

## Round 5, 2026-11-10: what the decompile bank gives the open gaps

Weibao asked "Deep level stuff to take? Other stuff and more? other stuff that can use decompiled stuff rather than just hte pet stuff?" ([log](../gm/USER_VISION_LOG_2026-11.md#decompile-bank-for-gaps-beyond-pets-2026-11-10)). A haiku reader grepped committed research notes against thirteen open gaps (private captures not opened); the root spot-checked. Its "Qud audit folder does not exist" was wrong: `docs/research/qud-systems-audit-2026-10-15/` is tracked (185 files). Pets went to a separate digest session (CPR22, CPR23). Labels are the notes' own; shapes are taken, closed-game numbers are calibration only (SKR11).

### Deep takes, ranked by gap closed

| Code | Gap | Bank source | Mechanism | Disposition |
| --- | --- | --- | --- | --- |
| FRC38 | **Storyteller** (STY10: no module) | RimWorld [storyteller](../research/rimworld/pass-2026-10-14-deep/STORYTELLER.md), decompiled | Components tick every 1000 ticks; a category is drawn first, then a weighted eligible incident, and eligibility is rechecked at execution; choosing a category promises no specific incident | Best fit in the bank: it is STY10's "picks timing, not truth" as working code. ACCOUNT FOR NOW in STY10; LATER: first director slice on LOTM news |
| FRC39 | **Mood and breaks** (MND5 no mood; RCL5 two loss counters) | RimWorld [report](../research/rimworld/REPORT.md) F3, decompiled | `Need_Mood` sums dated thoughts (an insult memory lasts 20 days, its mood thought 2 days, attributed to the other pawn) and feeds a separate `MentalBreaker` | Shape for MND5 and for RCL5's one carrier: thoughts as dated, attributed entries; a break reads the carrier, it is not a second counter |
| FRC40 | **One away bank** (RCL6, TMR4 no equivalence test) | Melvor [report](../research/melvor-idle/REPORT.md) "Offline and automation boundaries", source; Idleon [AFK digest](../research/legends-of-idleon/AFK_AND_LEGIBILITY_DIGEST.md), shipped code | Melvor replays the same 50 ms ticks offline up to a fixed 24 h cap; Idleon clamps by a selected prayer (10 h) | Replay-the-same-ticks is TMR4's equivalence test in shipped form. No bank grows its cap: his growing cap (TMR6) is original design |
| FRC41 | **Creatures and refill** (FRC19) | Caves of Qud [aspects](../research/caves-of-qud/aspects-2026-10-14/ASPECTS.md) `PopulationManager`, decompiled (1,510 population tags with chance, weight, number); Minecraft [engine mapping](../research/minecraft/ENGINE_MAPPING_2026-11-08.md) nests by biome and hive caps | Table-driven populations per place, nests and caps | Data shape for a creature rulebook and LVR22 simple areas; respawn timing not found in the notes |
| FRC42 | **Spoilage** (ITM8 no owner) | Factorio [quality-spoilage reader](../research/factorio/native/readers/quality-spoilage/REPORT.md), native decompile | Lifetime depends on quality; spoiling outputs keep a timed identity (`computeTicksToSpoil`) | Shape for one spoilage owner on ITM instance ids |
| FRC43 | **Needs and hunger seam** (RCL12) | RimWorld report, decompiled; Kenshi [findings](../research/kenshi/FINDINGS.md), extracted data | Food drains nutrition; malnutrition rises while starving, falls otherwise and changes drain; per-body hunger rates | Shape for the one hunger seam; bodies set rates (BHR) |
| FRC44 | **Bodies with their own rates** (FRC7 nonhuman) | Kenshi [bodies](../research/kenshi/second-pass/BODIES.md) B4, extracted data | Each race body carries hunger rate, heal and strength multipliers (a skeleton never hungers) | Per-body dials on BHR carriers |
| FRC45 | **Law by observation** (STN18 no caller, KNW) | Kenshi [world card](../research/kenshi/second-pass/WORLD_CARD.md) and [settlements](../research/kenshi/second-pass/SETTLEMENTS.md), extracted data | Institutions classify a visitor by observed body, clothes, papers, ties and conduct, with no central judge; a loss routes to an enforcement mission | Fits STN14 claim and reach plus KNW: a guard judges what it sees |
| FRC46 | **Prices across markets** (FRC18 between worlds) | Naev [living universe](../research/naev/LIVING_UNIVERSE.md) NV-D4, pinned source | Commodity metadata plus periodic price functions per region | Shape for local prices; the note itself warns prices moving is not stock moving (ECR conservation still owed) |
| FRC47 | **Divine answers as effects** (AGT8 no prayer module) | Dwarf Fortress [chain details](../research/dwarf-fortress/emergence-2026-10-15/audit/CHAIN_DETAILS.md), extracted Lua | A blessing emits typed effects with severity, probability and a time window | An answer from an acting power is ordinary effects with a duration (AGT, AD38) |

### Gaps the bank does not cover

No documented source found for: one sanity meter (Cultist Simulator and Book of Hours notes have no hits), NPC schedules with a midnight rule (RCL7), per-character item identification (RCL15 neighbour; Qud names the Examiner path only), or a growing offline cap. These stay original design or need a new read. Thin leads: CK3 stress and coping traits; Cult of the Lamb doctrines on real traits; Six Ages 2 rituals at year boundaries.

### LATER

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| FRC48 | Read the Cultist Simulator and Book of Hours captures for dread, fascination and other mind meters (MND, RCL5) | Haiku, small | A digest naming the meters, their sources and what breaks |
| FRC49 | Read Stardew and Rune Factory 5 NPC schedule data for the midnight rule (RCL7) | Haiku, small, can ride on the pet digest session's captures | Schedule rows with times and the day-boundary rule |
| FRC50 | Fold FRC38 into STY10 and FRC39 into MND5 as dated "bank shape" notes when a slice picks them up | Sonnet, small, at slice time | The rule rows cite the bank digest |
