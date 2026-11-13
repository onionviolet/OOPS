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
| FRC18 | **Between worlds: the hub, cross-world value and travel authority** | WER (entry), [multiverse structures](../worlds/MULTIVERSE_STRUCTURES.md) OD5 and OD11, `AUTHORITY_MODELS`, WKR17 | Many worlds is his direction; what money, items and titles are worth across worlds has palettes only | Drafted 2026-11-10: [CROSS_WORLD_RULES](../CROSS_WORLD_RULES.md) XWR1–XWR28; limiting lines LLR34–LLR36 |
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
| FRC27 | **Mechanical rules can be linted cheaply.** Candidates: no new clock counter outside `world_day_index.js` (TMR1); no reader branching on a preset id (WKR1); new story windows import `windowKit` (STY17); source rows name a medium once the source table exists (SKR1). | Done 2026-11-10 for TMR1, WKR1 and STY17: `scripts/check_rule_lints.mjs` in `check:rules` (`npm run check:rule-lints` alone), baseline `scripts/rule_lints_baseline.json` (TMR1 16, WKR1 0, STY17 38 hits), test `tests/rule_lints_check.test.js`. Warning-only: a new hit prints WARN with its code and does not fail (failing stays Weibao's call). SKR1 waits for the source table |
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
| FRC48 | Read the Cultist Simulator and Book of Hours captures for dread, fascination and other mind meters (MND, RCL5) | Haiku, small | DONE 2026-11-10: [mind meters digest](../research/cultist-simulator/MIND_METERS_DIGEST.md) (from committed notes; private snapshots missing from disk) |
| FRC49 | Read Stardew and Rune Factory 5 NPC schedule data for the midnight rule (RCL7) | Haiku, small, can ride on the pet digest session's captures | DONE 2026-11-10: [NPC schedules digest](../research/stardew-valley/NPC_SCHEDULES_DIGEST.md) (Stardew rule shown; RF5 midnight not established) |
| FRC50 | Fold FRC38 into STY10 and FRC39 into MND5 as dated "bank shape" notes when a slice picks them up | Sonnet, small, at slice time | The rule rows cite the bank digest |

## Round 6, 2026-11-10: the third build wave and what merging teaches

Weibao asked "Other systems we can take? send chats for each? More aspects to consider?" while the first four build branches (needs seam, spoilage, regional prices, mood) were merging. Systems below are the bank shapes with a caller and no owner yet; aspects come from integrating thirteen parallel branches.

### Systems, third wave

| Code | System | Bank shape | First caller | Disposition |
| --- | --- | --- | --- | --- |
| FRC51 | **Mind meters as dated entries** (MND, RCL5 carrier) | Cultist Simulator dread and fascination ([digest](../research/cultist-simulator/MIND_METERS_DIGEST.md)): meters are cards with a lifetime; a third mark opens an ending route with a last window to abate it; contentment cancels one mark | LOTM: Klein's strain from what he sees, read beside the mood rows and feeding the one loss carrier | **First slice built 2026-11-10** (proposal, agent-verified): `mind_meters.js` over mood rows, `book_world_lotm_mind.js` (Klein); see [MIND_RULES open details](../MIND_RULES.md#open-details) |
| FRC52 | **Rest and healing by body** (FRC44 second consumer, BHR) | Kenshi B4 per-body heal and strength; RimWorld rest need on the same interval shape as food | A second need kind on `needs.js` and the body `heal` multiplier read by recovery; a construct never tires | ACT NOW: session, after the needs merge |
| FRC53 | **Warning-first rule lints** (FRC27) | None; local tooling | `check:rules` warns on a new clock counter outside `world_day_index.js` (TMR1), a reader branching on a preset id (WKR1), a new story window not importing `windowKit` (STY17) | ACT NOW: session |
| FRC54 | **Who knows what an item is** (KNW, gap the bank does not cover) | Caves of Qud names the Examiner path only; original design otherwise | An unknown find is named by what this character has learned; another character sees it differently | ACT NOW: session, original design labelled |
| FRC55 | **Companion work orders and opinion** (CPR15, CPR18) | Rune Factory 5 helper work orders; Qud follower opinion kept apart from allegiance | A kept creature does daily work at a place and its opinion outlasts leaving | IMPLEMENTED (proposal), branch `claude/companion-work-b838ef`: kept Gu work orders and opinion apart from allegiance; see CPR15 and CPR18 rows |
| FRC56 | **Produce from care** (CPR23) | Stardew deluxe produce from friendship and mood | Sheep fleece quality reads care and mood | LATER: after the pet record and mood both merge |
| FRC57 | **One equipment read** (RCL10) | Consolidation | Native, simulation and structured equipment adapt to one stat read | LATER: after this wave's checkpoint (RCL3) |

### Aspects from merging

| Code | Aspect | Disposition |
| --- | --- | --- |
| FRC58 | **Master's `check:rules` is red from outside.** STORY_RULES (commit 28161dd05) links the fate handoff, which sits untracked in the primary checkout, so every lane's floor fails on the same link. | ACT NOW: commit that handoff or drop the link; its owner or Weibao decides |
| FRC59 | **Shared docs are the merge hot spot.** Every slice adds an AREA_GUIDE row, and mood and the pet record both touch `person_ties.js`. | ACCOUNT FOR NOW: merge each branch as it reaches the floor; new sessions branch from master after the merge; dependent slices name the branch they wait on |
| FRC60 | **Separately built systems now meet.** Spoilage, needs, regional stock and mood each passed alone; whether rotten food still feeds, whether shelf stock spoils and whether hunger moves mood is untested together. | ACCOUNT FOR NOW: one combined headless play after each merge batch; a cross-system defect becomes a regression in the owning module |
| FRC61 | **Save shape across merged slices.** Several slices add saved state; each passed save, reload and import alone. | ACCOUNT FOR NOW: the merge batch runs one combined save, reload and import (AD43 line six) |
| FRC62 | **The blind playtest pilot fits now.** With several systems landed, a no-knowledge agent through the game MCP is the cheapest cross-system check. | Offer stands; Weibao picks LOTM or HP |

## Round 7, 2026-11-10: architecture under a wide build wave

Weibao asked "Other systems we can take? send chats for each Do we need to consider archetecture and more?" with nine bank slices merged and about eleven build sessions running. Facts at the time: load average 15 to 30, 1,184 files in `src/`, `dist/bundle.js` 9.6 MB, 5,904 tests taking about six minutes per full run through one machine-wide slot, `display.js` 6,761 lines (baseline held), 205 grandfathered cyclic edges (none added by the merges).

| Code | Aspect | Disposition |
| --- | --- | --- |
| FRC63 | **The test slot is the throughput limit.** Every lane runs one full suite and each merge batch runs another; with eleven lanes, waits stretch to hours. | ACCOUNT FOR NOW: lanes run focused tests and leave the full suite to the merge batch (AD36); merges go in batches; new lanes wait until running ones land, about eight build lanes at once |
| FRC64 | **One seam, four writers.** Mind meters, Harry Potter mood, opinion and gifts all build on `mood_thoughts.js` at once. | ACCOUNT FOR NOW: mind meters merges first as the mood core's owner this round; the others read and write through its API and rebase on it, with any core change named in their report |
| FRC65 | **`person_ties.js` is the people hot spot.** Mood, pet record, opinion, gifts and news all touch it; RCL11 counts three person stores already. | LATER: the one person record (RCL11) runs after this wave's people slices merge, as its own consolidation slice (RCL3) |
| FRC66 | **Seams with one world caller (AR11).** Spoilage, regional prices, item knowledge, needs and offline replay have one world each; storyteller, exams and mood have second-world lanes running. | LATER: a second-world lane per seam once the current ones land; revise or delete a seam the second case fights |
| FRC67 | **Merged slices were proven alone.** No combined play, no combined save, reload and import, no reachability or registry sweep across them (AR10, AR19, AR6, FRC60, FRC61). | ACT NOW: an integration lane: combined headless play through the merged systems at 1920×1080, one save, reload and import, an AR2 and AR19 check of each new module, AR13 change surfaces, and a regression for any cross-system defect in its owner. DONE 2026-11-10: [wave integration](WAVE_INTEGRATION_2026-11-10.md) (WIN1-WIN13: three lives played together in headless Chromium, TMR4 equal on played and banked time, combined save, reload and Import equal; one shelf defect fixed, WIN3) |
| FRC68 | **Many small new modules.** Each slice adds a pure reader; the area guide is the only map. | ACCOUNT FOR NOW: each slice adds its area guide row (already practice); the integration lane flags any reader with no caller. Flagged 2026-11-10: [no-caller readers](WAVE_INTEGRATION_2026-11-10.md#frc68-exported-readers-with-no-caller-outside-tests) |

## Round 8, 2026-11-10: bottlenecks, long term

Weibao asked to "Address bottlenecks long term too". Round 7's FRC63 handled the short term (focused tests in lanes, full suite per merge batch, about eight lanes). These are the structural fixes.

| Code | Bottleneck | Fix | Disposition |
| --- | --- | --- | --- |
| FRC69 | **Every lane needs the full suite to trust a change.** | `npm run test:changed`: run the tests that import, directly or through the import graph, any file changed since the merge base; the full suite stays the merge gate | LANDED 2026-11-13 from the lane draft (lane reported done 2026-11-10; not re-verified on the merged tree): `npm run test:changed` selects by imports, named paths and folder walks, prints why, runs through the limiter; AGENTS.md and AD36 updated ([record](TEST_SPEED_2026-11-10.md)) |
| FRC70 | **The full suite is about six minutes and growing.** | Profile per-file durations, speed up or split the slowest files, and keep a duration budget test so a new slow file shows up | LANDED 2026-11-13 from the lane draft (lane reported done 2026-11-10; not re-verified on the merged tree): the 20 slowest all play the game and are labelled; the headless DOM was the incidental cost (boot about 1.7x faster); `npm test` warns past `tests/duration_budget.json` ([record](TEST_SPEED_2026-11-10.md)) |
| FRC71 | **Merging is manual and serial through one chat.** | A merge-queue script that does the isolated procedure used today: `merge-tree` per branch, build and checks in a scratch worktree, one full suite, guarded `update-ref`, then primary-checkout sync with three-way `merge-file` for paths other sessions have dirty | DONE 2026-11-10: `scripts/merge_queue.mjs` (dry run by default, `--apply` moves master), test `tests/merge_queue.test.js`, documented in [shared worktree practice](../gm/SHARED_WORKTREE_PRACTICE.md#merge-before-dispatch) step 5 |
| FRC72 | **Build outputs in git.** `dist/bundle.js`, its map and the version stamps in `index.html` change in every worktree and every merge. | Proposal: regenerate them only at merge time, or stop tracking them if nothing deploys from git. Changes what ships; Weibao decides | ASK |
| FRC73 | **Shared docs as append points.** AREA_GUIDE and RULES_INDEX take a row from most slices. | Proposal: per-area files under one index, or a generated guide from per-module headers | LATER, sonnet, medium |
| FRC74 | **Browser proof walks are slow.** Reaching exam day or day 3 takes minutes of headless play. | Dev-only fixtures per world (the HP exams lane built one) behind one loader, also offered to the game MCP | DONE 2026-11-10: six named DEV fixtures in `scripts/headless/world_fixtures.mjs` (LOTM Tingen day 3, HP exam week, Gu fed plus second Gu, MOL loop 2, Frontier hunt ready, household cat), scenarios and `game_new {scenario}` names, browser opener `scripts/fixture_browser.cjs`, how-to at [AD36 item 11](../RULES_INDEX.md#efficient-rule-verification-ad36); evidence [world-fixtures-2026-11-10](../gm/dispatch/world-fixtures-2026-11-10/README.md) |

## Round 9, 2026-11-10: deeper takes and what the wave still owes

Weibao asked "Other systems we can take? send chats for each, Deeper adaptations and improvements? Other aspects?" with eleven bank slices merged or merging and about fifteen lanes open.

| Code | Aspect | Disposition |
| --- | --- | --- |
| FRC75 | **Each merged system took one slice of its bank shape.** RimWorld's storyteller, mood and needs, Factorio spoilage, Naev prices, Kenshi law and bodies, Melvor offline and mastery each have more mechanism in the notes than the first slice used, and the first callers show where the fit is weak. | ACT NOW: a read-mostly deeper-takes lane writes, per system, what the shape still offers, what the first slice adapted, and ranked improvements with level, effort and done check; no runtime edits | **DONE 2026-11-10: [bank deeper takes](BANK_DEEPER_TAKES_2026-11-10.md) (BDT1-BDT111; ten systems, ranked rows, Weibao list BDT105-BDT111).**
| FRC76 | **Browser proof is the slowest gate.** Lanes spend most of their wall time walking a fresh life to the day a feature needs. | DONE 2026-11-10 with FRC74: a cached fixture opens in headless Chrome in seconds where the walk took minutes to hours ([timings](../gm/dispatch/world-fixtures-2026-11-10/README.md)); lanes still play the change and run save, reload and import from a fresh origin |
| FRC77 | **Weibao has not played the wave.** AGENTS: a wave ends at a checkpoint he can play. Eleven systems merged with agent evidence only. | ACCOUNT FOR NOW: after the people slices land, one "what's new" checkpoint note listing where each system shows up in play, with a fresh build; human review stays optional (AD42) |
| FRC78 | **Below-floor branches age.** Creature populations, windowKit migration, gods and patrons, and Mother of Learning research sit unmerged while master moves. | ACCOUNT FOR NOW: finish each when the test slot frees, or record it as implemented, below floor, and retire the lane |
| FRC79 | **Master moves under a tested merge.** Other sessions commit runtime code to master during a merge batch's suite, so the tested tree goes stale (it happened on the law and pet batch). | ACCOUNT FOR NOW: the merge queue (FRC71) re-merges on the new master and reruns only when the delta touches runtime code; with `test:changed` (FRC69) the rerun can be the changed set |
