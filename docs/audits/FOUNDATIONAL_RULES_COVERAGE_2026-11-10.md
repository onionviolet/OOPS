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
