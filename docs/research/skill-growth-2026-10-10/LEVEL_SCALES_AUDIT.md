# C2: Level scales across sources and genres

Date: 2026-10-10. Complete bounded audit. Findings and implementation
considerations are proposals, not accepted rules. No gameplay changed.

## Answer and evidence boundary

**F1, analysis:** 100, 1,000 and 1,000,000 cannot establish power without
knowing what is counted, the progression function, the local population
and the relevant encounter. A capped craft skill, an uncapped attribute,
a soul tier and a response rating are different measurements.

**F2, READ:** A Novel Concept's author glossary makes the distinction
explicit. Attributes multiply linearly, while skill rarity roughly triples
power at each rarity step. Its comparison needs Strength 2,700 with a
Common skill to offset Strength 100 with a Legendary skill at equal skill
level. At the supplied edition's cutoff, Constitution is 2,690 while
personal Tier remains 0. Thousands in one field do not imply thousands
in another. [Original glossary](../novels/full-book/a-novel-concept/source/0117.txt)
P0067-P0069; [cutoff status](../novels/full-book/a-novel-concept/source/0449.txt)
P0083-P0087. This is the author's stated model, not an independently
measured universal combat equation.

**F3, analysis:** S1-S14 mix several dimensions. Cap magnitude (S1-S4),
label vocabulary (S5-S8), nesting (S9/S13/S14), mathematical spacing
(S10), relative placement (S11) and absence of a universal ladder (S12)
can coexist. Treat them as descriptors rather than mutually exclusive
bins. Neither a named realm nor a letter grade guarantees a hard gap.

Owner packet: [C2](../../gm/dispatch/skill-growth-2026-10-10/C2_LEVEL_SCALES.md),
with [COMMON](../../gm/dispatch/skill-growth-2026-10-10/COMMON.md).
Framework: [SKILLS_AND_TALENTS](../../SKILLS_AND_TALENTS.md#level-scales-when-is-a-number-op-2026-10-10).
Companions: [read-history](READ_HISTORY_AUDIT.md), [unread](UNREAD_AUDIT.md).
Use their **merged** G1-G40 and L1-L23 meanings from the framework.
The companion files reuse G23/L11 onward differently; their original
numbers must not be copied without remapping. Example: personal ceiling
is merged L20, cooldown frequency is L19, office tenure is L22.

READ = original source text or code inspected this run. STATED = a
catalog blurb, local research note or wiki digest reports it. A previous
worker's READ, SHOWN or CANON label does not become this run's READ.
MEMORY = unverified recall. Analysis, deductions and proposals are
identified separately. Unknown means the inspected evidence does not
establish it, not that the source has none. No novel was read in full
in this run. Novel dossiers were inspected in bounded relevant excerpts.

## Source index

Links below identify the local evidence actually inspected. N/P/J codes
are stable row references, not new framework codes.

| ID | Source and inspected owner | Evidence in this run |
|---|---|---|
| N1 | [A Novel Concept deep dive](../novels/a-novel-concept/SYSTEMS_DEEP_DIVE_2026-10-10.md), §§1-2; [full-book taxonomy](../novels/full-book/a-novel-concept/TAXONOMY.md), [report](../novels/full-book/a-novel-concept/REPORT.md) | STATED; original text READ at ordinals 0001 P0043-P0046, 0117 P0067-P0069/P0072, 0227 P0040-P0046, 0449 P0083-P0087 |
| N2 | [Lord of the Mysteries pathways](../novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md), L1-L9 | STATED, chapter locators retained in owner |
| N3 | [Reverend Insanity](../novels/reverend-insanity/SYSTEMS_DEEP_DIVE_2026-10-10.md), R1-R3/R9-R13 | STATED, notably ch6/26/80/135/2085 |
| N4 | [Shadow Slave](../novels/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md), S1-S8 and §2 | STATED, ongoing-book snapshot |
| N5 | [Solo Leveling](../novels/solo-leveling/SYSTEMS_DEEP_DIVE_2026-10-10.md), V2/V3 and snapshots; [taxonomy](../novels/full-book/solo-leveling/TAXONOMY.md) | STATED, novel edition; sequel/game rules not merged |
| N6 | [Omniscient Reader](../novels/omniscient-reader/SYSTEMS_DEEP_DIVE_2026-10-10.md), O2/O5/O9/O12; [synthesis](../novels/full-book/omniscient-reader/SYNTHESIS.md) | STATED, supplied ch1-551 boundary |
| N7 | [Cradle audit](../novels/cradle/WORLD_AUDIT_2026-10-10.md), §1 | STATED via chapter-citing wiki/author-statement synthesis, not direct book READ |
| N8 | [Worm](../novels/worm/SYSTEMS_DEEP_DIVE_2026-10-10.md), W3; [full-book systems](../novels/full-book/worm/SYSTEMS.md) | STATED; operational cases rather than universal conversion |
| N9 | [Mother of Learning](../novels/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md), §§1-2 | STATED; dossier distinguishes capacity, efficiency and character guesses |
| N10 | [Legendary Mechanic](../novels/legendary-mechanic/SYSTEMS_DEEP_DIVE_2026-10-10.md), R1-R8; [power notes](../novels/full-book/legendary-mechanic/POWER_AND_PRODUCTION.md), opening and equipment sections | STATED; dossier supersedes its older unresolved version-cap questions |
| N11 | [Regressor's Tale](../novels/regressors-tale/SYSTEMS_DEEP_DIVE_2026-10-10.md), R2/R8-R11; [power scale](../novels/full-book/regressors-tale/POWER_SCALE.md), opening rows | STATED; reviewed boundary near ch640, later wiki material separate |
| P1-P10 | [Wiki digests](../power-systems/wiki-digests/): DIGEST_naruto, hunter-x-hunter, jujutsu-kaisen, bleach, fate-series, the-elder-scrolls-skyrim, dark-souls-1-covenants, fallout, dungeon-crawler-carl, harry-potter (.md) | STATED where revision-backed; blocked digest scaffolds are leads only |
| J1 | [Melvor report](../melvor-idle/REPORT.md), mastery and DLC table; [findings](../melvor-idle/FINDINGS.json) | STATED from source audit |
| J2 | [Increlution report](../increlution/REPORT.md); [findings](../increlution/FINDINGS.json), F6-F8 | STATED from decoded code/tutorial audit |
| J3-J7 | [CK3](../crusader-kings-3/REPORT.md), [DF](../dwarf-fortress/REPORT.md), [Qud](../caves-of-qud/REPORT.md), [Tale of Immortal](../tale-of-immortal/REPORT.md), [Ani Idle](../ani-idle/REPORT.md), plus their FINDINGS.json | STATED; local audit coverage does not establish every level curve |
| J8 | [Endless Ascent](../endless-ascent/REPORT.md), F1-F3 | STATED; important negative identification |
| J9 | [Idling to Rule the Gods](../idling-to-rule-the-gods/REPORT.md), rebirth/time rows | STATED; targeted handler audit, no universal scale cap proved |
| J10 | [YAIR skill model](../../../src/models/skill.js), constructor/add_xp/get_coefficient/get_level_bonus; [skill definitions](../../../src/data/skills.js), cap overrides | READ source only, no runtime claims |

## Novels: scale, cap, spacing, population and gap

All table claims are STATED unless marked READ or MEMORY. Shape assignments
are C2 analysis. Counts are dated narrative snapshots, not population
estimates for all eras. A dash in a ratio is never implied.

| ID/source | Shape and counted field | Cap or horizon | Spacing | Population curve | Can lower beat higher? |
|---|---|---|---|---|---|
| N1 ANC | S2 skill caps + S9 tiers + S14 parallel fields | Common/Rare/Epic skills 20/40/60; Legendary cap unknown; dossier personal tiers 0-10 | READ: linear attributes, roughly 3x rarity steps; tribulation pressure square, not exponential | Dossier names top-tier administrators; no complete distribution | READ: attribute advantage can offset rarity in glossary comparison; this does not prove every tier can be bypassed |
| N2 LotM | S8 reverse sequence + S5 named role | Sequence 9 to 0; beyond-sequence structures make 0 an endpoint of that ladder, not all growth | Qualitative abilities and rituals, not a numeric XP multiplier | Fixed characteristics; one Seq0 seat per pathway; high-rank stock constrains lower stock | Large qualitative gaps; artifacts/allies and matchup need case evidence; no universal ratio established |
| N3 RI | S9 rank/stage; S5 attainment beside it | Rank1-9; 1-5 mortal, 6-9 immortal; rank9 is published ladder apex, not proof no further possibility | Mortal substage essence efficiency doubles; rank essence ratio 10x in dossier | Ten historical Venerables over about 3 million years, historical count rather than ten simultaneous seats | Essence ratio alone cannot settle a fight; Gu, killer moves and attainment are separate means |
| N4 Shadow Slave | S5 rank × core count, proposed S15 (C2) | Seven rank names; core classes Beast1 through Titan7 | Rank changes quality, core count changes class; shard value doubles per rank, not necessarily damage | ~3bn humans; hundreds of thousands Awakened; hundreds then thousands Masters; dozens then >100 Saints; seven Sovereigns ever, mixed-era snapshots | Dossier calls rank gaps enormous; class, aspect and gear remain distinct; no quantified guaranteed win rule |
| N5 Solo Leveling | S6 institutional hunter bands + private numeric system | No universal player cap established; level 133 is a snapshot; taxonomy reports local skill cap 3 | Level adds +1 each stat; free quest points and skill evolution add other growth | Most hunters have fixed awakenings, rare reawakening; rank census unknown | E/S rank and player's level are not one ladder; low public rating can conceal growth |
| N6 ORV | Numeric purchased stats + scenario caps + story grades; S9/S14 | Scenario-local stat limits; skills can pass Lv10 by a different route | Dossier fitted purchase cost 100 × (floor(L/10)+3); stories and transcendence are qualitative | Audience, sponsors and scenario selection complicate any pyramid; no census | Stories, scenario probability and compatibility can constrain deployment; no simple level-only rule |
| N7 Cradle | S5/S7 labels; branching distinctions, proposed S17 (C2) | Foundation through Monarch locally; ascension is not a numeric cap extension | Structural change plus resources; Lord revelations; Sage/Herald can be reached in unusual orders | Sacred Valley adults mostly Iron, typical ceiling Jade; no Archlord in Blackflame Empire at cited point; no global percentage table | Wiki's ten-Coppers-to-Iron heuristic is expressly non-strict; within-stage overlap and unusual distinctions matter |
| N8 Worm | S12 no universal progression level + response profile, proposed S18 (C2) | No global cape level cap established | Classification tags and response estimates, not XP | No power-rating census in reviewed excerpts | Tactical protocol can be mistaken; matchup, information and environment matter |
| N9 MoL | S12 character ladder; quantified capacity and practical efficiency | Fourfold lifetime reserve cap is dossier inference; not certified hard cap | Innate magnitude, usable reserve and cost efficiency differ | Average mage reserve 8-12 missile casts; not a full distribution | Dossier reports Zorian's effective reserve improves by efficiency; more mana does not guarantee finer control |
| N10 Legendary Mechanic | S2/S6 + era cap, proposed S19 (C2) | Player version caps 60/90/120/150/180/200; later cap unknown; Han reaches 360 outside player version limits | Promotion missions each 20 levels from 60, race evolution each 40; grade also uses Ona and conditions | Native/player populations have different limits; high-grade rarity not quantified here | Gear/army/link and missions matter; Ona, stored energy and character level are different fields |
| N11 Regressor's Tale | S5/S9 cultivation plus martial path | About eighteen realms in dossier; upper labels partly later wiki; ultimate cap unknown | Named breakthroughs, lifespan steps 300/600/1200/2400 then much larger; lifespan not direct combat multiplier | Talent/resources gate entry; no population histogram established | Martial understanding has specific uses before qi restoration; no universal martial-to-realm damage ratio |

## Novels: trajectory, rate, readability and crossing

Unknown endpoints are deliberate. Supplied-book cutoffs and selected early
reads do not establish final power. STATED except explicitly labeled.

| ID | Start → inspected horizon | Rate | How the scale stays readable | Cross-world reading/conversion |
|---|---|---|---|---|
| N1 | READ after first revival: Strength19, Constitution22; cutoff Constitution 2,690, personal Tier0 | Dossier: 14 tribulations in one year; not a constant levels/day | Status groups PHY/MEN/META, rarity names, thresholds and separate tiers | Dossier rift residence depends on personal/world tier and route; no global conversion of attributes proved |
| N2 | MEMORY: Klein begins ordinary, then Seq9; final boundary not checked here | Dossier: low sequences with acting ~1-6 months, without ~3 years plus test; not uniform at apex | Countdown, potion role names, Saints/Angels/Gods | Outer boons use 9-0 labels for convenience; equivalent labels do not establish equal ownership or stability |
| N3 | MEMORY: reborn beginning without current cultivation → Rank9 at published cutoff | Recollection accelerates methods; uniform rank/year unknown | Four mortal substages, essence colors, named attainments | Apertures have separate time ratios; no numerical cross-setting conversion established |
| N4 | MEMORY: ordinary infected entrant → dossier horizon ongoing; exact Sunny endpoint not checked | Seed/season/event gates rather than automatic XP thresholds | Rank and core-class names shown separately | Human and creature labels map to shared core-quality ranks; body/item travel is separately gated |
| N5 | MEMORY: E-rank hunter → STATED level 80 ch99,133 ch204; later authority is outside ordinary skill leveling | Exceptional player's repeated quests/kills; calendar rate unknown | Small stat groups, class and shadow grades | Gate destinations have differing clocks; no hunter-rank-to-world-level exchange established |
| N6 | MEMORY: ordinary reader → story/status routes; exact ending rank not verified | Purchases are paced by scenario earnings and caps | Story grade and modifier sit beside numeric stat/skill level | Dossier says system effects can fade with Star Stream influence; carrying a number alone need not carry its mechanism |
| N7 | STATED: Foundation/Unsouled at 15 → MEMORY: final-book end beyond local ordinary hierarchy | Resources and revelations cause plateaus/bursts; lifelong old Underlord and rapid rich outlier both documented | Rank names, peak flag, separate Sage/Herald distinctions | Ascension moves scope; Abidan Judge is office, not the next universal numeric level |
| N8 | MEMORY: Taylor's trigger → later power/control changes; numeric endpoint inapplicable | Practice/interpretation/events, not levels/day | Tactical tags, abilities and witnessed feats | Local cases in full-book notes explicitly do not establish a universal cross-world scale |
| N9 | STATED: Zorian10 effective missile casts/magnitude8; later ~35 effective casts, not a final reserve cap | Loop repeats training; time compression and efficiency change learning opportunities | Native units and named exercises rather than enormous level labels | Reset can retain understanding while resetting body/world; a transfer ledger must distinguish these |
| N10 | MEMORY: low-level laboratory captive → STATED360 at late horizon | Dossier: six game days per real day; updates advance world years; no fixed levels/year | Level, Ona grade, class, promotion and era presented separately | Player login link and world chronology differ; equipment energy120/120 is not grade120 |
| N11 | STATED: no roots/ordinary beginning → late supplied ch640 horizon, exact realm not established in this run | Multi-life retained understanding and rebuilt reserves; reported lifespans span centuries to millions of years | Named realms, martial stages and loop count | Dossier maps three path-specific ladders onto shared stages; regression resets realm/body while understanding can survive |

## Other settings and games

Each row records missing requested fields explicitly. Many wiki digests
were built for vows and permissions, so their coverage cannot certify
character level caps. Blocked scaffolds do not become evidence because
another field calls them measured.

| ID/source | Shape/cap/spacing | Population and gap | Start/end/rate | Display and cross-world conversion | Label |
|---|---|---|---|---|---|
| P1 Naruto | S5 office/exam ranks; power cap unknown | Rank does not imply capacity; census/gap unknown | Beginning/end/rate not read | Military title separate from chakra/body; conversion unknown | MEMORY for setting distinction; digest blocked_no_revision |
| P2 HxH | S12; Hunter title not Nen level; cap unknown | Conditions, aura and matchups differ; distribution unknown | Gon trajectory MEMORY; numeric endpoint inapplicable; rate unknown | Type/conditions/teacher judgment rather than one score; conversion unknown | STATED digest earlier lead; revision-backed vow examples do not prove scale |
| P3 JJK | Institutional grades + craft/energy; cap unknown | Grade is not energy XP; outliers named; census unknown | No inspected protagonist endpoints or rate | Separate grade from technique/domain; conversion unknown | STATED digest model, scale detail not established by its vow revisions |
| P4 Bleach | Military rank and release-form gate; global cap unknown | Office not automatic release strength; census/gap unknown | Ichigo trajectory MEMORY; numeric endpoint/rate unknown | Form names; transfer rule unknown | MEMORY plus blocked digest lead |
| P5 Type-Moon/Fate | Parameter letters and class/container, S6/S14 | Parameters versus ritual authority; distribution/gap unknown | Summoned instance kit is not universal level growth; endpoints/rate unknown | Container, source record and enabled kit separate; conversion unknown | STATED digest, broad parameter ladder details not freshly read |
| P6 Skyrim | MEMORY skill100, legendary skill reset; character cap version-dependent | Skill100 not universal combat superiority; population unknown | MEMORY skills start variably; no single final protagonist level or universal rate | School skills/shout words; use XP not proven by vow-focused digest; conversion unknown | MEMORY scale; STATED digest separates knowledge and execution |
| P7 Dark Souls1 | Covenant-local rank layered over build; exact build cap unknown here | Faction credit not damage; census unknown; lower-build win MEMORY | Player build beginning/end/rate not established | Membership/offering/rewards separate; NG+ persistence differs by reward and edition | STATED revision-backed covenant claims; character build details MEMORY |
| P8 Fallout | Edition-specific skills, perks and reputation; no franchise-wide cap | Karma/reputation differ from body abilities; distributions unknown | MEMORY FO3 level 20/base,30/Broken Steel; FO4 no hard level cap; endpoints/rates unknown | Keep game/edition names on numbers; cross-setting conversion unknown | STATED reputation distinction; exact caps MEMORY |
| P9 Dungeon Crawler Carl | Crawler levels and floor gates; no safe universal cap established | Contest/AI decisions and audience; census/gap unknown | Opening/ending levels/rate not established | Floor is L15, not automatically character power; conversion unknown | STATED digest model; reviewed AI/sponsor revisions do not certify cap |
| P10 Harry Potter | S12 no universal numeric power level | Institutional certification not strength; census/gap unknown | School progression and practice MEMORY; numeric endpoint inapplicable | Spell access/observed acts; book/film/game versions differ; conversion unknown | MEMORY scale; STATED digest warns of version mixing |
| J1 Melvor | S2/local realm tracks; audited standard TotH cap 120; mastery per action/pool | Preparation, damage compatibility and access distinct; level-population unknown | Open player route rather than narrative endpoint; rate varies by action | One active action plus passives; AXP/resources/compatibility separate in Abyss; no free numeric merge | STATED |
| J2 Increlution | S14 generation/instinct; cap not established | No NPC level census; survival/action speed are relevant outcomes | Same authored beginning on reset; temporary vs persistent gains; formula rate below | Tooltip shows both levels and multipliers; cross-life ledger not world translation | STATED F7/F8 |
| J3 CK3 | Office/title hierarchy + skills/resources; not a single power ladder | Rank/succession do not settle warfare; distribution unknown | Birth-to-death/successor endpoint, rate varies by events | Prowess, stewardship, prestige and dynasty standing separate; no conversion | STATED audit; character trajectory MEMORY |
| J4 Dwarf Fortress | MEMORY skill ranks ending in Legendary, with more progress possible; official audit does not establish cap | Audited wealth/population trigger threats; no skill census or guaranteed gap | Citizens have different starts; rate/cap curve not reviewed | Offices, appraisal/count precision and body/material effects differ; no conversion | MEMORY skill ladder, STATED audit details |
| J5 Caves of Qud | MEMORY character XP plus mutation levels/build; cap unknown in reviewed audit | Audited Cryokinesis requires range/target and physical temperature effects; no census/gap curve | MEMORY starts vary by origin; final level/rate not established | Character level alone does not encode resistance/temperature; no conversion | MEMORY ladder, STATED action evidence |
| J6 Tale of Immortal | S5/S9 realm progression; full ladder/cap not established in inspected report | Breakthrough quality and social duties differ; population curve unknown | Origin/ending/rate unknown; audited failure can require 12-month recovery | Realm/aptitude/technique data distinct; no conversion proved | STATED |
| J7 Ani Idle | Gear affix/tier advancement; character-level curve/cap unknown | No population/gap evidence | Character endpoint/rate unknown; audit found no character prestige/catch-up | Ascend/Rebirth crystals affect gear; no world conversion proved | STATED |
| J8 Endless Ascent | Level completion and currency, not established idle character scale | Population/gap inapplicable to audited puzzle slice | Completion-funded supplies; cap/endpoint unknown | ASCENSIONS currency name is not proof of prestige or OP scale | STATED |
| J9 ITRTG | Rebirth/multipliers/challenge targets; no universal cap established | God-count target not population-percentile ranking; gap unknown | Targeted reset/challenge/catch-up routes; endpoints/rate unknown | Prospective multipliers and actual retained owners separate; timed challenges can exclude offline credit | STATED |
| J10 YAIR | S2 default skill60; observed overrides10/20/25/30/40; geometric XP cost | No source-established world population by skill; combat gaps cannot be inferred from cap | Skill XP model begins at0; rate depends on actual XP source/multipliers | Threshold names, visibility and milestones; native foreign-world exchange absent from Skill | READ |

## Checking S1-S14

| Code | C2 finding/proposed correction | Evidence |
|---|---|---|
| S1 small cap | Keep. Few levels can contain major qualitative changes, but every step need not be equally large | READ [D&D2024 advancement](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character): level 1-20, different feature/XP steps, optional feats after20 |
| S2 hundred cap | Keep as approximate scale, not a universal cap 99 or a rule that50 means veteran | READ YAIR caps vary. STATED [Jagex2024 update](https://secure.runescape.com/m=news/new-skill-levels-110-mining--smithing) raised Mining/Smithing to110; this is dated evidence, not a complete current cap roster |
| S3 soft thousand | Keep provisionally; inspected novel sample does not prove1000 as a common character apex | MEMORY Primal Hunter pairing needs cap/grade verification; ANC thousands are attributes |
| S4 uncapped/inflating | Split uncapped from huge-but-finite | STATED [Disgaea celebration](https://www.nisamerica.com/event/disgaea_5million/) describes 9,999 max; [Disgaea6 publisher page](https://www.nisamerica.com/disgaea/d6/system_new.php) advertises 99,999,999. Neither is evidence of infinity |
| S5 named realms | Keep; exclude automatic conversion of office ranks into power tiers | STATED N7 structural gates, P1/P4 blocked leads |
| S6 letter grades | Keep; label what receives the grade, who grades it and whether it changes | STATED N5 public hunter rank vs private growth, N10 energy grade vs level |
| S7 metals/colors | Keep as vocabulary; overlaps S5 or S6 | STATED companion audit Lone Wanderer cores; actual color transition not reread |
| S8 countdown | Keep; numeric direction needs explicit display | STATED N2 Sequence9→0; characteristics and seat scarcity matter |
| S9 tier/sublevel | Keep; distinguish nested subordinate fields from independent axes | STATED N3 rank+stage; N4 rank×class is different |
| S10 logarithmic | Qualify. Logarithmic labels can summarize exponential quantities; power-of-ten reward thresholds alone do not prove every combat step is10x | STATED companion DIE. RESPAWN. REPEAT. banking bonuses; RI's10x essence has stronger ratio evidence |
| S11 percentile | Keep as a relative view, not necessarily an actor's native power | STATED read-history top1% selection; population and observation scope can change percentile without any growth |
| S12 no scale | Rename conceptually to no universal power ladder; quantified traits/ratings may still exist | STATED N8 tactical tags, N9 mana units |
| S13 nested scales | Keep; require what is nested and whether a higher field actually contains the lower | READ N1 four-digit attributes at Tier0; STATED N6 world/scenario context |
| S14 simultaneous scales | Keep; hiddenness optional, independence explicit | STATED Prestige Grinding snapshot and Increlution exposed tracks; not always a small false number hiding a large true one |

D&D's20 is a character-level cap, not a ban on all later growth. The
2024 rules permit optional feats for each 30,000 XP beyond 355,000.
[Official rules](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).
This is READ of published rules, not evidence every campaign uses that option.

## New scale proposals

No new G or L code is needed. These S codes are C2-local proposals for
Claude to merge. S20 is a cap policy; S18 is a measurement type. They
should remain composable with the original shapes.

| Code | Name and distinction | Evidence/example | OP implication |
|---|---|---|---|
| S15 (C2) | Orthogonal profile: independent axes, not levels nested inside a tier | STATED Shadow Slave rank×cores; READ ANC attributes vs personal/race/skill fields | A character can dominate one task while remaining weak in another |
| S16 (C2) | Finite seat/stock apex: top population constrained by conserved resources or offices | STATED LotM characteristics and Seq0 seats | Apex rarity persists even if training becomes cheap; holder vacancy matters |
| S17 (C2) | Branch-and-converge ladder: incomparable distinctions combine later | STATED Cradle Sage/Herald distinctions and exceptional timing | No defensible universal Sage>Herald or reverse ordering |
| S18 (C2) | Operational rating: observers choose a category/vector to decide a response | STATED Worm PRT classification; merged L12 | High rating means need for response, not a promise to win every duel |
| S19 (C2) | Moving institutional/era ceiling: cap changes with version or jurisdiction; exceptions differ | STATED Legendary Mechanic player version caps vs native exception; dated Jagex110 | Old maximum can lose prestige without deleting old competence |
| S20 (C2) | Personal/role-bounded ceiling: different holders have different attainable ends | STATED You Have Died Again blurb; merged L20 |50 may be one holder's ceiling and another's midpoint |

Variants, not extra codes: enormous finite cap belongs beside S4;
prestige cycles combine S14 with G35; percentile normalization is an S11
view; capacity percentages reuse L23. No claim that the new shapes are
common follows from these selected examples.

## What makes 100, 1000 or more feel OP?

This section is analysis. OP needs a reference task and comparison group.
Local legend, world-dominating fighter and unusually efficient crafter are
three different claims.

| Scale family | What makes a number feel OP | What undermines that reading |
|---|---|---|
| Small/hundred cap S1/S2 | Near-terminal unlocks and useful kit relative to encounter | Cap in Cooking says little about surviving a dragon; missing tools can block execution |
| Soft-thousand/inflation S3/S4 | Large ratio to contemporary peers plus visible consequences | Opponents inflate too; finite huge cap still has a ceiling; large XP alone is not damage |
| Named/letter/color/countdown S5-S8 | A new operation, transformation or immunity, plus demonstrated rarity | Office misclassification, independent axes and counterplay |
| Nested/parallel S9/S13/S14/S15 | Advantage on the field the task consumes | High skill level with low fuel, mismatched rarity or insufficient soul capacity |
| Log labels S10 | Difference in underlying quantity; if exponent labels differ by 3 at base 10, underlying ratio is 1,000 | That ratio holds only for the defined quantity, not all combat outputs |
| Percentile S11 | Scarcity against a specified observed population | A champion of one village can be ordinary globally; new arrivals move ranks without weakening anyone |
| No universal ladder S12/S18 | Reliable feats, matchup control or ability to force a response | No scalar comparison can settle unknown mechanisms |
| Seats/branches/moving/personal caps S16-S20 | Exclusive means, combined distinctions, cap-breaking route or new era mastery | A title or cap exception still needs an executable method |

**F4, analysis:** The framework's linear example needs an assumption.
If output is P(L)=kL, 1,000 gives 10x 100. If P(L)=a+kL, the ratio is
(a+1000k)/(a+100k), generally less than10 for positive a. A multiplicative
model P(L)=P0·r^L gives ratio r^ΔL. A single level is only decisive if r
and the encounter make it decisive. XP cost C(L) is a separate function.

**F5, STATED/analysis:** Explicit populations are rare in this evidence.
LotM provides a scarcity mechanism; Shadow Slave provides dated counts;
Cradle provides regional baselines. These support local rarity, not a
single universal pyramid. Selection, wars, sealed seats, access costs,
talent and geography can each produce a different curve. Do not invent
a global distribution from protagonist encounters.

## Crossing worlds and crossing measurements

Everything here is a proposal unless tagged with a source row. Follow
PROJECT's accepted body/carrier/means principles; this audit accepts no
new world law. Preserve the actual carried body, item, technique,
knowledge or contract before interpreting its number.

| Conversion proposal | When it can make sense | Required evidence and failure case |
|---|---|---|
| O1 Preserve units and carrier | Physical strength or an actual stored-energy quantity travels | Need compatible definitions/units and functioning carrier. ANC Strength is a native attribute, not certified kilograms |
| O2 Calibrate by demonstrated tasks | Two native instruments describe comparable action outcomes | Compare force/range/latency/fuel/resistance separately. Equal stone-breaking says nothing about soul attacks |
| O3 Translate native homologues | Two names describe the same source mechanism | STATED Shadow Slave human/creature rank names share core quality; this is an in-source mapping, not permission to map arbitrary franchises |
| O4 Show local percentile as a second reading | Observer has a suitable population sample | Keep provenance, region, date and uncertainty. Never physically nerf a visitor just to retain top1% |
| O5 Keep separate ledgers or lose unsupported service | A new world's evaluator cannot read a foreign system, or its carrier no longer functions | Unknown reading differs from missing power. STATED ORV system fading is source-specific; foreign magic does not fail by global default |

Analysis: do not linearly map99/100 to 990/1000, or Sequence0 to a chosen
maximum. A countdown gives ordering, not distances. A letter gives a
band, not a measured ratio. Percent-of-own-potential L23 also cannot
translate into absolute damage without a body baseline.

A proposed transfer receipt would record original world/field/unit,
carrier and current function, destination reading and confidence,
actually usable operations, and acquisition/expiry. These are research
considerations, not a new save schema. Cross-world time dilation changes
available training time; it does not multiply skill level by itself.

## Idle pacing and display

**F6, STATED:** Increlution's inspected dossier F7 reports generation XP
threshold scale 90 growing 1.11, instinct scale 1,250 growing 1.02, and speed
multipliers 1.05^generationLevel ×1.01^instinctLevel before other factors.
F8 reports a tooltip showing both tracks and total. READ was not performed
on decoded game code this run. This is strong source-audit evidence for
keeping temporary practice and persistent gains visible, not a browser
usability result.

**F7, STATED:** Melvor's report traces ordinary active/passive ticks through
catch-up with an audited default 24-hour processing cap. ITRTG's report
has challenge-specific offline admission. Ani Idle's report found no
catch-up reconciliation in its audited source. Offline gain is a mechanic
that needs its own evidence, not a consequence of being called idle.

| Proposal | Pacing/display consequence | Source or reasoning |
|---|---|---|
| D1 Show next useful change | A next verb, recipe or safe task is more informative than another zero | READ YAIR milestone/name machinery; analysis, no usability experiment |
| D2 Show two clocks/ledgers when relevant | Current-life XP and carried understanding remain intelligible after reset | STATED Increlution, MoL, Regressor's Tale; retention mechanisms differ |
| D3 Compress large values without merging fields | Use2690 or2.69k with exact detail, named rarity and tier beside it; scientific notation only when needed | READ ANC status separates groups; display choice is a proposal |
| D4 Keep breakthrough readiness apart from passive XP | Offline work may build reserves; a decision/ritual need not complete merely because time elapsed | STATED Cradle/LotM gates; world-specific completion policy required |
| D5 State estimate assumptions | Estimate time from actual action rate, resources and interruption risk; show no ETA when rate or gate is unknown | Analysis; no new pacing defaults selected |

Analysis: for geometric XP threshold costs b·q^L and an otherwise constant
XP rate, each successive threshold costs q times as much time. Increasing
rate can offset this, so expensive XP does not prove slow observed growth.
Offline integration must consume supplies, respect fatigue/availability,
and stop or pause when the chosen world's existing mechanics require it.
This is a fidelity consideration, not a newly accepted global restriction.
No fixed target levels/hour or prestige retention policy is selected here.

## Catalog scan and rough genre frequencies

**READ of local catalog metadata, STATED for all fictional claims.**
Input: [catalog.tsv](../novels/royal-road-2026-10-10/catalog.tsv), read only.
SHA256 `a1f59603831fc4f9e9b0c789bde6e3d09e884368adf8e1495a3be652800486c6`.
This run saw 1530 rows and1530 unique IDs. All blurb fields were nonempty,
but 42 contained `Last read:` and account reading-position fragments.
Conservatively excluding those rows leaves 1,488 candidate blurbs. No
reading positions are reproduced in the report. The earlier unread audit
used 1,543 catalog entries. This run does not assume why that count changed.

All 1,488 blurbs were scanned programmatically, not manually read in full.
Numeric/cap/color and selected letter matches were inspected. Counts below
are literal **marketing-signal frequencies**, not prevalence of actual
S shapes. Categories overlap. Absence of a signal does not establish
absence of a system. Polarity and irrelevant mentions can affect counts. English regexes also
under-detect other languages and differently punctuated labels.

| Blurb signal | Hits /1,488 | Percent | Interpretation limit |
|---|---|---|---|
| Level vocabulary |115|7.73%|Does not establish cap or power spacing |
| Explicit cap wording |3|0.20%|Personal or unspecified cap; not necessarily100 |
| Realm/cultivation vocabulary |175|11.76%|Realm can mean a place, not a progression stage |
| Grade/tier/rank vocabulary |89|5.98%|May grade an item, status or institution |
| Explicit letter bands |14|0.94%|Conservative syntax; not a complete S6 count |
| Metal/color next to rank/tier/core/grade |3|0.20%|Misses prose naming a color ladder indirectly |
| Reset/rebirth/reincarnation vocabulary |88|5.91%|Reincarnation is not automatically repeatable prestige |
| Explicit uncapped wording |0|0.00%|S4 rarity cannot be inferred from this zero |
| Numeric level literal |17|1.14%|Often starting level 1; one example counts a world level |
| No-system wording |6|0.40%|No System does not imply no cultivation ladder |

Tag-conditioned frequencies use exact semicolon-separated tags. Tag groups
overlap; each column counts the same keyword family within its group.

| Tag | Eligible blurbs | Level signal | Realm/cultivation signal | Grade/tier/rank signal |
|---|---|---|---|---|
| LitRPG |657|98 (14.92%)|74 (11.26%)|50 (7.61%)|
| Cultivation |228|12 (5.26%)|113 (49.56%)|22 (9.65%)|
| Progression |832|83 (9.98%)|123 (14.78%)|63 (7.57%)|
| GameLit |304|36 (11.84%)|25 (8.22%)|17 (5.59%)|
| Super Heroes |82|2 (2.44%)|7 (8.54%)|4 (4.88%)|

Analysis: cultivation blurbs advertise realm language more often than
numeric levels in this harvested pool. LitRPG blurbs advertise numeric
levels more often than the Super Heroes group. The catalog is curated
from multiple lists and personal selections, not a random Royal Road
sample. No confidence interval or genre-wide S1-S20 percentage is justified.
Caps, true exponential power, S8 countdowns, S11 percentiles and S13 nesting
need chapter/source reads; these blurbs cannot estimate them reliably.

| Selected STATED blurb example | Signal and limit |
|---|---|
|98283 You Have Died Again|Personal cap 50, advertised as mediocre. Companion audit also calls100 the world maximum but reports a boss134→135. Preserve the inconsistency; scope may differ for adventurers/bosses, not checked here |
|159525 Goth Mommy, Bone Daddy|Says max level reached; number not supplied |
|196780 I Was Given the Unremarkable Path|Already-hit cap; blurb does not establish cap value |
|122963 The Solitary Berserker's Return|786 returnee versus strongest hunter122. Local comparative scale, not evidence786 is a universal god threshold |
|184773 Level 999: The Glitch King|999 framed as impossible designation. No confirmed ordinary cap |
|192995 Dungeon Day One|87 near ordinary human peak plus A-rank. Two fields, not a proved linear mapping |
|95097 The Lone Wanderer|Lowest Red core; color ladder signal. Higher colors not all established by blurb |
|197035 Ascendant Warrior|SSS-grade mastery; item/skill/body labels must remain distinct |

Genre knowledge below is **MEMORY**, qualitative and unverified. It is
included as requested background, not counted in catalog results.

| Genre | Recalled common scale pattern | Frequency limitation |
|---|---|---|
|Tabletop|Finite small character ranges with discrete feature gates; skill-only systems also exist|Cannot generalize D&D20 to all tabletop |
|MMOs/RuneScape-likes|Capped levels, gear/skill tracks and expansion-era ceilings|Published versions can change; no census |
|Idle/incremental|Compounding values, reset layers, currencies and logarithmic display|Not all games are uncapped or have prestige |
|Manhwa dungeon/hunter stories|Letter-graded institutions beside exceptional private leveling|Often selected for the exceptional protagonist, not representative population |
|Xianxia|Named realms, substages, resource bottlenecks, changes in cosmic scope|Realm count and hard-gap strength vary |
|Roguelikes|Build and encounter means dominate raw level; temporary run progression|Permanent meta-progression is game-specific |

### Reproduction recipe

Run read-only Python from repository root. No output file or download is
needed. The conservative letter expression deliberately avoids matching
ordinary prose such as “a class.” Manual review remains necessary.

```python
import csv, re
from pathlib import Path
rows = list(csv.DictReader(Path(
    'docs/research/novels/royal-road-2026-10-10/catalog.tsv'
).open(), delimiter='\t'))
rows = [r for r in rows if not re.search(r'Last read:', r['blurb'], re.I)]
patterns = {
    'level': r'\blevel(?:s|ling|ing)?\b',
    'cap': r'\b(?:level cap|level ceiling|max(?:imum)? level|capped at|cap of|cap is|level limit)\b',
    'realm': r'\b(?:realm(?:s)?|cultivation|cultivator(?:s)?)\b',
    'grade': r'\b(?:tier(?:s)?|grade(?:s)?|rank(?:s|ed|ing)?)\b',
    'letters': r'\b(?:SSS(?:[- ](?:grade|rank|tier|class))?|SS[- ](?:grade|rank|tier|class)|[A-FS]-(?:rank|tier|class|grade))\b|\bS rank\b',
    'color': r'\b(?:iron|bronze|silver|gold|diamond|red|orange|green|blue|violet)[- ](?:rank|tier|core|grade)\b',
    'reset': r'\b(?:prestige|rebirth|reincarnat(?:e|ed|ion)|reset(?:s|ting)?)\b',
    'uncapped': r'\b(?:uncapped|no level cap|no cap|unlimited levels|infinite levels|limitless levels)\b',
    'numeric': r'\blevel(?:s)?\s*(?:[:=]|of)?\s*[0-9][0-9,]*\b',
    'systemless': r'\b(?:no system|without (?:a |the )?system|systemless)\b',
}
for name, pattern in patterns.items():
    n = sum(bool(re.search(pattern, r['blurb'], re.I)) for r in rows)
    print(name, n, round(100*n/len(rows), 2))
for tag in ['LitRPG', 'Cultivation', 'Progression', 'GameLit', 'Super Heroes']:
    group = [r for r in rows if tag in r['tags'].split(';')]
    print(tag, len(group), {k: sum(bool(re.search(patterns[k], r['blurb'], re.I))
                              for r in group) for k in ['level', 'realm', 'grade']})
```

## YAIR implementation considerations, read only

**F8, READ:** `Skill` constructor defaults `max_level=60`,
`base_xp_cost=40`, `xp_scaling=1.8`; scaling≤1 is replaced by1.6.
`add_xp` computes geometric cumulative XP, clamps displayed level to
`max_level`, and sets max-state text/Infinity. Total XP continues to
accumulate when unlocked and levelable even after reaching max, though
there is no further displayed level. It computes a pre-clamp level and
unlocks, so making enormous caps or huge XP grants cheap is not a purely
visual edit. The while loop's cost and pre-clamp unlock semantics need
review before any cap expansion.
[Constructor and progression](../../../src/models/skill.js).

**F9, READ/analysis:** `get_coefficient` uses either
1+(M−1)·L/max_level (flat) or M^(L/max_level) (multiplicative), rounded.
`get_level_bonus` also divides by `max_level`. Raising 60 to 1,000 at
unchanged saved level 20 and M=2 changes the ideal coefficient from
2^(20/60)≈1.260 to2^(20/1000)≈1.014. These calculations are analysis of
the source formula, not a game test. A cap change can therefore weaken
existing saves despite increasing the eventual maximum. Definitions and
callers can add other bonuses; this is not total character damage.

| Consideration | Concrete consequence | Status |
|---|---|---|
| A1 Preserve native skill semantics | Per-skill cap edits need compatibility review of bonus normalization, milestones, saved XP and names | Proposal, no edit authorized |
| A2 Separate foreign fields | Soul/race tier, rarity, rank, mastery, population reading and office should not all be stuffed into native skill level | Proposal based on N1/N4/N7/N10 |
| A3 Keep source identity on display | Show field and means of appraisal; unknown foreign number is not zero | Proposal follows accepted means principle |
| A4 Validate numerical scale before adopting S4 | Geometric powers/loops, JS finite precision, Infinity and export/import behavior need an explicit numeric model; no bigint migration chosen | READ source risk plus proposal; persistence code not audited |
| A5 Select one future playable slice only after acceptance | A threshold-name/milestone comparison could test display without changing 60 cap; numerical/cross-world policies await director choice | Candidate, not started |

No build, browser or save verification was run because COMMON forbids
implementation in this packet. This report supplies research evidence,
not implemented-unverified gameplay or a new gameplay acceptance claim.

### Input fingerprints

Read-only source fingerprints at report validation:

| Input | SHA256 |
|---|---|
| SKILLS_AND_TALENTS.md | `2e8e3090803e8b493e0c61339eef8d257b1bedbd74764921cef86a4f1318e0bf` |
| src/models/skill.js | `efa7050dd81d4aefba26db70ba044e7b73313a56fb7535616e90087555834dd8` |
| src/data/skills.js | `8edce9a32137c3432f2bd2953908c84f7e8ed3f676018dababef2b193463a671` |
| READ_HISTORY_AUDIT.md | `b43b92e493984b34c87f73380ca9897b2e8daf3d36207e5ebc4b625ac6c761a0` |
| UNREAD_AUDIT.md | `f9535016814bc05ac725a88e470f3d5173a627b1940f1071f49488435afa0ba8` |

## Verification and limitations

The catalog count/filter/regex results were produced by read-only Python.
The embedded reproduction recipe was executed and matched all reported
counts and tag subtotals. All local Markdown links outside code blocks
resolved. Formula examples were recalculated; no em dashes were present.
Source references use existing local notes and the small original ANC
windows listed above. Public browsing was limited to official D&D,
Disgaea and Jagex material to check disputed small/large/era caps. No
novel-site fetch, account action, harvest modification or raw download
occurred. Publisher claims are STATED; rule text and local code are READ.
No verbatim novel quotations are reproduced. No sealed YAIR secret truth
is included.

Unknown caps, distributions, protagonists' final ranks, precise growth
rates and cross-world conversion rules remain unknown where evidence
was insufficient. MEMORY rows deliberately stay weak. The audit is
complete within the requested local-first survey scope; it is not a
full-book or full-franchise mechanics certification.

## CHECKPOINT

Identity: C2 research worker, 2026-10-10, revision2, complete.
Objective: audit and extend S1-S14 within the assigned report only.
Done: rules/current owners/companion audits; 11 novel dossiers and bounded
full-book notes; ten relevant wiki digests; ten game/model entries;
original ANC text windows; official cap checks; catalog metadata and
filtered genre counts; six C2-local scale proposals; OP, conversion,
pacing, display and vanilla model considerations.
In progress: none.
Remaining task work: none. Source limitations are explicitly recorded,
not implied completed reads. Merge/acceptance of proposals belongs to
Weibao and the coordinating owner; no shared owner edit is authorized.
Ownership: this report only; no delegates or write handoffs.
Budget: no numeric token/time budget specified in packet or COMMON.
Inputs: catalog SHA256 above; source/dossier fingerprints may drift
under other sessions. Recompute counts if catalog changes.
Resume: integrator reviews proposals against live framework, retaining
C2 suffixes until assigning merged codes. Do not start implementation
or download novels from this checkpoint.
