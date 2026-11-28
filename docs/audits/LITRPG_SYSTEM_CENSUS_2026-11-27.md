# LitRPG census: subtle system rules by book, classified against OOPS

Generated 2026-11-27 for Weibao's "foundation first, worlds later" direction. Paths below are relative to the repo root.

**Classes.** (a) already covered by an existing OOPS law that has code in `src/`; (b) a data row on an existing law; (c) needs a new shared mechanism (SM codes, defined under Shared mechanisms below).
**Confidence.** `stated` = the reading record says it; `implied` = inferred from a record; `secondary` = wiki digest or project research doc, not a reading; `bg` = model background knowledge, unverified against held text (kept separate, never counted as evidence in the mechanism ranking).
**Caveat on (a).** A law was called covered only after finding its module in `src/`. Modules with one importer or none are flagged in the Owner column. Several accepted laws are Working Default or Proposal under AD56, so (a) means "built", not "player-proven".

## Initial survey totals (before campaign adoption)

| Class | Rules |
|---|---|
| (a) covered | 53 |
| (b) data row | 164 |
| (c) new shared mechanism | 37 |
| Total | 254 |

| Book | a | b | c | Basis |
|---|---|---|---|---|
| Azarinth Healer | 10 | 34 | 8 | Private readings (book 1 only, extracted records), 52 rules via a sonnet distillation of 402 records. |
| Beneath the Dragoneye Moons | 10 | 56 | 11 | Private readings (book 1 only, shards to about zh chapter 50), 77 rules via a sonnet distillation of 350 records. |
| Mother of Learning | 24 | 37 | 4 | Private readings (all 106 chapters + epilogue), 65 rules distilled from the truncated record dump plus the wiki digest and the SERIES.json row. Not a System book (no levels, XP or notifications); included for loop and persistence mechanics. |
| The Wandering Inn | 4 | 14 | 4 | No reading on disk (index files with paragraph counts only). Rules come from the revision-backed wiki digest (secondary), the research dossier (one verified chapter) and project docs. |
| Dungeon Crawler Carl | 0 | 17 | 4 | No reading on disk. Rules come from the wiki digest (secondary, revision-backed addenda) and project docs; two rows are model background knowledge and labelled bg. |
| He Who Fights with Monsters | 2 | 2 | 3 | No reading on disk. The wiki digest is blocked (HTTP 403), so rules come from the western SERIES row (secondary) and one lead. |
| The Primal Hunter | 2 | 1 | 3 | No reading on disk. Rows come from project research docs only; one bg row. |
| Chrysalis | 1 | 2 | 0 | No reading on disk. Rows come from project research docs only; rules are named but unaudited. |
| Tree of Aeons | 0 | 1 | 0 | No reading on disk. One research-doc row. |

Books with no rows at the initial census (Randidly Ghosthound, Millennial Mage, Threadbare, Cinnamon Bun, Path of Ascension, Menocht Loop) are listed in GAPS.md. The initial survey counted three background leads. Located campaign records now support the narrower claims in DCbg1, DCbg2 and PHbg1. The identifiers are retained for citation stability.

## Rules by book

### Azarinth Healer

Private readings (book 1 only, extracted records), 52 rules via a sonnet distillation of 402 records.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| AZ5 | STATS | Six attributes. Each class level-up awards five free stat points, allocated manually by the player (Ilea mostly picks Wisdom, Intelligence, Vitality, sometimes Strength/Dexterity). | rule.level-stat-points ch69; custom.class-level-rewards ch43 p76; ability.statistics ch7 p10,p89 (zh ch labels) | stated | c | none; no point pool in src/ | SM1 |
| AZ6 | STATS | Stats begin at assigned base values; Endurance, Strength and Dexterity also rise automatically when the character proves them past those bases (a recalculation notice, e.g. Endurance +3). | rule.endurance-recalculation ch2 p6; rule.strength-dexterity-recalculation ch2 p107 (zh ch labels) | stated | b | SPR23 derive-then-store · src/body_progression.js |  |
| AZ7 | STATS | Stat effects are class-dependent and uneven: Intelligence raises damage of many skills, Wisdom feeds mana-driven abilities, Vitality adds health, Endurance and Wisdom shorten rest between fights. | custom.stat-effects ch8 p57,p91; ability.statistics ch7 p11; skill-progression ch7 p127 (zh ch labels) | stated | b | ABR4 world owns numbers · src/ability_records.js rows |  |
| AZ8 | STATS | Evolving a class also grants a flat stat bundle (Fire Enhancer: Vit+5/Str+5/Dex+5/Int+10/Wis+10; Ash Wielder larger) plus percentage bonuses to class skills. | custom.fire-enhancer ch18 p127; custom.ash-wielder ch40 p33,p38 (zh ch labels) | stated | b | PRG1 stage grants on a path row · src/progression_path.js |  |
| AZ9 | RESOURCE | Three pools: health, stamina, mana. Mana is spent per ability use or per second for sustained skills; fighting drains it until the user stops to Meditate; stamina can reach critical even when mana is siphoned. | ability.destruction ch3; ability.azarinth-reversal ch44 p13; rule.guardian-clearance ch54 (zh ch labels) | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| AZ10 | RESOURCE | Meditation (learned after two days of repeated tries) refills mana quickly and can substitute for sleep for days, but the user cannot move. | ability.meditation ch3 p136; ability.sleep-and-meditation ch30; rule.meditation ch54 (zh ch labels) | stated | b | needs and rest rows · src/needs.js, SLR12 |  |
| AZ11 | LEVEL_TRIGGER | Levels belong to classes (and skills) rather than one character level. A kill grants class XP and skill XP; level-ups appear as notices right after the kill, often several at once. | custom.combat-rewards ch7 p64; custom.level-progression ch35 p26-27 (zh ch labels) | stated | c | native hero level and skill XP exist (YAIR base) but no per-role level ladder | SM4 |
| AZ12 | XP_RULES | Killing something far above your level grants bonus XP based on the level gap. Different scenes state thresholds of 10, 30, 40, 50, 75, 100, 120-140 and 200, so it behaves as a graded scale rather than one fixed number. | custom.defeat-rewards ch4 p91; custom.level-reward-system ch38 p72; rule.bonus-experience-50/80 ch40; custom.bonus-experience ch42 (zh ch labels) | stated | c | no level-gap term anywhere in src/ | SM2 |
| AZ13 | XP_RULES | Fighting solo against much higher-level foes gives the most skill XP. A group dilutes personal gains (solo said to be theoretically five times a group of five) but can still win more kills overall. | rule.skill-growth ch10 p11-13; custom.skill-progression ch15 p4 (zh ch labels) | stated (ratio unsure) | c | no kill-credit or share rule in src/ (party_battle.js has stances only) | SM3 |
| AZ14 | XP_RULES | Group kills still pay bonus XP to each member when the target is far above them, and the stated gap threshold for a group is lower than for a solo killer. | custom.level-and-defeat-rewards ch50; custom.level-progression ch56 p47,p124 (zh ch labels) | stated | c | as AZ13 | SM3 |
| AZ15 | XP_RULES | Rewards shrink with familiarity and a narrowing level gap; repeated kills of the same enemy type give fewer levels, apparently exponentially. | custom.level-advancement ch44 p8 (zh ch labels) | implied | c | as AZ12 (familiarity decay needs a per-enemy-kind counter) | SM2 |
| AZ16 | XP_RULES | Skills level through use but much slower than through kills. Healing during combat still counts as combat XP; merely dodging a target without killing it gives little. | custom.skill-progression ch6 p82; rule.skill-growth ch10 p11; custom.skill-practice-on-monsters ch58 (zh ch labels) | stated | a | SLR5/SLR34 use-based skill XP · src/models/skill.js, src/gameplay_transactions.js |  |
| AZ17 | LEVEL_TRIGGER | Skill advancement can itself push a class up a level, so levels do not come only from kills. | custom.level-advancement ch44 p91; custom.body-enhancement ch3 p125 (zh ch labels) | stated | b | PRG4 tracks accrue from skill levels · src/progression_path.js |  |
| AZ18 | LEVEL_TRIGGER | Past roughly level 200, levelling gets much harder; one cited rule of thumb says a 199-to-201 gap matters more than 99-to-101. | rule.level-progression ch54 (zh ch labels) | stated (hearsay) | b | GTR30 thresholds scale with facts |  |
| AZ19 | SKILL_ACQ | Skills are earned by doing: Identify appears at level 1 on first sight of a monster; Meditation from repeated attempts; Pain Tolerance from prolonged self-burning; poison resistance from surviving poison. | ability.identify ch1 p127; ability.poison-resistance ch3 p250; ability.pain-tolerance ch16 p5 (zh ch labels) | stated | a | SLR4/SLR5/SLR25, ABR10 · src/skills.js, src/models/skill.js |  |
| AZ20 | SKILL_ACQ | Resistance skills (heat, water, wind, ice, crystal, arcane, lightning, curse, mental, fear) are earned by sustained exposure. They appear at level 1, then climb quickly with continued hits. | resistance-training ch42; ice/crystal-resistance ch58; curse-resistance ch60; mental-resistance ch22 p44 (zh ch labels) | stated | a | AD51 adaptation seam · src/adaptation_ledger.js (1 importer) |  |
| AZ21 | SKILL_ACQ | Class skills are chosen from an offered list. Normally five active and five passive slots; when full, the player must replace an existing skill or decline the new one. | rule.class-skill-slots ch10 p36; rule.ash-wielder-skill-changes ch40 p65-66; ability.hunters-sight ch67 p90 (zh ch labels) | stated | c | no active/passive slot cap in src/ (loadouts.js is equipment) | SM5 |
| AZ22 | SKILL_ACQ | Some skills are picked from a class's available list once a class level is reached (Heat Surge at Fire Enhancer 50, Body Heat Manipulation). A resistance may not appear if the class already grants the skill. | spell.heat-surge ch23 p128; custom.fire-enhancer ch23 p118; custom.fire-mage ch18 p44 (zh ch labels) | stated | b | EV2 offer rows with requirements · src/data/skill_evolutions.js |  |
| AZ23 | SKILL_ACQ | Special skill-books (fire magic) are bought, read once, and dissolve within a week, blocking resale; four books took about six hours. | document.fire-magic-book ch17 p86,p98 (zh ch labels) | stated | b | KNW16 text is an item · src/book_care_*.js, docs/MAKING_RULES |  |
| AZ24 | SKILL_ACQ | Training and expensive elixirs can speed skill growth, but elixirs are very rare and reserved for exceptional students. | ability.skill-progression ch7 p16; rule.elixirs ch10 p11 (zh ch labels) | stated | b | ECR price row + item row |  |
| AZ25 | SKILL_ACQ | Blink: willed teleport whose destination follows intent; mana cost per use falls with skill level; it will not place the user inside a solid. | ability.blink ch3 p192-213; rule.blink-use ch32 (zh ch labels) | stated | b | ABR12/ABR14 ability record · src/ability_records.js |  |
| AZ26 | TIERS | A skill that reaches level 20 and levels again enters its second tier: changed slightly and stronger. Second-tier progress is painfully slow compared with newer skills. | custom.skill-tier ch6 p86; custom.azarinth-skill-progression ch8; custom.fire-mage ch18 p4 (zh ch labels) | stated | a | EV1 named tiers at a skill level · src/skill_evolution.js automaticSkillTiers |  |
| AZ27 | TIERS | Third-tier skills unlock at primary-class level 200, with further third-tier points about every twenty levels afterward. | ability.azarinth-first-hunter ch67 p20; rule.blink-tier-three ch69 (zh ch labels) | stated (hearsay) | b | EV1 row at class level 200 (needs a class level to read) |  |
| AZ28 | LIMIT_COOLDOWN | Tier-three Blink: one touch-set destination, changeable once per six months, reachable once per three days; ordinary blink interval shrinks at second stage. | rule.blink-tier-three ch69 p85-87 (zh ch labels) | stated | b | ABR15 limit adjective, long horizon · src/ability_records.js |  |
| AZ29 | LIMIT_COOLDOWN | Azarinth Perception's second stage gives a two-second heightened state only when a blow would cost 75 percent of health, once per hour. | ability.azarinth-perception ch38 p47-48 (zh ch labels) | stated | b | ABR15 limit adjective · src/ability_records.js |  |
| AZ30 | SKILL_ACQ | Some skills have prerequisite combinations: Azarinth Perception needs class level 50 plus five second-tier class skills; Azarinth Reversal needs class level 100 plus two core skills at second-tier level 15. | ability.azarinth-perception ch16 p75; ability.azarinth-reversal ch38 p84 (zh ch labels) | stated | a | GTR1/GTR9 · src/rules.js evaluateRule, src/progression_gates.js (all/any over several skill levels; EV4 constituents) |  |
| AZ31 | EVOLUTION_FUSION | Class evolution is offered when a level milestone and earlier achievements are met. Class levels carry over; skills may be kept or reshaped for the new class. | custom.class-evolution ch6 p86; custom.class-progression ch14 p102-104 (zh ch labels) | stated | b | EV6 path evolution, later slice; one Village row exists · src/data/skill_evolutions.js village.patrol-path |  |
| AZ32 | EVOLUTION_FUSION | Fire Mage to Fire Enhancer: needs Fire Manipulation 10+ and being wreathed in fire for over ten minutes; costs severe pain and exhaustion; replaces the old class without losing skills or stats. | custom.fire-enhancer ch18 p94-124 (zh ch labels) | stated | b | EV6 row; carry per asset class GTR28 |  |
| AZ33 | EVOLUTION_FUSION | Fire Enhancer to Ash Wielder (also offered: Pyro Enhancer): class level 100+, three second-stage body-enhancement skills, mostly fist fighting, and repeated near-death in the preceding week. The old fire-magic bonus is lost. | custom.ash-wielder ch40 p20-66; custom.pyro-enhancer ch40 (zh ch labels) | stated | b | EV6 row; GTR34 opening can consume or exclude |  |
| AZ34 | EVOLUTION_FUSION | Taking one evolution can lock out other evolutions and skills, and the notice says so. Rare evolutions (First Hunter) need conditions met by level 200. | custom.ash-wielder ch40 p22; ability.azarinth-first-hunter ch67 p24,p59 (zh ch labels) | stated | a | GTR34 + EV2 pick-one-of-several (declined forms stay declined) |  |
| AZ35 | EVOLUTION_FUSION | Skills transform in place on class evolution (Body of Flame to Form of Ember, Heat Surge to Ash Surge, Fire Manipulation to Ash and Ember Manipulation); new class skills are then offered. No skill-to-skill fusion seen. | rule.ash-wielder-skill-changes ch40 p43-58 (zh ch labels) | stated | b | EV2 takes over the same skill row and XP; trigger comes from EV6 (later slice) |  |
| AZ36 | CLASS | A person holds up to two classes. A second class appears once its requirements are met, and slot limits can block more. | custom.class-system ch6 p81; custom.fire-mage ch18 p24,p29 (zh ch labels) | stated | c | no concurrent role stack; ASC/PRG hold one path per holder | SM4 |
| AZ37 | CLASS | Class unlock difficulty varies: some people unlock a class in a day, others need weeks or years. Fire Mage needed basic fire understanding and 30+ seconds of shaping mana into fire. | custom.fire-mage ch15 p17, ch18 p24 (zh ch labels) | stated | b | GTR1 gate row per class |  |
| AZ38 | CLASS | Class choice is open (unrelated pairs and two magic schools allowed, though complementary pairs are common); an order may require at least one healer class. | rule.class-selection ch10 p22; rule.healing-order-class-policy ch10 (zh ch labels) | stated | b | GTR1 gate rows; WKR11 ladder shape dial |  |
| AZ39 | CLASS | Azarinth Healer awakening: eat Bluemoon Grass and drink chamber fountain water. The first change causes severe pain and grants the class, bonuses and listed skills; later eating does not repeat it. | custom.azarinth-healer ch3 p56-62; item.bluemoon-grass ch3; rite.bluemoon-grass-ingestion ch2 (zh ch labels) | stated | b | GTR14 risky crossing · src/breakthrough_trial.js |  |
| AZ40 | DEATH | The grass kills about 35 percent of those who eat it (poor body compatibility). No resurrection, XP-loss or death-penalty rules appear. | rule.bluemoon-grass-toxicity ch2; custom.bluemoon-grass-use ch8 (zh ch labels) | stated | b | BHR death causes · src/defeat_domain.js (G25 death causes) |  |
| AZ41 | LOOT_REWARD | Killing a dungeon guardian opens treasure-room access in addition to XP; expeditions also pay a per-guardian bounty. | custom.defeat-rewards ch4 p91; rule.guardian-payment ch54 (zh ch labels) | stated | b | rewards row · src/rewards.js, src/dojo_tower.js |  |
| AZ44 | AUTHORITY | Adventurers' Guild rank is gated by level: Bronze 10, Silver 30, Gold 50, Crystal 75, Ruby 100; above Ruby needs approval; a qualifying fight lets one join above their level; two 100+ adventurers can vouch for a level range. | institution.adventurers-guild ch10-11 p98-100; institution.guild-badge-vouching ch44 (zh ch labels) | stated | b | GTR25 credentials are institution records · src/faction_rank.js |  |
| AZ45 | AUTHORITY | Raw level also gates city gates (50+), the tournament (both classes 50-100) and the Azarinth Order (recruits only at 200). | law.city-gate-level-access ch34; event.riverwatch-tournament ch12; organization.azarinth ch65 p119 (zh ch labels) | stated | b | GTR1 gate rows on place and law |  |
| AZ46 | CRAFT | Drake scales and bone improve armor; better hide gives better quality; repairs on distinctive gear are priced steeply. No System-driven crafting levels seen. | craft.armor-manufacturing ch10; rule.drake-armor-construction ch26 (zh ch labels) | stated | a | MR rules (MAKING_RULES) · src/craft_state.js |  |
| AZ47 | LOOT_REWARD | A bound storage item (necklace/ring) holds 250 capacity units; stacks count as one unit; storing and summoning cost mana. | item.storage-necklace ch48; custom.necklace-storage ch50; rule.storage-item ch69 (zh ch labels) | stated | b | ITM storage item row; ABR14 cost per use |  |
| AZ48 | LIMIT_COOLDOWN | Toggle skills (Pain Tolerance second stage, Magic Perception, Heat Perception) can be switched on or off at will; suppressed pain returns at full strength when re-enabled. | ability.pain-tolerance ch18 p114; ability.pain-perception ch22; ability.magic-perception ch3 (zh ch labels) | stated | b | ABR15 toggle limit · src/active_effects.js |  |
| AZ49 | OTHER | Curses are rare. They impair healing and mana regeneration, fade in about a day, and surviving one can teach Curse Resistance. | custom.curse ch60 p10; ability.curse-resistance ch60; ch72 p24-27 (zh ch labels) | stated | b | affliction rows · src/affliction_catalogue.js |  |
| AZ50 | DUNGEON_ZONE | Ruin dungeon structure: trap rooms, pressure plates, mana-opened doors, guardians that adapt to repeated tactics. The dungeon persists after its largest monster dies. | custom.taleen-traps ch46; rule.pedestal-guardian-room ch40; place.calys-mine ch71 (zh ch labels) | stated | b | SR site rules · src/dojo_tower.js, src/authored_site.js |  |
| AZ51 | AFFINITY | Class-flavoured affinity: fire classes cast fire faster and regenerate mana near fire; Ash Wielder bonuses apply when unarmed. No elemental-affinity stat system appears. | custom.fire-enhancer ch18 p132; ability.eyes-of-ash/body-of-ash ch40 (zh ch labels) | stated | b | elemental affinity rows · src/absorb_e3/elemental_affinities.js |  |
| AZ52 | LEVEL_TRIGGER | Level is only a rough strength gauge: a high-level skill can let a low-level person hurt a much higher one, though that is unlikely. | custom.level-combat ch6 (zh ch labels) | stated | a | GTR2/AD38 mechanism not label |  |

### Beneath the Dragoneye Moons

Private readings (book 1 only, shards to about zh chapter 50), 77 rules via a sonnet distillation of 350 records.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| BD1 | OTHER | Elaine is reincarnated by the god-figure Papilion, who offers plain reincarnation or reincarnation with partial memories; she picks partial, so her memory has gaps. | bdm.event.reincarnation bdmc035 zh35 p13; bdm.rule.reincarnation-memory-choice bdmc001 | stated | b | KNW21 past-life knowledge is memory; WER carry · src/carry_ledger.js |  |
| BD2 | DEATH | Memory retention is capped by a newborn's head size and by "dangerous knowledge"; some memories fade or weaken during gestation with no stated selection rule. | bdm.rule.memory-fading bdmc001; bdm.event.reincarnation bdmc035 | stated | b | KNW19/SLR37 memory loss removes understanding · src/carry_ledger.js |  |
| BD3 | OTHER | The System names the newborn's species and name on rebirth (Human, Elaine). | bdm.rule.reincarnation-memory-choice bdmc001 | stated | b | WKR15 diegetic system voice |  |
| BD5 | LEVEL_TRIGGER | A newborn's System is locked behind a visible countdown (about 68,820 hours at birth, roughly eight years) and unlocks at the exact birth anniversary, not earlier. Humans share one timer; monsters seem to differ. | bdm.rule.system-lock-countdown bdmc001 zh1 p60; bdm.custom.system-lock bdmc007; bdm.institution.system bdmc003 | stated | b | GTR31 gate with a clock; WKR13 schedules |  |
| BD6 | AUTHORITY | System Day is a weekly temple session, attended once per life, for children within a week of unlocking; a priest introduces stats and risks. It marks the end of childhood. | bdm.rule.system-day bdmc001 zh2 p11-12; bdm.event.system-day bdmc003 zh4 p20-72 | stated | b | GTR31/WKR13 scheduled ceremony as a world event |  |
| BD7 | STATS | Improper trait/stat allocation can be fatal, a warning given at System Day. | bdm.institution.system bdmc003 (limits) | stated | c | allocation with a lethal misallocation path; no point pool exists | SM1 |
| BD8 | STATS | Four physical stats (Strength, Dexterity, Vitality, Speed) come in complementary pairs; each allocated point costs ongoing Mana Regeneration. | bdm.ability.strength/dexterity/vitality/speed bdmc003 | stated | c | allocation with upkeep cost paid out of another stat | SM1 |
| BD9 | STATS | High Speed without Vitality outpaces the body's perception; Strength and Dexterity pull against each other. | bdm.ability.speed, bdm.ability.strength bdmc003 | stated | b | ABR15 limits as adjectives; stat interaction rows |  |
| BD10 | STATS | Magic stats: Mana (the pool), Mana Regeneration, Magic Power (stronger skill output, can use more mana), Magic Control (finer, more detailed skill use). Power and Control trade off in class gains. | bdm.ability.mana/magic-power/magic-control/magic-stats bdmc003 | stated | b | ABR4 world owns numbers (stat definitions) |  |
| BD11 | STATS | Natural stats are minor, cost no mana and cannot be directly controlled. Class stats come from classes and levelling. | bdm.ability.magic-stats bdmc003 | stated | b | SPR23 derive-then-store · src/body_progression.js |  |
| BD12 | STATS | Free stat points are allocated by the player. An adult advises leaving physical stats unspent while a child grows, since natural gains arrive anyway; a 9/9 versus 8/10 Power/Control split matters for class options. | bdm.institution.system bdmc015 zh16 p21,32,39; bdm.custom.free-stat-allocation bdmc023 | stated | c | free points, banking and unspent state | SM1 |
| BD13 | STATS | Training a stat naturally is an alternative to spending points, at the cost of main-class growth time. | bdm.institution.system bdmc017 zh18 p1 | stated | b | SLR4 gains have causes; training route · src/body_progression.js |  |
| BD14 | AFFINITY | Elements form four opposed pairs (Fire/Water, Earth/Wind, Light/Dark, Wood/Metal), each pair tied to a stat pair; every level in an element-aligned class gives one point in the matching stat. | bdm.custom.fire bdmc005 zh5 p6-10 | stated | b | elemental affinity rows · src/absorb_e3/elemental_affinities.js |  |
| BD15 | AFFINITY | Each person gets two class elements; any element can pair with any class, though some pairings fit better. Lyra is Wood; Elaine's classes run Water, then Light/Dark. | bdm.rule.class-elements bdmc013; bdm.custom.fire bdmc005; bdm.custom.system-class-progression bdmc007 | stated | b | elemental affinity rows + class pairing data |  |
| BD16 | AFFINITY | Mage schools differ in practical power: Fire is power-focused and lacks stopping force; Water is flexible but modest; Wind is weak and mana-hungry; Dark removes or destroys; Earth/Metal is war-grade; Wood is risky; Light does not hurt or stop threats. | bdm.rule.fire/water/wind/dark/wood/light-magic, earth-metal-war-magic bdmc013 | stated (Artemis's opinion) | b | ABR4 data rows |  |
| BD17 | AFFINITY | Healing is element-flavoured: Light speeds healing and can restore limbs at very high levels; Dark destroys poison and rotten tissue; Wood heals via medicines; Water imitates the others less efficiently. Scar-free results can need both Light and Dark healers. | bdm.rule.light/dark/wood/water-healing bdmc013; bdm.custom.dark-healer bdmc015 | stated | b | ABR4 data rows (healing flavours) |  |
| BD18 | AFFINITY | Skills that remove or create matter draw from and return to a separate realm; stopping a summoned effect makes it vanish. | bdm.custom.power-focus bdmc039 zh40 p100-111 | stated | b | ABR14 cost follows the world's mechanism |  |
| BD19 | CLASS | The System automatically assigns a starter class at unlock (Child of Remus is common, Child of Pallos rarer; Elaine's is Child of Earth). Starter-class levels depend on what the child did before. | bdm.institution.system bdmc005 zh5 p25; bdm.ability.child-of-earth bdmc009 | stated | b | PRG1 starting stage row, chosen by earlier deeds |  |
| BD20 | CLASS | At level 8 the character can pick a new class; non-starter classes always present a choice. Offers depend partly on skills held, how they were used, and skill levels. | bdm.institution.system bdmc005 zh5 p25-27 | stated | c | offer event at a level with prerequisites; no role stack to receive it | SM4 |
| BD21 | CLASS | A class advances only along its own chain; a Divine Priestess cannot be picked directly and needs a precursor such as Apprentice Divine Priestess. | bdm.custom.system-class-progression bdmc007 zh8 p59 | stated | b | EV6 chain of precursor rows |  |
| BD22 | CLASS | Class-up is a ritual-like event: the user focuses, the mind goes to a "library of the soul", reads class books, picks one and checks it out with the Librarian. Waking applies it. | bdm.institution.system bdmc017 zh18 p10-63; bdmc049 zh50 p27-79 | stated | b | kernel working with ordered steps · src/kernel_working.js |  |
| BD23 | LIMIT_COOLDOWN | Once a class advancement starts a choice must be made, and the body is helpless for several hours afterward. Theft or disappearance in that window is rare but possible. | bdm.institution.system bdmc047 zh47-48 p58, p80 | stated | b | CBR queued outcomes / helpless window · src/kernel_working.js step durations |  |
| BD24 | TIERS | Class evolutions arrive at levels 8, 32, 64, then 128 and 256; 128 and 256 raise stats gained per level. A second class unlocked at level 64; the third class slot stays locked. | bdm.custom.class-progression bdmc019 zh20 p6; bdm.institution.system bdmc047, bdmc049 | stated | b | GTR30 thresholds scale with facts (doubling per stage) |  |
| BD25 | CLASS | A class has eight skill slots and a second class inherits the first's skills until they are replaced. Eight general skill slots exist separately. | bdm.institution.system bdmc005 zh5 p27; bdmc021; bdmc009 | stated | c | second role inherits the first role's skills until replaced; slot caps per role and general | SM5 |
| BD26 | CLASS | A full class change can send the person back to level 8 under a new initial class (Elaine's two classes are rebuilt as Constellation of the Healer and Firebug). | bdm.institution.system bdmc049 zh50 p103 | stated | c | full role change resets to a starting level under a new initial role | SM4 |
| BD27 | CLASS | Class offers are conditional on stats, achievements and deeds, e.g. Splendid Medic needs Light of Hope, Mana Regeneration 500 and healing people who wish the healer harm. Offers list per-level stat packages. | bdm.ability.splendid-medic-light, picture-of-health-mirror, viridescent-druid-verdant bdmc049 | stated | b | GTR1 offer rows with deed-based requirements · src/data/skill_evolutions.js shape |  |
| BD28 | CLASS | Offers can be deed-based or comic: a gluttony class, a fire-rescue class for diving into a fire, a Breaker of Chains class (16 free stats per level) for escaping captivity. | bdm.ability.glutton-of-virinum-light, fire-rescuer-light, breaker-of-chains-wind bdmc049 | stated | b | GTR1 offer rows (deed-triggered) |  |
| BD29 | CLASS | Early offers list requirements: a healer class needs Medicine or First Aid 8 plus two magic skills 10+; Runner needs Running 8 and Speed 10; Student needs Learning 8; Apprentice Mage needs all magic stats 10. | bdm.custom.apprentice-control-power-healer, runner, student, apprentice-mage-earth bdmc017 | stated | b | GTR1 offer rows with skill-level requirements |  |
| BD30 | CLASS | An oath-style offer (Oathbound Healer) requires faithfully keeping the oath; Elaine fears it costs freedom of choice. | bdm.ability.oathbound-healer-brilliance bdmc049 | stated (concern implied) | b | vow rows · src/vow_rules.js |  |
| BD31 | CLASS | "Foundation of the Hospital" is shown as nearly met but not selectable, so the class book display can show near-misses. | bdm.ability.foundation-of-the-hospital-arcanite bdmc049 | implied | b | GTR15 show progress toward a gate |  |
| BD32 | CLASS | Mage classes need Conjuration or Manipulation of an element plus Meditate; a Ranger-Mage offer needs Ranger Lore 10, which Elaine lacks. | bdm.rule.mage-qualification, mage-meditate-requirement bdmc013; bdm.ability.ranger-mage bdmc049 | stated | b | GTR1 offer rows |  |
| BD33 | CLASS | Parents often pick the child's class after unlock; Elaine calls forced picks usually poor. | bdm.custom.seamstress bdmc017 | stated (opinion) | b | TIE relationship rules (a parent chooses for a child) |  |
| BD34 | SKILL_ACQ | Skills are unlocked by doing: Dodging after dodging a wagon, Poisoning after a poison kill, Cowering under threat of death, Coppersmithing at a forge, Lost and Found from tracking items. | bdm.ability.dodging bdmc009; poisoning bdmc017 zh18 p68; cowering, coppersmithing bdmc011; lost-and-found bdmc021 | stated | a | SLR4/SLR5/SLR25, ABR10 · src/skills.js, src/models/skill.js |  |
| BD35 | SKILL_ACQ | Skills can also be chosen: focus on a skill and think of selecting it. Elaine took Identify this way at level 1. | bdm.institution.system bdmc009 zh9 p102-103 | stated | b | EV offer events; chosen-by-focus acquisition row |  |
| BD36 | LIMIT_COOLDOWN | Only eight general skill slots; a full roster forces a swap (Elaine declined Secrets, lost Cleaning when replacing). Dropped-and-retaken skills restart at level 1. | bdm.institution.system, bdm.ability.secrets (zh10 p36), bdm.ability.cleaning bdmc009 | stated | c | skill slot cap with swap cost (dropped skill relearned from level 1) | SM5 |
| BD37 | SKILL_ACQ | Skills may be learned from parents or picked up by activity (crafts-district rounds gave Carpentry, Tanning, Pottery, Fishing, Knots, Tailoring). | bdm.ability.learning bdmc005; bdmc011 | stated | a | SLR4/SLR5/SLR25, ABR10 · src/skills.js, src/models/skill.js (SLR35 real work is repetition) |  |
| BD38 | SKILL_ACQ | Class skills unlock at level thresholds (e.g. 10, 15, 20, 25, 30 for a healer class); a moderately strong skill is usually available around level 100. | bdm.ability.minor-general-healing-boost, flash, centered-mind, light, invigorate bdmc017; bdm.custom.skill-milestones bdmc021 zh21 p87 | stated | b | PRG1 stage grants at levels |  |
| BD39 | EVOLUTION_FUSION | A System merge offer folds Anatomy and First Aid into Medicine and says nothing is lost; acceptance is not shown, but Medicine later levels past 100. | bdm.ability.medicine bdmc017 zh18 p13; bdmc035; bdmc047 | stated (offer), implied (accepted) | a | EV4/EV5 fusion and consolidation offers, lossless (Badge of Vice Medicine case) · src/skill_evolution.js combinesSkills |  |
| BD40 | EVOLUTION_FUSION | At level 100 a skill-replacement prompt makes Elaine drop a class skill (Boost Local Regen) for Detailed Restoration. | bdm.ability.detailed-restoration bdmc025 zh26 p50 | stated | b | EV2 replacement choice row |  |
| BD41 | SKILL_ACQ | Oaths can be taken as a general skill with a warning prompt: a healing oath gives +5% knowledge/power/control per level while kept. | bdm.ability.oath-of-elaine-to-lyra bdmc019 zh19 p23-25 | stated | b | vow rules · src/vow_rules.js |  |
| BD42 | SKILL_ACQ | Ranger's Lore is granted on Ranger induction, merges marching/digging/survival/fighting, and lasts only while she is a Ranger. | bdm.ability.rangers-lore bdmc047 zh47 p56 | stated | b | PRG grants that end with the role (GTR13 gates can close again) |  |
| BD43 | SKILL_RARITY | No rarity grades appear. Skills are ranked only by numeric level; skill level is capped by highest class level, and early levels come easier than later. | bdm.institution.system bdmc009 | stated | b | EV3 grade dial left unused; numeric level only |  |
| BD44 | XP_RULES | Class experience comes from class-aligned work (cooks cook, fishers fish); most classes level fastest by fighting and killing. Killing hostile monsters gives a lot; out-of-class activity gives less. | bdm.rule.class-experience bdmc013 zh14 p46-48; bdm.institution.system bdmc005 zh5 p24 | stated | b | PRG4 tracks accrue by class-aligned activity |  |
| BD45 | XP_RULES | Experience scales with danger, difficulty, effort and perceived difficulty; safe easy repeats yield almost nothing; a fight can pay out even a minor participant. | bdm.custom.class-experience bdmc023 zh23 p30; bdm.rule.class-experience bdmc013 | stated (Elaine's theory) | c | reward scales with danger, effort and perceived difficulty | SM2 |
| BD46 | XP_RULES | Skill levels rise during heavy, high-stress, complex use; suggested causes are stress, novel knowledge, complexity, and nearness to the next level; none are confirmed. | bdm.rule.skill-leveling-observed bdmc029; bdm.institution.system bdmc037 zh37 p60-61; bdmc027 | implied | b | SLR5/SLR32 insight draws seeded |  |
| BD47 | XP_RULES | Mental review can raise a skill (Anatomy); mimicking general skills through practice may or may not grant them. | bdm.rule.anatomy-learning bdmc013; bdm.rule.general-skill-mimicry bdmc029 | implied | b | SLR5 new information grows understanding |  |
| BD48 | XP_RULES | Bonded human-beast partners share experience in both directions. | bdm.custom.beast-tamer bdmc039 zh40 p40 | stated | c | bonded partner pair shares XP in both directions | SM3 |
| BD49 | LEVEL_TRIGGER | Class level-ups grant class stat, "Human" free stat and elemental stat bumps, shown in notifications; exact thresholds are never given. | bdm.institution.system-level-notifications bdmc019 zh20 p26; bdm.institution.system-level-ups bdmc041 zh42 p77 | stated | c | level-up pays several kinds of free and bound points | SM1 |
| BD50 | STATS | Starter class stat budgets differ: Child of Earth gives 3 free points per level, Child of Pallos 2; at levels 2-8 each level also gave 1 Human point and 1 Magic Control. A first tier-up typically has at most 24 free points. | bdm.ability.child-of-earth bdmc009; bdm.custom.child-of-pallos bdmc015 zh16 p48-50 | stated | c | per-role point budget per level | SM1 |
| BD51 | LOOT_REWARD | A passive reward line: the System credits a +1 all-stats and +2% experience bonus to a named parent's efforts (Herculix). | bdm.rule.herculix-system-bonus bdmc001 zh1 p61 | stated | b | typed bonus with a named source (bonus_stacking) ; TIE |  |
| BD58 | RESOURCE | Mana is a pool that fuels skills; a skill cannot run without enough, more mana permits more concurrent skills, and costs are normally shown to the user. Skills cost flat or per-minute mana, or drain regeneration. | bdm.ability.mana bdmc003; bdm.ability.identify, cleaning bdmc009; bdm.ability.knives | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| BD59 | RESOURCE | Ranger's Lore has a heavy upkeep: 512 mana per hour. | bdm.ability.rangers-lore bdmc047 zh47 p56 | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| BD60 | RESOURCE | A mana pool can run nearly dry (4/20 after running) and Elaine's mana ran empty during a rescue. Arcanite stones in armor or a knife supply extra mana for a fight. | bdm.rule.running-progression bdmc013; bdm.item.arcanite bdmc033; bdm.custom.arcanite-armor bdmc045 | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| BD61 | RESOURCE | A treated gem can store one skill; Elaine stored Greater Invigorate in a Light-treated diamond, and using it yields mana. | bdm.custom.skill-gem-storage bdmc023 zh23 p7-21 | stated | b | ABR17 items and devices carry abilities through custody |  |
| BD62 | RESOURCE | Accelerated healing spends the patient's own body resources, so speeding up a near-fatal burn is risky. | bdm.law.healing-uses-body-resources bdmc025 zh25 p27 | stated | b | BHR rules (healing spends the patient) |  |
| BD63 | LIMIT_COOLDOWN | Healing has hard ceilings: lost-limb restoration needs very high levels; blood loss, heavy-metal poison and many diseases were beyond Elaine at the time. | bdm.rule.light-healing bdmc013; bdm.ability.medicine bdmc037 zh38 p110-125 | stated | a | ABR15 limits as adjectives |  |
| BD64 | LIMIT_COOLDOWN | Some skills only work on matching material (Coppersmithing on copper; Remove Tissue fails against bamboo); Guardsman's Buff can only be ended by the caster. | bdm.ability.coppersmithing bdmc011; bdm.ability.remove-tissue bdmc033; bdm.ability.guardsmans-buff bdmc011 | stated | a | ABR12/ABR15 |  |
| BD65 | MONSTER_EVO | Wind weasels and goblins coordinate hit-and-run attacks; at the same level a human is stronger than a goblin but weaker than most dinosaurs, since base bodies differ. | bdm.creature.wind-weasel bdmc011; bdm.creature.human bdmc039 | stated | b | AGT/CBR creature behaviour rows |  |
| BD66 | MONSTER_EVO | Bonded human-beast pairs (e.g. a ranger and a dinosaur) last decades and use bright coloration to signal "tame". A Monster Tamer (Small) class offer exists. No Dragoneye-style bond mechanic appears. | bdm.custom.beast-tamer bdmc039 zh40 p40-53; bdm.ability.monster-tamer-small bdmc049 | stated | b | companion rows · src/companion_roster.js |  |
| BD67 | CRAFT | Inscriptionists and engravers enchant objects (night-moving reins, soundproofed wagon, armor); enchantments need re-upping; materials and methods are unspecified. | bdm.custom.inscriptionist bdmc027; bdm.custom.inscriptions bdmc037; bdm.spell.soundproofing-enchantment bdmc041 | stated | a | MR rules (enchanting)  |  |
| BD68 | CRAFT | Potions: Strength/Speed (brief), Stamina, blood-restoring, sleeping (addictive risk). Healers keep stamina potions as a mana-free backup. | bdm.potion.* bdmc045 | stated | a | MR rules (potions)  |  |
| BD69 | AUTHORITY | Women in the Republic cannot own property, inherit or become citizens; they may marry a citizen for near-equal status, and men get profession skills while women choose skills. | bdm.organization.republic bdmc009; bdm.law.gender-citizenship bdmc003 | stated | b | standing and law rows per society (STN, SMK) |  |
| BD70 | AUTHORITY | The family patriarch holds power of life and death over the household; marrying at 14 is normal and parents arrange matches. | bdm.custom.family-patriarchal-authority, marriage-age bdmc021; bdm.rule.arranged-marriage bdmc029 | stated | b | standing/household rows |  |
| BD71 | AUTHORITY | Debt slavery: unpaid fines can be worked off by temporary slavery; people can also sell themselves and later buy out. Slaveholders claim life-and-death power. | bdm.custom.slave bdmc011; bdm.rule.slavery-and-debt, slave-ownership bdmc013 | stated | b | obligations_ledger rows · src/obligations_ledger.js |  |
| BD72 | AUTHORITY | Fines scale by offence (breeding monsters low, attacking guards higher); gate guards demand mage mana discharge on entry, and Rangers discharge before entering towns. | bdm.law.monster-breeding-and-assault bdmc011; bdm.organization.guards bdmc003; bdm.custom.ranger-mana-discharge bdmc019 | stated | b | law rows reading a visible power signature (gate check) |  |
| BD73 | AUTHORITY | Rangers are a government-backed institution (travel in pairs, team rotation, badge authority, no free commandeering, free Army healing). Sentinels work alone as a fallback. | bdm.organization.rangers bdmc011; bdm.custom.ranger-* bdmc023, bdmc045; bdm.institution.sentinels bdmc039 | stated | b | GTR25 credential held by an institution · src/faction_rank.js |  |
| BD74 | AUTHORITY | Children below physical-stat thresholds are kept off fast street lanes; the check is a social rule, not a System one. | bdm.custom.street-zones bdmc003 | stated | b | social gate rule (STN) |  |
| BD75 | AUTHORITY | Healing pricing is social: healers charge by experience; Elaine heals for whatever patients can pay, or trades for reading lessons. | bdm.custom.healer-prices bdmc021; bdm.custom.healing-payment bdmc019 | stated | b | ECR price rule per healer |  |
| BD76 | DUNGEON_ZONE | Soul-library time flows at an arbitrary, unexplained rate relative to the waking world. | bdm.place.library bdmc049 | stated | b | TMR time rules; place-local clock |  |
| BD77 | LIMIT_COOLDOWN | Aura skills carry a social cost to switch off: people react with negative attention if Elaine turns hers off. | bdm.custom.aura-social-expectation bdmc019 zh20 | stated | b | KNW/STN: toggling a visible aura has social cost |  |

### Mother of Learning

Private readings (all 106 chapters + epilogue), 65 rules distilled from the truncated record dump plus the wiki digest and the SERIES.json row. Not a System book (no levels, XP or notifications); included for loop and persistence mechanics.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| ML1 | LOOP_RESET | The world restarts to the start of the month; the trigger is the protagonist's death (cause implied, no mechanism shown). | reset.month-restart c005; reset.restart c013 | implied | a | GTR28, loop table · src/loop_table.js, src/harm_restart_scope.js, src/mol_zorian_loop.js |  |
| ML2 | LOOP_RESET | An iteration cannot exceed one month, and many hidden contingencies end it early; the list is withheld from the protagonist. | reset.iteration-cap c055 | stated | a | GTR28, loop table · src/loop_table.js, src/harm_restart_scope.js, src/mol_zorian_loop.js |  |
| ML3 | LOOP_RESET | When an iteration ends, everything in it is destroyed except what the Controller and marked persons carry. | reset.iteration-cap c055 | stated | a | GTR28, loop table · src/loop_table.js, src/harm_restart_scope.js, src/mol_zorian_loop.js |  |
| ML4 | LOOP_RESET | The Controller has a restart switch in a soul marker and can end an iteration on command, returning to the month start. | reset.marker-restart c055; reset.revert-switch c047; reset.marker-restart-switch c083 | stated | a | GTR28, loop table · src/loop_table.js, src/harm_restart_scope.js, src/mol_zorian_loop.js |  |
| ML5 | LOOP_RESET | The marker is nearly impossible to detect or remove; a soul-altering procedure on a bearer triggers a safety restart. | reset.revert-switch c047; reset.marker-safety c075 | stated | b | loop_table row; safety-restart condition |  |
| ML6 | LOOP_RESET | The loop has a finite power budget spent per iteration, not per day; one stated figure was 52 iterations left. | law.power-budget c055 | stated | c | no finite restart counter in loop_table.js | SM11 |
| ML7 | LOOP_RESET | There is one Controller marker per loop; it cannot be invoked inside the loop, and marking someone new before activation voids the old marker. | rule.controller-marker c055 | stated | b | loop_table row: one marker per loop |  |
| ML8 | LOOP_RESET | A looper can exit through the Guardian of the Threshold and then restarts at the month start; a single-exit rule stops others leaving once the Controller has left. | reset.loop-exit c054; law.single-exit c054; reset.time-loop-exit c092 | stated | a | GTR28, loop table · src/loop_table.js, src/harm_restart_scope.js, src/mol_zorian_loop.js |  |
| ML9 | LOOP_RESET | Only the Controller has a real soul in the loop; everyone else is a copy. Copies reach the real world only if the Guardian does not intervene. | law.copy-original-souls c055; law.loop-exit-guardian c057 | stated | b | being_record.js real versus copy flag |  |
| ML10 | PERSISTENCE | Memory, skill and ability persist across restarts for the Controller; the world, other bodies and physical stock reset. | reset.* c013/c055; digest E8 table; SERIES mol.C1 | stated | a | GTR28/SLR20-22 · src/carry_ledger.js |  |
| ML11 | PERSISTENCE | Practiced skill carries over; not all body gains do. | SERIES mol growth/persistence axes; ability.raw-mana-manipulation c050 | secondary | a | GTR28/SLR20-22 · src/carry_ledger.js |  |
| ML12 | PERSISTENCE | Notes do not survive a restart unless carried; a note-transfer alteration spell carries them, once mastered, including other people's notes. | spell.note-transfer-alteration c040; craft.spell-formula-design c041; other.alteration-note-transfer c048 | stated | a | GTR28/SLR20-22 · src/carry_ledger.js |  |
| ML13 | PERSISTENCE | Whole notebooks can be held in the mind, capped by free mind space; a later memory bank gives near-unlimited loop-only storage that dies if the loop collapses. | ability.mind-carried-notebooks c059; ability.memory-bank c073; other.notebook-transfer c078 | stated | a | GTR28/SLR20-22 · src/carry_ledger.js |  |
| ML14 | PERSISTENCE | Temporary markers extend persistence to others: a lesser marker lasts six iterations, a temporary one about six months or six restarts; revoked, it keeps memory and magic only to the next restart. | ability.lesser-marker c055; rite.temporary-marker c086; other.temporary-marker c076; rite.temporary-looper-conferral c105 | stated | b | loop_table carry rows per holder with duration |  |
| ML15 | PERSISTENCE | Permanent looper status needs a death pact plus a lich-held soul seed; it is a rare, costly grant. | rite.permanent-looper-conversion c105 | stated | b | loop_table row; vow_rules.js pact |  |
| ML16 | PERSISTENCE | The Controller can expel someone from the loop; targets then start each iteration soulless and dead, and only the maker can undo it. | ability.expulsion c055 | stated | b | loop_table row |  |
| ML17 | PERSISTENCE | Soul damage survives bodily renewal and blocks all casting for at least three months (four to five if strained). | other.soul-damage-effects c084; SERIES mol.C1 | stated | b | BHR9-style loss names its layer; soul damage block |  |
| ML18 | MEMORY | Memory packets carry memories to a reborn person in a later restart; they decay, repairs damage them, and the maker repairs far more easily than anyone else. | rite.memory-packet c018; craft.memory-packet c039; craft.memory-packet-repair c047; ability.memory-packet-repair c044 | stated | b | KNW20 knowledge crosses only with a carrier |  |
| ML19 | MEMORY | Repairs extend a packet by roughly two to three months, with a hard cap on repair count. | craft.matriarch-packet-repair c048; craft.memory-packet-repair c047 | stated | b | KNW rules; repair count dial |  |
| ML20 | MEMORY | A mind holds only about 15 stored blueprints; a large packet takes most of that room. | spell.blueprint-recording c039 | stated | b | KNW26 organised memory; capacity dial |  |
| ML21 | MEMORY | Memory reading is unreliable: strong-willed non-psychics resist, victims notice, amateur deep probes can ruin a mind. | ability.deep-memory-scan c037; ability.memory-probe c039 | stated | b | KNW11/SLR38 reading memories is appraisal through means |  |
| ML22 | MEMORY | Memory editing works; small edits are quick (under a minute), physical records have anti-tampering, staff minds are often unprotected. | ability.mindwipe c078; ability.memory-editing c090; craft.royal-seal-forgery c061 | stated | b | KNW11 deception writes wrong beliefs |  |
| ML23 | SKILL_ACQ | Spells are learned from teachers and repositories behind certification; the library keeps restricted spells behind levels and permission slips. | law.library-access c002; law.spell-repository-access c008; law.library-spell-restriction c007 | stated | a | SLR14-SLR16 lessons · src/book_world_mol_access.js |  |
| ML24 | SKILL_ACQ | Teaching can be bought: tuition in artifacts and money; memory manipulation is taught only after the elders probe the student's whole memory; rival-trained or over-competent students may be refused. | custom.luminous-tuition c037; custom.teacher-refusal c045; custom.tutoring-exclusivity c047 | stated | a | SLR14-SLR16 lessons · src/book_world_mol_access.js |  |
| ML25 | SKILL_ACQ | Spell formulas on a focus item (rod, staff, ring) make casting quicker; combat spells are taught only with such aids; a ring's capacity scales with its base item. | craft.spell-formula c002; craft.spell-formula-ring c009 | stated | b | ABR17 focus item carries a formula |  |
| ML26 | SKILL_ACQ | A stabilisation formula must be made per spell to lengthen it; formulas are studied from blank cubes, copying line by line is barred. | craft.stabilization-formula c011; craft.beginners-cube c011 | stated | b | MR rules + SLR16 lessons are transactions |  |
| ML27 | SKILL_ACQ | Repeat-run optimisation: designs must be rebuilt from memory each restart unless notebooks carry over, so prep is redone fast and traps are pre-planned. | craft.spell-formula-design c041; craft.explosive-cube c018 | implied | a | SLR14-SLR16 lessons · src/book_world_mol_access.js |  |
| ML28 | MASTERY | Shaping (mana control) is trained separately from reserve size; raw mana sensing and shaping exercises cumulatively shorten learning time for every spell. | ability.raw-mana-manipulation c050; ability.mana-perception c051; digest E8 | stated | a | SLR1/SLR5 |  |
| ML29 | MASTERY | A healthy foundation is required before advanced study; one teacher runs a demanding first-months course and a practice card that burns on mana input. | ability.shaping-training c039; craft.practice-card c024; custom.xvim-demanding-mentorship c048 | stated | a | SLR1/SLR5 |  |
| ML30 | MASTERY | Some precision is slow: stone-hurling accuracy took others decades; soul awareness has a safe slow method and a faster dangerous one. | ability.stone-hurling c060; ability.soul-awareness c059 | stated | a | SLR1/SLR5 |  |
| ML31 | MASTERY | Structured spells use formula; unstructured mind magic comes from years of shaping exercises and not everyone reaches it. | ability.unstructured-mind-magic c042; ability.touch-sight-lock-trick c009 | stated | a | SLR1/SLR5 |  |
| ML32 | MASTERY | Spells carry circle ranks (first, third seen); higher circles need far more mana and certification; lowering a circle has political cost. | institution.spell-circle-rating c015; spell.fireball c004; institution.mage-certification c010 | stated | b | GTR25 certification rank held by the academy · src/book_world_mol_access.js |  |
| ML33 | RESOURCE | Magic needs mana; reserves grow with age and practice; an average mage fires about 8 to 12 magic missiles per reserve, gifted 20 to 30. | law.no-mana-no-magic c001; other.mana-reserve-limits c008 | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| ML34 | RESOURCE | Reserve cap is usually at most about four times the starting size; artificial growth is faster but permanently ruins shaping. | other.mana-reserve-limits c008; other.reserve-growth-methods c022 | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| ML35 | RESOURCE | Ambient mana refills reserves; academies sit on mana wells; crystallised mana is sellable and gathered across restarts. | other.ambient-mana-replenish c001; other.crystal-gathering c056 | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| ML36 | RESOURCE | A divine blessing doubles maximum reserves without harming shaping; rare and hard to detect. | ability.divine-blessing c081 | stated | a | ABR14/ABR15 · src/ability_records.js |  |
| ML37 | RESOURCE | Anchoring a spell to the reserve permanently removes that mana from the caster. | rite.mana-reserve-anchor c089 | stated | b | ABR14 permanent cost row |  |
| ML38 | RESOURCE | Simulacra draw on shared mana reserves and one soul, so they add bodies not pool. | spell.haste c063; ability.simulacrum-soul-link c073; SERIES mol.C1 | stated | c | copies of one person sharing one reserve and one soul; no such body model | SM12 |
| ML39 | RESOURCE | Simulacrum limits: a self-imposed 24-hour life rule; the original cannot fully supervise copies; golem-body versions last longer at material cost. | custom.simulacrum-24-hour-rule c064; spell.simulacrum-golem-body c074; rite.demon-summoning c102 | stated | c | as ML38 (copy lifetime rule and golem option) | SM12 |
| ML40 | RESOURCE | A unified-viewpoint method binds simulacra into one perspective, but only when they do broadly the same task. | ability.hydra-method c089; ability.mind-fusion c101 | stated | c | as ML38 (single viewpoint over copies) | SM12 |
| ML41 | RESOURCE | Alchemy, golems and enchanting consume expensive ingredients; money gates serious study; some ingredients are time-gated (23-year moth). | craft.alchemy c007; potion.soul-perception c016; craft.golem-making c029 | stated | b | ECR/ITM ingredient costs |  |
| ML42 | DEATH | Death restarts the month; no mana or skill penalty to the Controller is recorded (absence, not a ruling); soul damage and marker safety are the lasting costs. | reset.self-death c075; reset.marker-safety c075; other.soul-damage-effects c084 | implied | a | loop restart scope · src/harm_restart_scope.js |  |
| ML43 | DEATH | A death pact binds a soul to a deadline; dying near the mansion feeds the Well of Souls. | rite.death-pact c090; other.soul-well c048 | stated | b | vow_rules.js death pact; BHR |  |
| ML44 | SOUL | Soul awareness training costs life force cumulatively over a restart (fatigue, appetite, cramps); big symptoms fade in hours, small ones linger. | ability.soul-awareness-training c062; ability.soul-awareness c059 | stated | b | BHR rows; PRG tracks |  |
| ML45 | SOUL | Soul-form possession needs a prepared spell and destabilises mana reserves for days afterward. | spell.soul-form c091; rite.soul-possession c092; ability.tunneler-toad-anchor c092 | stated | b | BHR rows; PRG tracks |  |
| ML46 | SOUL | Altering a soul beyond recognition blocks reincarnation; protection rituals need willing targets and long setup. | rite.soul-alteration c004; rite.soul-protection c032 | stated | b | BHR rows; PRG tracks |  |
| ML47 | WARD_COUNTER | A mind ward blocks all mind-related effects, including mind-based communication; mind magic is largely illegal. | spell.mind-ward c013; law.mind-affecting-magic c025 | stated | b | ABR15 limits; counters as data (area_field_law.js) |  |
| ML48 | WARD_COUNTER | A ward need cover only what it was built against; structured wards miss mechanical or unstructured tricks, and physical sound bypasses a mind ward (digest lead). | institution.academy-warding c009; ability.touch-sight-lock-trick c009; digest E8 table | stated (digest part secondary) | b | ABR15 limits; counters as data (area_field_law.js) |  |
| ML49 | WARD_COUNTER | Mind shells are costly and collapse under strain; shield bypass works only on a busy or unaware target, brute force can damage. | ability.mind-shell c036; ability.psychic-shield-breaking c023 | stated | b | ABR15 limits; counters as data (area_field_law.js) |  |
| ML50 | WARD_COUNTER | Wards are removed by siphoning (control and time), breaking (fast, costly) or bypassing (needs knowledge of the structure). | craft.siphoning, craft.breaking, craft.bypassing c030 | stated | b | ABR15 limits; counters as data (area_field_law.js) |  |
| ML51 | WARD_COUNTER | An anchored ward resists dispel; unanchored ones fall to wide dispel; a divination ward fails against someone who already knows the site. | spell.ward-against-teleportation c056; spell.anti-teleport-ward c060; spell.scrying-mirror c024 | stated | b | ABR15 limits; counters as data (area_field_law.js) |  |
| ML52 | DIVINATION | Divination needs a readable medium; forecasts reach a few days, vary on repetition and go blank past highly disruptive events. | craft.divination-thread-medium c009; craft.future-forecasting c019 | stated | b | cast divination adapter · src/cast_divination_adapter.js |  |
| ML53 | DIVINATION | Messages can be traced by divination, anti-trace precautions can fail against skilled diviners. | craft.untraceable-letters c005; other.divination-wards c035 | stated | b | cast divination adapter · src/cast_divination_adapter.js |  |
| ML54 | DIVINATION | Marker tracking gives only distance and direction, one target at a time, and soul-magic users detect it. | ability.key-tracking-marker c083; rite.marker-tracking c032 | stated | b | cast divination adapter · src/cast_divination_adapter.js |  |
| ML55 | CONTRACT | An angelic contract sets goals (stop the invasion, keep the loop secret, avoid certain kills), cannot be renegotiated or removed, and kills the bound person at month end on breach. | law.angelic-contract c096; rite.angelic-contract c106 | stated | b | vow_rules.js contract with enforcement keyed on knowledge (KNW) |  |
| ML56 | CONTRACT | Enforcement keys on the bound person's own perception: the disclosure clause triggers only on what he knowingly states; anonymous notes without stated origin are allowed. | law.time-loop-knowledge-clause c098; SERIES mol.C2 | stated | b | vow rules + KNW (what the bound person knowingly states) |  |
| ML57 | CONTRACT | A geas binds to the soul (character belief); apprenticeship contracts can be signed without real binding. | spell.geas c007; institution.apprenticeship-contract c045 | stated | b | vow_rules.js geas row |  |
| ML58 | AUTHORITY | Magic is regulated: a badge is needed to trade, restricted spells need permits, animation on people is controlled, lethal combat spells cannot be sold. | custom.mage-badge-pickup c001; law.unlocking-spells-restricted c009; law.lethal-combat-spells c032 | stated | b | STN regulation rows; GTR25 permit records |  |
| ML59 | INSTITUTION | Academy: mentors are assigned, not chosen; certification exam at end of year two; tiered groups; few scholarships; enrolment at month start. | institution.mentor-assignment c014; institution.certification c002; institution.academy-enrollment c093 | stated | a | GTR25/GTR26 · src/book_world_mol_access.js, book_world_mol_access_domain.js |  |
| ML60 | INSTITUTION | Library access scales with circle and authorisation: first-circle certification opens closed parts; restricted sections need explicit authorisation. | custom.circle-library-access c001; institution.library-semi-apprenticeship c012 | stated | a | GTR25 · src/book_world_mol_access.js |  |
| ML61 | LIMIT | Summoning is impossible inside the loop; gods are silent, so divine magic is limited to angels' leftover artifacts. | law.time-loop-summoning-block c022; law.divine-magic-limit c096 | stated | b | ABR15 limits as adjectives |  |
| ML62 | LIMIT | Black rooms give heavy time dilation but isolate the user from outside experts and books; limited uses per month. | other.black-rooms c059; institution.black-rooms c009 | stated | b | ABR15 limits as adjectives |  |
| ML65 | OTHER | Competence is separate from loop authorisation: study gives skill, markers or artifacts give loop powers. | SERIES mol row grader/gate | secondary | a | SLR19 rank and competence are separate facts |  |

### The Wandering Inn

No reading on disk (index files with paragraph counts only). Rules come from the revision-backed wiki digest (secondary), the research dossier (one verified chapter) and project docs.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| TW1 | LEVEL_TRIGGER | A level can take effect before its announcement, which arrives later (at sleep); some classes and bodies follow different notice rules. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W01 (wiki r128402) | secondary | b | EV5 offerOn rest + SLR26 away-time recap · src/data/skill_evolutions.js, src/skill_evolution_native.js |  |
| TW2 | EVOLUTION_FUSION | After classes consolidate, work in one part advances the whole; maid work can advance a merged combat path. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W02; docs/RESEARCH_LITRPG_SYSTEMS.md joined skill cases (Goblin Days pt 4, verified there) | secondary+verified in research doc | a | EV5 consolidation · src/skill_evolution.js combinesSkills, village.recovery row |  |
| TW3 | CLASS | A hundred total levels across classes is not a proven ceiling; people exceed it. Thresholds belong to each class. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W03 | secondary | b | GTR30 thresholds scale with facts; PRG4 per-track threshold |  |
| TW4 | SKILL_ACQ | A method performed unaided can later be recognised as a Skill without any level gain (execution first, recognition second). | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W04 | secondary | a | SLR25 hidden and emergent skills surface through use · src/skills.js |  |
| TW5 | SKILL_ACQ | Some joint techniques later work for one contributor; others keep requiring the original team. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W05 | secondary | c | none; composed_moves.js composes parts but not named participants | SM8 |
| TW6 | RESOURCE | Some prank Skills bank the results of antics and spend that credit on stronger effects. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W06 | secondary | b | GTR16 banked overflow; PRG4 tracks accrue |  |
| TW7 | SKILL_ACQ | A ward can receive abilities tied to a designated guardian; the effect depends on that named provider. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W07 | secondary | c | none; ABR17 custody covers items, not a living provider relationship | SM8 |
| TW8 | AUTHORITY | Declared vows can grant Skills outside normal leveling; some monastic benefits deepen with time. Breach penalty not given. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W08 | secondary | b | vow_rules.js (permille bonus while kept; time ramp is a new row field) · src/vow_rules.js |  |
| TW10 | OTHER | Body-changing Skills are called Aspects; one example is a temporary iron-like body. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W10 | secondary | b | body alteration rows · src/body_alteration.js |  |
| TW11 | QUEST | A posted quest needs a known real objective and a guaranteed tangible reward held in custody. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W11 | secondary | b | quest rows + ECR escrow · src/quests.js, src/story_requests.js |  |
| TW12 | OTHER | The system can move experience from one activity category to another and change its multiplier (chess is the example). | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W12 | secondary | c | none; reward routing is fixed per build, no dated law version | SM6 |
| TW13 | SKILL_ACQ | The system distills feats into Skills; the granted copy need not match the original feat. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W13 | secondary | b | SLR25 + ABR9; add a fidelity field on the row |  |
| TW14 | TIERS | A species can finish the trials and still be rejected at the later judgment; knowledge of the trials is suppressed for many. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W14 | secondary | a | GTR10/GTR11 admission is separate from completion; unknown is not unmet |  |
| TW15 | LIMIT_COOLDOWN | Several active artifacts near each other interfere; inactive items in a holding bag do not. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W15 | secondary | c | none; active_effects.js has no proximity aggregation | SM10 |
| TW16 | OTHER | Magic-producing monsters can preserve nearby enchantments, and leaked magic benefits the monsters. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W16 | secondary | b | area_field_law.js place law + ITM durability |  |
| TW17 | CLASS | Horror advancement degrades ordinary classes; sources disagree on whether lost ranks restore levels. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W17 | secondary | b | GTR13/GTR34 path exclusion; conflicting witness rows kept as separate rows |  |
| TW18 | AFFINITY | Magic comes in separate kinds (mana casting, emotion witchcraft, community shamanism, faith miracles) with different fuel and counters. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W18 | secondary | a | ABR14 costs follow the world's mechanism; WKR11 shape dial |  |
| TW19 | CLASS | The first class arrives after ordinary work (cleaning and resting an abandoned inn), not from a creation menu, with two starter skills. | docs/RESEARCH_LITRPG_SYSTEMS.md case A (verified narrative, ch 1.00) | verified in research doc | b | PRG1 stage + BF65 recognition row; GTR (credential after work) |  |
| TW20 | LEVEL_TRIGGER | Level-ups hand over a skill the character did not choose (surprise-grant model). | docs/SKILLS_AND_TALENTS.md G3 | secondary | b | PRG1 stage grants · src/progression_path.js |  |
| TW21 | CLASS | A title can be lost through role mismatch and regained by redefining the role rather than undoing events. | research/power-systems/western/SERIES.json inn.C1 | secondary | b | GTR13 gates close again with a reason; SLR19 |  |

### Dungeon Crawler Carl

No reading on disk. Rules come from the wiki digest (secondary, revision-backed addenda) and project docs; two rows are model background knowledge and labelled bg.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| DC1 | AUTHORITY | Sponsorship fee and auction position do not guarantee aid; ratings drive patronage; a sponsor bid can change later gift-box prices; messaging is one-directional. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md DC1 (wiki r24476) | secondary | c | none; no third-party grant channel in src/ | SM7 |
| DC2 | AUTHORITY | The rule-enforcing AI also exercises reward discretion and can conflict with the show's corporate courts. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md DC2 (wiki r26446) | secondary | b | authority models · src/authority.js, AGT powers that act |  |
| DC3 | RESOURCE | Sleep apparatuses give full rest after two hours (or one minute for the top tier) plus a long rest buff. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Sleep Apparatus, Instacot 60) | secondary | b | needs/rest rows · src/needs.js, BHR |  |
| DC4 | LOOT_REWARD | A shower adds ten percent to base stats and lowers detectability for 30 hours; stacking not specified. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Upgraded Shower) | secondary | b | timed buff · src/active_effects.js; bonus_stacking |  |
| DC5 | LIMIT_COOLDOWN | Three meal cabinets each usable once per day give adaptive options; repeated choices can lock the menu (described as a bug). | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Food Box) | secondary | b | ABR15 per-day limit · src/ability_records.js |  |
| DC6 | LIMIT_COOLDOWN | A shield intercepts by dexterity or intelligence, then reflects 75 percent of the time, then doubles 25 percent of those; rates apply only after the prior step. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Right Back Atcha) | secondary | b | successive conditional events · src/check_contract.js, src/combat_math.js |  |
| DC7 | AUTHORITY | An alien race supplies safe-room attendants by contract in exchange for spared homeworlds; information access is restricted; no breach sanction given. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Bopca) | secondary | b | obligations rows · src/obligations_ledger.js |  |
| DC8 | TITLE_ACHIEVE | Buying a personal space triggers an achievement; the stated reward is the space opening, not a loot prize. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Welcome to the Neighborhood) | secondary | b | achievements.js grant field (no catalog row sets one yet) · src/achievements.js |  |
| DC9 | OTHER | A looted cleaner bot can be moved through inventory, carrier and marketplace loopholes; resale locks the new owner out for thirty days. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Cleaner Bot) | secondary | b | ITM item rows + ECR transfer lockout |  |
| DC10 | DUNGEON_ZONE | A shared-access door network travels to previously used doors on the same floor; guild-wide installation is very expensive. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Doggie Door) | secondary | b | place and travel rows (R3) · src/world_pack.js |  |
| DC11 | DUNGEON_ZONE | Personal space: violence and theft barred inside, access bar refilled by kills, whitelists, price floors, upgrades bound to the purchaser and lost on death. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Personal Space) | secondary | b | SR/PIR site and access rules; ECR property rows |  |
| DC13 | AUTHORITY | Worshipping a sun deity creates a shrine with two recurring obligations: a drop of blood per 30-hour day and five percent of income. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Sun Shrine) | secondary | b | obligations_ledger + vow_rules recurring rows |  |
| DC14 | CRAFT | A holographic coaching room trains Singing, supporting bard spells. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Vocal Coach Training Room) | secondary | b | SLR6 feedback is a means; facility row |  |
| DC15 | LIMIT_COOLDOWN | The basic training room allows one hour a day on one non-magical skill; explosives need the next tier. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Training Room) | secondary | b | SLR29 drill cap names its next route; ABR15 per-day limit |  |
| DC16 | DUNGEON_ZONE | Floors run on a timer, the dungeon is a show for an audience, and viewers supply rewards. | docs/TRIALS_AND_TRIBULATIONS.md:59; SURVEY A2 (recalled, unverified) | secondary | c | floor clocks fit GTR31; audience reward fits SM7; per-floor law change needs SM6 | SM6 |
| DC17 | TITLE_ACHIEVE | A deed grants a title that grants power (achievement hunting). | docs/SKILLS_AND_TALENTS.md G18 | secondary | b | titles.js lifetime counters with small bonuses · src/titles.js |  |
| DC18 | AUTHORITY | The AI rewards odd feats with unusually specific items; patron taste is a visible incentive. | research/power-systems/western/SERIES.json carl.C2 | secondary | b | CHT20 a talking cheat can be wrong/biased; AGT |  |
| DCbg1 | LEVEL_TRIGGER | After choosing a race and class, crawlers receive points to distribute as they level. | dcc.other.stat-points · en b1 c4 p41 | stated | c | as AZ5 | SM1 |
| DCbg2 | LOOT_REWARD | Achievements can issue boxes. A boss reward can depend on the survivor’s remaining health. | dcc.other.reward-box-triggers · en b1 c25 p42 | stated | b | rewards row + item container · src/rewards.js, src/items.js |  |

### He Who Fights with Monsters

No reading on disk. The wiki digest is blocked (HTTP 403), so rules come from the western SERIES row (secondary) and one lead.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| HW1 | TIERS | Three essences form a confluence; each essence has five abilities, one waking at bonding and the rest through stones. | docs/research/power-systems/western/SERIES.json hwfwm (wiki digest blocked: HTTP 403) hwfwm.C1 | secondary | c | none; ABR/EV4 combine skills, not source sets | SM9 |
| HW2 | SKILL_ACQ | Stone and user shape partly random ability outputs (biased draw, not a free pick). | docs/research/power-systems/western/SERIES.json hwfwm (wiki digest blocked: HTTP 403) hwfwm.C1 | secondary | b | saved authored draws, RNG owner I31 · src/cheat_loaded_dice.js seam |  |
| HW3 | AUTHORITY | Divine essences keep a connection to the donor god and can be revoked. | docs/research/power-systems/western/SERIES.json hwfwm (wiki digest blocked: HTTP 403) hwfwm.C1 | secondary | c | none; no standing third-party connection with revocation | SM7 |
| HW4 | LIMIT_COOLDOWN | Confluences are not transferable. | docs/research/power-systems/western/SERIES.json hwfwm (wiki digest blocked: HTTP 403) hwfwm.C1 | secondary | a | CHT5 what backs a cheat decides where it goes; SLR13 |  |
| HW5 | TIERS | Adventurer ranks run iron, bronze, silver, gold, diamond; per-ability thresholds and later transcendence unverified. | docs/research/power-systems/western/SERIES.json hwfwm (wiki digest blocked: HTTP 403) hwfwm.C2 | secondary | b | GTR25/EV3 grade rows |  |
| HW7 | SKILL_ACQ | Ability slots per essence and a donor connection limit builds (lead from earlier lane mapping, not revision-checked). | DIGEST_he-who-fights-with-monsters.md earlier lane mapping | lead | c | as AZ21 | SM5 |

### The Primal Hunter

No reading on disk. Rows come from project research docs only; one bg row.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| PH1 | EVOLUTION_FUSION | Skills evolve with class and race by rarity tier, through understanding. | docs/LIFE_SIM_NORTH_STAR.md:407 | secondary | a | EV3 grade climb · src/skill_evolution.js |  |
| PH2 | EVOLUTION_FUSION | A Rare skill became Epic after a penetrating thrust (chapter 1388 case used as EV3 held-out row). | docs/PROGRESSION_GATE_RULES.md skill evolution proposal | verified by the repo's own source note | a | EV3 · src/data/skill_evolutions.js village.sleeping-grade |  |
| PH3 | LEVEL_TRIGGER | Mixes character level and points (G2), evolution (G5) and comprehension (G8). | docs/SKILLS_AND_TALENTS.md:490,512 | secondary | c | point pool as AZ5; evolution EV3; comprehension SLR5 | SM1 |
| PH4 | DUNGEON_ZONE | An ordinary person enters a bounded, dangerous tutorial after integration; exact selection, rewards and limits not audited. | docs/RESEARCH_GENRE_SWEEP.md:44, T06 | secondary | b | bounded trial/lifecycle phase (WKR13); licensed-trial loop |  |
| PH5 | OTHER | System integration remakes Earth and ties it to a wider multiverse (trope T058). | research/royal-road-2026-10-10/TROPE_ATLAS.md T058; SURVEY #28 | secondary | c | none; no dated in-world law revision event | SM6 |
| PHbg1 | CLASS | Class and profession can each accumulate levels required for one evolution. | ph.other.perfect-evolution · en b12 c66 p51 | stated | c | as AZ36 | SM4 |

### Chrysalis

No reading on disk. Rows come from project research docs only; rules are named but unaudited.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| CH1 | MONSTER_EVO | Reborn as an ant in a dungeon; levels, evolves its body and grows a colony. | docs/RESEARCH_GENRE_SWEEP.md:33; research/nonhuman-fiction-2026-10-10/A_MONSTER_BEAST_HIVE.md M4 | secondary | a | creature_evolution.js kernel routes · src/creature_evolution.js (6 importers) |  |
| CH2 | MONSTER_EVO | Mutation costs, evolution thresholds, biomass arithmetic and colony governance are named as series elements but the exact rules are unaudited. | docs/RESEARCH_GENRE_SWEEP.md:33 | named not audited | b | creature_evolution routes carry typed facts; rows still to author |  |
| CH3 | SKILL_ACQ | Starts with basic body skills such as Bite and Dig. | research/SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md RR28 | secondary | b | acquisition row by body part |  |

### Tree of Aeons

No reading on disk. One research-doc row.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| TA1 | MONSTER_EVO | Reborn as a tree; the series climbs to realm-hopping and institution building (power creep). | research/SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md A1; nonhuman C_PLANT_FUNGUS_NATURE.md | secondary | b | nonhuman body laws · src/being_record.js; WKR11 shape dial |  |

## System voice and surfaces (WKR15 material)

How the in-fiction system looks, sounds and arrives. Kept apart from rules. Every row reads existing stores through a world skin (WKR15, DSG), so none needs a new mechanism by itself; the notification-stream rows (toggle, backlog, batching) are the ones to check against `src/reports_dock.js` when a LitRPG world pack is built.

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| AZ1 | VOICE | The status screen is summoned by thinking one's own full name. It shows six stats (Vitality, Endurance, Strength, Dexterity, Intelligence, Wisdom), health/stamina/mana current and max, and skills. | rule.status-display, ch2 p31; azc003 measure records (zh ch labels) | stated | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js |  |
| AZ2 | VOICE | The System speaks through mental notices: skill learned, class/skill level gained, stat recalculated, evolution offered. They arrive automatically, with no menu needed. | ability.identify ch1 p126-127; rule.endurance-recalculation ch2 p6 (zh ch labels) | stated | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js |  |
| AZ3 | VOICE | An evolution offer is a notice listing the new class, its stat grants, and a warning that other evolutions/skills may become unavailable; the character accepts to confirm. | custom.ash-wielder ch40 p22; ability.azarinth-first-hunter ch67 p24 (zh ch labels) | stated | a | EV2 offer event (defer or decline, quote of what is kept or lost) · src/skill_evolution_native.js |  |
| AZ4 | VOICE | Displayed ability bonuses are shown as combined percentages "after bonuses" (stacked class and aura multipliers), not just the base value. | custom.body-of-flame ch18; ability.form-of-ember ch40; ability.ashen-warrior ch44 (zh ch labels) | implied | b | PFA3 typed bonus stacking · src/bonus_stacking.js (module present, no importer found in src/) |  |
| BD52 | VOICE | Birth shows a plain H:M:S countdown of the System lock, later quoted again in hours and minutes. | bdm.rule.system-lock-countdown bdmc001 zh1 p60, zh2 p1 | stated | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js |  |
| BD53 | VOICE | Skill messages are terse level lines ("X reaches level N") that stream by; notifications can be turned off and back on mentally, and the backlog flashes too fast to read. | bdm.custom.skill-level-notifications bdmc025 zh25 p56, zh26 p1-12 | stated | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js ; UR/FBK notification control |  |
| BD54 | VOICE | Combat reports list slain targets with identities, classes and levels, then stat gains per level. | bdm.institution.system-level-ups bdmc041; bdmc033 zh34 p58 | stated | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js ; combat_log.js |  |
| BD55 | VOICE | Unlock prompts arrive as thoughts: thinking about a topic can trigger a skill-offer notice (Secrets). The status screen's labels and ordering can be edited mentally. | bdm.ability.secrets bdmc009; bdm.custom.status-screen-editing bdmc021 zh21 p77 | stated | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js |  |
| TW22 | VOICE | System messages announce levels, class changes and similar; announcement is an award, not a full appraisal. | western/SERIES.json inn.C1; wiki page "System messages" r101549 listed but not digested | secondary | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js |  |
| DC12 | VOICE | A paid comment-feed board shows audience speech, heavily moderated by the System AI. | docs/research/power-systems/wiki-digests/DIGEST_dungeon-crawler-carl.md addendum (Social Media Board) | secondary | c | none; no audience feed model | SM7 |
| DCV1 | VOICE | The System AI speaks with personality and favouritism and enforces fine-print rules (digest: personality and favours; tone details recalled). | DD earlier lane mappings; SURVEY A2 | secondary | b | WKR15 + DSG skins · src/status_window.js, src/reports_dock.js ; CHT6 voice follows the cheat type |  |

Cross-book voice patterns: status screen summoned by thought (Azarinth, Dragoneye); terse "level reached" streams with a toggle (Dragoneye); evolution offer shown as a notice that warns about locked-out options (Azarinth); announcement delayed to sleep (Wandering Inn, secondary); an opinionated, favour-playing AI voice (Dungeon Crawler Carl, secondary). The Mother of Learning has no system voice, which WKR15 already allows.

## What the system reveals (knowledge-layer items)

What each world lets a character read about levels, other people and the rules themselves. All map onto KNW (truth, knowledge and display are three things) and GTR35 (reading a gate is itself a means).

| ID | Tag | Rule (paraphrase) | Source | Conf. | Class | Owner (law · seam) | Mech |
|---|---|---|---|---|---|---|---|
| AZ42 | REVEAL | Identify shows names and levels but is capped by the user's own level: levels above about 93 are unreadable at that point. It works best on living creatures and is limited on objects. | ability.identify ch1 p127, ch2 p68; rule.identify-levels ch27 p33 (zh ch labels) | stated | b | GTR35 reading a state is a means; KNW6 means decide what can be learned |  |
| AZ43 | REVEAL | When people cannot read an adventurer's level, they tend to avoid antagonising that adventurer, so a hidden level acts as a social deterrent. | rule.adventurer-level-deference ch27 (zh ch labels) | implied | b | KNW23 others' numbers are learned; standing rules STN |  |
| BD4 | REVEAL | Everyone has a System; most things bigger than a bug have one, but only humans and intelligent monsters get classes. Its origin is unknown. | bdm.institution.system bdmc003 zh4 p34 | stated | b | AD6 everyone plays by the same rules (SPR26); ABR21 NPC rows |  |
| BD56 | REVEAL | Identify shows a target's class label (e.g. Warrior, Laborer) and whether they outlevel you, but not class details. Range grows per level and is given in a local unit. | bdm.ability.identify bdmc009 zh9 p107-113; bdm.rule.identify-warrior bdmc029 | stated | b | GTR35/KNW6 appraisal reveals a bounded read |  |
| BD57 | REVEAL | Classes and levels are private by custom; announcing them aloud is unwise since public baths are not private. | bdm.custom.class-privacy bdmc021 zh21 p24 | stated | b | KNW rules; STN standing; level is private by custom |  |
| ML63 | REVEAL | Loop mechanics reach the protagonist in stages (Controller, marker, Guardian, iteration limits around c054-055 and c083); the contingency list stays withheld. | reset.iteration-cap c055; law.sovereign-gate-access c089 | stated | b | KNW3/KNW7 staged reveal; one stored ladder |  |
| ML64 | REVEAL | The protagonist's early theories are guesses (for example the loop ending when mana runs out); no confirmation is recorded. | reset.time-loop c006 | implied | b | KNW3/KNW7 staged reveal; one stored ladder |  |
| TW9 | REVEAL | Some conditions are hidden from the bearer; notice arrives only after removal. | docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md W09 | secondary | b | KNW7 + conditions.js · src/conditions.js |  |
| HW6 | REVEAL | Rank and rarity labels can be misread; rarity is not output strength. | docs/research/power-systems/western/SERIES.json hwfwm (wiki digest blocked: HTTP 403) hwfwm.M2 | secondary | a | SLR19 rank and competence are separate; GTR35 |  |

Cross-book pattern: reading is bounded by the reader. Azarinth caps Identify by the reader's own level; Dragoneye shows a class label and "outlevels you" but not class detail, and treats levels as private by custom; the Wandering Inn hides some conditions until removal; Mother of Learning stages the loop rules for the protagonist and keeps a contingency list withheld. All four are KNW6 and KNW23 behaviour plus data rows, so no new mechanism is needed for revelation itself.

## Shared mechanisms

Every row classed (c) in Rules by book above, deduplicated into world-neutral mechanisms. Ranked by the number of books with evidence-backed rows; the bg column adds books that only show up through model background knowledge and does not move the rank. Closest-seam files were checked to exist in `src/`. Save notes follow existing patterns (optional slice, additive revision, no reward replay on load: GTR12, PRG3, the skill-evolution revision 4 slice). All proposals; nothing here is accepted direction.

R1-R4 refer to "Future RPG view with a map" in docs/END_GOAL.md: R1 loop-neutral rules, R2 one active proof, R3 places carry position, R4 views read one model.

| Rank | Code | Mechanism | Books (evidence) | + bg books | Rule rows | R-flags |
|---|---|---|---|---|---|---|
| 1 | SM1 | Spendable growth-point pool | 3: Azarinth Healer, Beneath the Dragoneye Moons, The Primal Hunter | Dungeon Crawler Carl | 8 | R1 R2 R4 |
| 2 | SM5 | Slotted ability loadout | 3: Azarinth Healer, Beneath the Dragoneye Moons, He Who Fights with Monsters | - | 4 | R2 R4 |
| 3 | SM6 | In-world rule revision event | 3: The Wandering Inn, Dungeon Crawler Carl, The Primal Hunter | - | 3 | R1 R3 R4 |
| 4 | SM4 | Concurrent role stack | 2: Azarinth Healer, Beneath the Dragoneye Moons | The Primal Hunter | 5 | R2 R4 |
| 5 | SM2 | Opponent-relative reward scaling | 2: Azarinth Healer, Beneath the Dragoneye Moons | - | 3 | R1 R4 |
| 6 | SM3 | Shared kill credit and partner XP | 2: Azarinth Healer, Beneath the Dragoneye Moons | - | 3 | R1 R2 R4 |
| 7 | SM7 | Patronage channel | 2: Dungeon Crawler Carl, He Who Fights with Monsters | - | 3 | R1 R2 R4 |
| 8 | SM12 | Shared-source body copies | 1: Mother of Learning | - | 3 | R1 R3 R4 |
| 9 | SM8 | Participant-scoped technique | 1: The Wandering Inn | - | 2 | R2 R3 R4 |
| 10 | SM10 | Aggregate active-item interference | 1: The Wandering Inn | - | 1 | R1 R3 |
| 11 | SM11 | Finite restart budget | 1: Mother of Learning | - | 1 | R1 R4 |
| 12 | SM9 | Source-set confluence | 1: He Who Fights with Monsters | - | 1 | R2 R4 |

### SM1 · Spendable growth-point pool

**Definition.** A holder earns typed points (free, class-bound, elemental) on a level or stage crossing. The player allocates them to named stats through a quoted choice. Allocation can carry an upkeep cost drawn from another stat, can be banked unspent, and can be respecced under a world rule.

**Books and rows.** Azarinth Healer (AZ5); Beneath the Dragoneye Moons (BD7, BD8, BD12, BD49, BD50); The Primal Hunter (PH3). Dungeon Crawler Carl (DCbg1, now located).

**OOPS status.** Playable for the Village sleep routine. Sleeping level crossings award bankable recovery points. Deep rest spends them to improve sleep healing with a proportional stamina recovery upkeep. A bed lets the player reset the allocation. The book variants run as held-out data. [Normal-entry receipts](../representations/evidence/litrpg-sm1-sm5-2026-11-27/proof-sm1.json)

**Owner.** `src/growth_points.js` quotes and settles the typed pool. The native Sleeping award supplies the crossing and the existing Growth queue reads the holder projection.

**Save implications.** Optional save slice `growth_points` revision 1 records earnings by type and allocated counts by option. The bank is derived. Pre-feature saves open with an empty bank and unchanged XP (GTR12).

**Idle-play note.** Points accrue while away from the same settlement that grants levels. Unspent points stay banked. Reports links to Growth when a crossing earns a point (SLR26).

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R4: must read through the shared observer-safe model, not a private copy.

### SM5 · Slotted ability loadout

**Definition.** Active and passive abilities sit in capped slots. Adding to a full slot forces a replace-or-decline choice. Dropping an ability can reset its level when it is later retaken. Slots can be per role and general.

**Books and rows.** Azarinth Healer (AZ21); Beneath the Dragoneye Moons (BD25, BD36); He Who Fights with Monsters (HW7).

**OOPS status.** Playable for the Village sleep routine. At Sleeping level one, the active slot can change to Steady breath for stamina or Gentle position for health. Swaps take 12 game minutes. Recovery continues with the current slot until the swap settles, and the extra recovery scales with what is missing. [Normal-entry receipts](../representations/evidence/litrpg-sm1-sm5-2026-11-27/proof-sm5.json)

**Owner.** `src/ability_loadout.js` quotes slot changes and resolves the selected slot from the saved clock deadline. Growth uses the same projection as the sleep routine. Azarinth and Dragoneye run as held-out cases. HWFWM runs as a provisional slot and donor case from HW7, with an illustrative slot count.

**Save implications.** Optional `ability_loadout` revision 1 holds slot groups, relearning levels and any pending change with its game-clock deadline. Legacy saves start with ordinary sleep. Native skill XP is unchanged.

**Idle-play note.** An unaccepted offer can wait indefinitely. Work continues with the current loadout until a change the player booked reaches its deadline.

**Future RPG view (END_GOAL R1-R4).** R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R4: must read through the shared observer-safe model, not a private copy.

### SM6 · In-world rule revision event

**Definition.** A dated world event that changes the active law set for a scope: system integration, a patch, a new floor with different rules, or rerouted reward weights. It names who is affected, what notice they get, and keeps the previous version readable.

**Books and rows.** The Wandering Inn (TW12); Dungeon Crawler Carl (DC16); The Primal Hunter (PH5).

**Closest seam.** `src/world_pack.js` and `src/check_rule_pack.js` (rule packs); SPR12 already treats a refit as a new law revision in authoring; notice via `src/world_report_voice.js`.

**Save implications.** Store the active law revision ID per scope with the date it took effect. Facts earned under an old revision stay as they were (GTR28 carry per class).

**Idle-play note.** The event is a scheduled world clock, read at its date when time advances in one jump or in steps (R1). The notice joins the return recap, not a modal.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R3: needs place or position data so a map view can draw it; R4: must read through the shared observer-safe model, not a private copy.

### SM4 · Concurrent role stack

**Definition.** A holder carries several roles at once (class, profession, second class), each with its own level ladder, skill pool and evolution chain. Slot limits say how many roles; a role evolution replaces a role; a role change can reset its level; unlocking another slot is gated by a level.

**Books and rows.** Azarinth Healer (AZ11, AZ36); Beneath the Dragoneye Moons (BD20, BD26). The Primal Hunter (PHbg1, now located).

**Closest seam.** `src/ascension_paths.js` + `src/progression_path.js` (PRG1-PRG12) hold one path per holder today; EV6 (later slice) is the evolution hook in `src/skill_evolution.js`.

**Save implications.** Extend the path position record to a list keyed by role ID, as an additive revision of the PRG position (PRG3). Old saves read as a one-element list.

**Idle-play note.** Each role's track accrues from its own activity routing (as EV5 already routes small skills). Offers appear once under Growth and wait; away time never commits a role change.

**Future RPG view (END_GOAL R1-R4).** R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R4: must read through the shared observer-safe model, not a private copy.

### SM2 · Opponent-relative reward scaling

**Definition.** Reward from a defeat is a function of the gap between holder and opponent, the effort or danger, and how familiar the holder is with that opponent kind. Output is a multiplier on XP or points, with a floor.

**Books and rows.** Azarinth Healer (AZ12, AZ15); Beneath the Dragoneye Moons (BD45).

**Closest seam.** `src/gameplay_transactions.js` (fixed skill XP with parent inheritance) and `src/combat_math.js`; familiarity counter beside `src/adaptation_ledger.js` keyed by enemy kind.

**Save implications.** Per-enemy-kind familiarity counters in a bounded map (SPR30), added as an optional field on the holder record. No migration; absent counters read as zero.

**Idle-play note.** Settled per kill at the time of the kill, never from a batch average, so a long away stretch cannot farm one low-gap enemy for full reward. Familiarity updates once per settled kill.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R4: must read through the shared observer-safe model, not a private copy.

### SM3 · Shared kill credit and partner XP

**Definition.** A defeat credits several holders by rule: solo takes full, a party dilutes, a bonded partner pair share both ways, and a gap threshold may differ between solo and group.

**Books and rows.** Azarinth Healer (AZ13, AZ14); Beneath the Dragoneye Moons (BD48).

**Closest seam.** `src/party_battle.js` and `src/companion_roster.js` for who was present; `src/gameplay_transactions.js` for settlement.

**Save implications.** No new save data if credit is computed at settlement from the battle record; add a `creditRule` reference per world pack row.

**Idle-play note.** Away fights settle through the same battle record, so credit follows who was assigned at the time. Offline partners credit by their recorded presence.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R4: must read through the shared observer-safe model, not a private copy.

### SM7 · Patronage channel

**Definition.** Third parties (sponsors, gods, an audience) hold a standing connection to a holder. They grant gifts or powers at a price or on a rating, the connection can be revoked, eligibility is distinct from delivered aid, and a moderated feed shows audience speech.

**Books and rows.** Dungeon Crawler Carl (DC1, DC12); He Who Fights with Monsters (HW3).

**Closest seam.** `src/obligations_ledger.js` and `src/vow_rules.js` for standing obligations; `src/reports_dock.js` for the feed surface.

**Save implications.** A `patrons` list: patron ID, connection state, grants issued, revocation date. Grants already issued stay owned (GTR13).

**Idle-play note.** Eligibility is computed from standing at the time a grant would arrive. Delivered gifts wait in a held list for the player to open, so offline play never loses or auto-spends a gift.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R4: must read through the shared observer-safe model, not a private copy.

### SM12 · Shared-source body copies

**Definition.** Copies of one person share one reserve and one soul, so they add bodies but not capacity. Copy lifetime and supervision limits are world rules, and a single-viewpoint link can unify them when the task matches.

**Books and rows.** Mother of Learning (ML38, ML39, ML40).

**Closest seam.** `src/being_record.js` and `src/kernel_working.js` (one working, several bodies).

**Save implications.** Copy records pointing to the source holder ID; reserve stays on the source.

**Idle-play note.** Copies expire by their own clock; away time resolves expiry once at return.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R3: needs place or position data so a map view can draw it; R4: must read through the shared observer-safe model, not a private copy.

### SM8 · Participant-scoped technique

**Definition.** A technique bound to named contributors: joint skills that later work for one member or keep needing the team, and abilities provided by a designated guardian. A rule says what remains if a participant leaves.

**Books and rows.** The Wandering Inn (TW5, TW7).

**Closest seam.** `src/composed_moves.js` (roles over parts) and `src/kernel_working.js` typed roles bound to actual things.

**Save implications.** Participant list on the technique row; solo-retention flag. No new slice if stored on the existing technique record.

**Idle-play note.** Needs the participants at settlement; away time uses the recorded roster and settles as a partial result when one is absent.

**Future RPG view (END_GOAL R1-R4).** R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R3: needs place or position data so a map view can draw it; R4: must read through the shared observer-safe model, not a private copy.

### SM10 · Aggregate active-item interference

**Definition.** Active items near each other leak and interfere by proximity; inactive items in a holding container do not. The safe load is a function of leakage, not a fixed count.

**Books and rows.** The Wandering Inn (TW15).

**Closest seam.** `src/active_effects.js` and `src/area_field_law.js`.

**Save implications.** Derived on read from equipped and held state; nothing stored.

**Idle-play note.** Evaluated at each settlement from what is active then. No offline accrual.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R3: needs place or position data so a map view can draw it.

### SM11 · Finite restart budget

**Definition.** A loop has a limited number of restarts, spent per iteration rather than per day, with a visible or hidden counter.

**Books and rows.** Mother of Learning (ML6).

**Closest seam.** `src/loop_table.js` (what a restart resets and carries) plus `src/mol_zorian_loop.js`.

**Save implications.** Optional remaining-restarts counter on the loop record; absent means unbounded (today's behaviour).

**Idle-play note.** Decremented only by a settled restart, never by elapsed time.

**Future RPG view (END_GOAL R1-R4).** R1: time passing in one jump or step by step gives the same result; R4: must read through the shared observer-safe model, not a private copy.

### SM9 · Source-set confluence

**Definition.** Several bonded sources produce an emergent combined result. Each source has a small ability list; one wakes on bonding and others wake through a catalyst with a biased draw. The set is non-transferable and a donor can revoke.

**Books and rows.** He Who Fights with Monsters (HW1).

**Closest seam.** `src/gu_keeper_fusion.js` and `src/gu_moon_fusions.js` for set-to-result recipes; EV4 in `src/skill_evolution.js` for the offer shape.

**Save implications.** Source slots by ID and the confluence receipt; draw results frozen via the existing saved authored draws.

**Idle-play note.** Awakening is a player-driven catalyst event with a quoted odds line; idle play does not consume catalysts.

**Future RPG view (END_GOAL R1-R4).** R2: needs one player-driven proof (a choice, scene or fight turn) besides idle routine; R4: must read through the shared observer-safe model, not a private copy.

### Watch list: class (b) items that are really unbuilt later slices

These are rows I classed (b) because an existing law owns them, but the law is not shipped for them yet. They are not new mechanisms, only work the foundation already promises.

- EV6 class or path evolution: only one Village row exists (`village.patrol-path`). Azarinth, Dragoneye and Primal Hunter class evolutions all wait on it. AZ31-AZ35, BD21, BD27-BD29.
- Typed bonus stacking: `src/bonus_stacking.js` has no importer in `src/`. AZ4, BD51, DC4.
- Loop table, adaptation ledger, rank-gap observer, status window, dojo tower each have one importer. They exist and are thinly wired.
- `src/obligations_ledger.js` header says pure and not wired into save or gameplay (10 importers now, so adapters read it, but no save slice). DC7, DC13, BD71.

## Reading and coverage gaps

Generated 2026-11-27. The Windows census pass used existing evidence (no EPUB or Calibre library exists at a standard path on this Windows machine; the batch plans still point at `/Users/weiwei/...` source paths that are not here).

### 1. Books with no usable reading on disk

"Index files" means `docs/research/novels/<book>/private/lead-run-*/index_*.json`, which hold only chapter, paragraph and character counts. They contain no rules.

| Book | Held (LIBRARY_INDEX) | What exists on disk | Rows in census |
|---|---|---|---|
| The Wandering Inn | Books 1-19 plus split editions | 225 index files; batch plan `twi` registered for book 1; wiki digest (revision-backed, 18 mechanics) | 22, all secondary |
| Dungeon Crawler Carl | 1-8 | No private folder, no batch registration; wiki digest with a 16-page addendum | 21, all secondary except 2 bg |
| He Who Fights with Monsters | 1-13 | 57 index files; batch plan `hwfwm`; wiki digest blocked (HTTP 403), only the western SERIES row | 7, secondary or lead |
| Chrysalis | 1-9 plus book 10 as PDF | Nothing but research-doc mentions (RESEARCH_GENRE_SWEEP, SOURCE_DEEP_DIVE_QUEUE) | 3, named not audited |
| The Primal Hunter | 1-16 | No private folder; research-doc mentions only (EV3 case, SKILLS_AND_TALENTS, TROPE_ATLAS) | 6, 1 bg |
| Tree of Aeons | 1-8 | 228 index files; batch plan `toa1-6` | 1, secondary |
| The Legend of Randidly Ghosthound | 1-15 | 371 index files; batch plan `rg1-6` | 0 |
| Path of Ascension | through 12 | 330 index files; batch plan `poa1-11` | 0 |
| Millennial Mage | 1-13 | None. The batch key `mm` in `books.json` is Mana Mirror, not Millennial Mage, so Millennial Mage was never registered | 0 |
| Threadbare | 1-6 | None; one mention in a reconciliation JSON and the wishlist | 0 |
| Cinnamon Bun | 1-7 | None; wishlist and catalogue lines only | 0 |
| The Menocht Loop | 1-6 (earlier "unheld" notes in BOOK_DISCOVERY are superseded) | None | 0 |

Readings that do exist cover only part of each book: Azarinth Healer book 1 of 7, Beneath the Dragoneye Moons book 1 of 16 (shards run to about zh chapter 50), Mother of Learning all 106 chapters plus epilogue. Later-book mechanics (Azarinth third-tier skills beyond hearsay, Dragoneye bonds and the third class slot, anything after book 1) are absent.

The Wandering Inn, Dungeon Crawler Carl and He Who Fights with Monsters are the three biggest holes for a System census, because they are the series with the most distinctive rules and none has a reading. Randidly Ghosthound and Primal Hunter would be next.

### 2. Sources available to the initial survey

- All 22 Wandering Inn rows come from the wiki digest (MediaWiki revisions, fetched 2026-10-10) or research-doc notes. Only TW19 (first class after ordinary work) and TW2's Goblin Days case were checked against chapter text, and only by the earlier research pass, not this one.
- All Dungeon Crawler Carl rows come from the wiki digest and project docs. DC16 leans on a recalled line in `research/system-evolution-2026-10-10/SURVEY.md` section A2, which that file says is unverified.
- He Who Fights with Monsters rests on the western SERIES row built from two fan or review pages. HW7 (ability slots) is a lead from an earlier lane mapping that the digest itself marks unverified.
- Primal Hunter, Chrysalis and Tree of Aeons rows are named in project docs; none cites a scene except the chapter 1388 EV3 case.
- Mother of Learning: ML1-ML65 rest on the reading dump (stated, mostly). ML38-ML40 (simulacra) and ML55-ML57 (contracts) also lean on the western SERIES row. The distilling agent used the 170-character truncated dump and did not open the full records for most rows. The digest it cites came from a failed wiki fetch and was used only as a lead.
- The three initial background leads have since been narrowed to the cited reader claims. The campaign ranking counts the located records independently.

### 3. Quality limits on the readings themselves

- Records are model-extracted ("Luna ... unchecked" per the MoL mechanisms file header) and not human-checked. Treat a reading row as a lead to confirm in the text before a world pack depends on it.
- Locators for Azarinth Healer and Dragoneye read `zh b1 第N章` although both are English books. The Azarinth dump covers zh chapters 1-73, not the 41 chapters the batch plan implies. The cause was not investigated.
- Several Dragoneye rows are character opinions or guesses (BD33, BD46, BD47 and others), marked implied.
- Class (a) and (b) calls were made by checking module existence and importer count, not by playing each mechanism. EV1-EV5 rows exist in `src/data/skill_evolutions.js` at the current working tree; Codex has uncommitted edits in `src/skill_evolution*.js` and `docs/PROGRESSION_GATE_RULES.md` as of this run, so (a) for EV rows can shift.
- `src/bonus_stacking.js` has no importer in `src/`; AZ4, BD51 and DC4 are classed (b) for that reason.

### 4. Cheapest next reads, if you want them (not run, none authorized)

1. DCC book 1 and The Wandering Inn book 1: run the existing batch-reading plans with the local reader first (no paid API), rules shard only, then re-run this census builder. These two cover the most (c) candidates (SM6, SM7, SM8, SM10).
2. HWFWM book 1 for SM9 and SM5 (essence slots, confluence). Needs a wiki route other than Fandom, or the book.
3. Register Millennial Mage under its own key. It is not in the plans today.
4. For Azarinth, read book 2-3 rules to confirm tier-3 and class-200 hearsay rows (AZ18, AZ27).

### Precision review, November 27

A reader independently reviewed 40 record-to-mechanism assignments against their private source rows. Sorting assignments by SHA-256 of the fixed seed `U2 precision v1`, world, mechanism, record ID and locator selected the sample. **34 of 40 matched the mechanism (85%).** Ambiguity counted as a miss. Two patronage claims lacked a continuing relationship, three proposed class evolutions described ability effects or skill points, and one dual-track claim only established an evolution prerequisite. The classifier was frozen before review. The counts below are candidate matches, and the sample does not estimate recall.

| Sample | Assignment | Located record | Reviewed |
|---:|---|---|---|
| 1 | SM1 | `az.custom.stat-point-award` · en b4 c72 p32 | Match |
| 2 | SM7 | `ph.law.blessing-terms` · en b16 c53 p27 | Match |
| 3 | SM7 | `dcc.law.bard-death-patron-revenge` · en b6 c67 p119 | Miss |
| 4 | SM1 | `ph.other.class-level-up` · en b2 c17 p55 | Match |
| 5 | SM1 | `ph.other.level-up-stats` · en b3 c26 p69 | Match |
| 6 | EV6 | `ph.ability.malefic-vipers-poison` · en b9 c15 p20 | Miss |
| 7 | SM1 | `rg.other.frontrunner-path` · en b1 c58 p3 | Match |
| 8 | EV6 | `cbun.ability.skill-point-allocation` · en b1 c56 p51 | Miss |
| 9 | SM4 | `az.custom.guardian-progression` · zh b1 ç¬¬37ç«  p92 | Match |
| 10 | EV6 | `toa.rule.guild-skill-limit-evolution` · en b5 c48 p7 | Match |
| 11 | SM1 | `ph.other.free-points-and-levels` · en b1 c35 p30 | Match |
| 12 | SM1 | `rg.rule.stat-allocation` · en b1 c30 p5 | Match |
| 13 | SM1 | `az.other.stat-point-allocation` · en b4 c10 p15 | Match |
| 14 | SM1 | `ph.other.race-level-up` · en b7 c26 p76 | Match |
| 15 | EV6 | `cbun.other.skill-transform` · en b2 c35 p70 | Match |
| 16 | SM1 | `ph.other.level-up-class-and-race` · en b1 c73 p9 | Match |
| 17 | SM1 | `az.custom.level-advancement` · zh ç¬¬44ç«  p8 | Match |
| 18 | SM4 | `ph.other.perfect-evolution` · en b12 c66 p51 | Miss |
| 19 | SM2 | `ph.law.bonus-experience-higher-level-kill` · en b8 c40 p42 | Match |
| 20 | EV6 | `az.custom.evolution-flesh-destroyer` · en b6 c66 p25 | Match |
| 21 | SM1 | `dcc.other.stat-point-allocation` · en b3 c2 p178 | Match |
| 22 | SM1 | `ph.other.level-up-points` · en b1 c26 p7 | Match |
| 23 | SM5 | `bdm.ability.lost-and-found` · en b5 c30 p3 | Match |
| 24 | EV6 | `chry.ability.antspeaker` · en b6 c120 p40 | Miss |
| 25 | SM1 | `ph.other.level-up-free-points` · en b4 c5 p5 | Match |
| 26 | EV6 | `az.custom.evolution-cerithil-huntress` · en b6 c66 p46 | Match |
| 27 | SM7 | `dcc.institution.sponsor-broadcast` · en b7 c21 p19 | Match |
| 28 | SM1 | `ph.other.level-up` · en b1 c4 p52 | Match |
| 29 | SM1 | `chry.other.manual-evolution` · en b6 c18 p26 | Match |
| 30 | SM7 | `toa.craft.two-stage-crystal-bomb` · en b4 c3 p61 | Miss |
| 31 | EV6 | `az.custom.empress-of-eternal-ash` · en b3 c77 p6 | Match |
| 32 | SM5 | `az.other.skill-slot-swap` · en b5 c35 p35 | Match |
| 33 | SM5 | `az.ability.azarinth-first-hunter` · zh b1 ç¬¬67ç«  p90 | Match |
| 34 | SM9 | `hwfwm.rule.avatar-confluence` · en b6 c27 p95 | Match |
| 35 | SM4 | `az.custom.arcane-touched` · en b5 c33 p323 | Match |
| 36 | EV6 | `az.ability.azarinth-first-hunter` · zh b1 ç¬¬67ç«  p24 | Match |
| 37 | SM4 | `bdm.ability.constellation-of-the-healer-celestial` · zh ç¬¬49ç«  p63 | Match |
| 38 | SM4 | `twi.other.class-merge` · en b2 c38 p113 | Match |
| 39 | EV4 | `chry.other.skill-grinding` · en b9 c51 p3 | Match |
| 40 | EV6 | `az.custom.evolution-sentinel` · en b3 c76 p125 | Match |

<!-- generated: reading census -->
## Campaign rules by world and mechanism

Counts use canonical completed rules files. Each admitted record needs a shown or told evidence label, a chapter locator and an explicit relation in one field. Repeated IDs at the same locator count once within a world and mechanism. One record can support several mechanisms. A zero means the classifier found no qualifying claim. Facet columns count distinct located subrecords with their own shown or told label. Background and secondary material contribute zero.

| World | Raw rows | Distinct located records | Classified records | Acquisition | Enforcement | Reset |
|---|---:|---:|---:|---:|---:|---:|
| Azarinth Healer | 4519 | 4299 | 92 | 321 | 58 | 0 |
| Beneath the Dragoneye Moons | 3850 | 3618 | 52 | 222 | 98 | 7 |
| He Who Fights with Monsters | 5842 | 5609 | 10 | 201 | 172 | 10 |
| The Wandering Inn | 8285 | 7872 | 10 | 447 | 438 | 13 |
| The Primal Hunter | 7259 | 6916 | 179 | 223 | 113 | 25 |
| Dungeon Crawler Carl | 3792 | 3593 | 14 | 114 | 158 | 30 |
| Chrysalis | 3483 | 3305 | 23 | 262 | 75 | 8 |
| Tree of Aeons | 2682 | 2513 | 7 | 82 | 82 | 4 |
| Randidly Ghosthound | 3788 | 3460 | 28 | 256 | 70 | 3 |
| The Path of Ascension | 4759 | 4501 | 10 | 161 | 197 | 20 |
| Millennial Mage | 1964 | 1871 | 0 | 96 | 67 | 1 |
| Threadbare | 2039 | 1947 | 0 | 134 | 36 | 10 |
| Cinnamon Bun | 1305 | 1241 | 31 | 95 | 30 | 8 |
| The Menocht Loop | 1564 | 1462 | 0 | 71 | 40 | 55 |

| World | SM1 | SM2 | SM3 | SM4 | SM5 | SM6 | SM7 | SM8 | SM9 | SM10 | SM11 | SM12 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Azarinth Healer | 25 | 6 | 0 | 19 | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Beneath the Dragoneye Moons | 10 | 0 | 0 | 20 | 18 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| He Who Fights with Monsters | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 8 | 0 | 0 | 0 |
| The Wandering Inn | 0 | 0 | 0 | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| The Primal Hunter | 99 | 17 | 0 | 4 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | 0 |
| Dungeon Crawler Carl | 5 | 0 | 2 | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 0 | 0 |
| Chrysalis | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Tree of Aeons | 0 | 0 | 0 | 4 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| Randidly Ghosthound | 17 | 0 | 2 | 1 | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| The Path of Ascension | 0 | 0 | 0 | 1 | 3 | 0 | 5 | 0 | 0 | 0 | 0 | 0 |
| Millennial Mage | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Threadbare | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Cinnamon Bun | 0 | 0 | 0 | 16 | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| The Menocht Loop | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

| World | EV1 | EV2 | EV3 | EV4 | EV5 | EV6 |
|---|---:|---:|---:|---:|---:|---:|
| Azarinth Healer | 0 | 0 | 0 | 0 | 0 | 38 |
| Beneath the Dragoneye Moons | 0 | 0 | 0 | 1 | 0 | 7 |
| He Who Fights with Monsters | 0 | 0 | 0 | 0 | 0 | 1 |
| The Wandering Inn | 0 | 0 | 0 | 0 | 0 | 2 |
| The Primal Hunter | 0 | 0 | 3 | 4 | 0 | 51 |
| Dungeon Crawler Carl | 0 | 0 | 0 | 0 | 0 | 0 |
| Chrysalis | 0 | 0 | 0 | 14 | 0 | 6 |
| Tree of Aeons | 0 | 0 | 0 | 0 | 0 | 1 |
| Randidly Ghosthound | 0 | 0 | 0 | 0 | 2 | 1 |
| The Path of Ascension | 0 | 0 | 0 | 0 | 1 | 0 |
| Millennial Mage | 0 | 0 | 0 | 0 | 0 | 0 |
| Threadbare | 0 | 0 | 0 | 0 | 0 | 0 |
| Cinnamon Bun | 0 | 0 | 0 | 0 | 1 | 10 |
| The Menocht Loop | 0 | 0 | 0 | 0 | 0 | 0 |

| World | Mechanism | Located matches | Example record and chapter |
|---|---|---:|---|
| Azarinth Healer | SM1 | 25 | `az.other.stat-allocation` · en b2 c58 p51 |
| Azarinth Healer | SM2 | 6 | `az.law.kingsguard-bonus-experience` · en b3 c81 p23 |
| Azarinth Healer | SM4 | 19 | `az.ability.mana-intrusion` · en b2 c5 p33 |
| Azarinth Healer | SM5 | 5 | `az.ability.faen-valkyrie` · en b5 c34 p75 |
| Azarinth Healer | EV6 | 38 | `az.ability.azarinth-first-hunter` · en b2 c1 p6 |
| Beneath the Dragoneye Moons | SM1 | 10 | `bdm.other.stat-allocation` · en b3 c5 p54 |
| Beneath the Dragoneye Moons | SM4 | 20 | `bdm.other.constellation-of-the-healer` · en b2 c2 p7 |
| Beneath the Dragoneye Moons | SM5 | 18 | `bdm.ability.moonlight` · en b2 c31 p8 |
| Beneath the Dragoneye Moons | SM7 | 1 | `bdm.institution.school-combat-team` · en b8 c26 p45 |
| Beneath the Dragoneye Moons | EV4 | 1 | `bdm.ability.meta-skill-fusion` · en b8 c43 p78 |
| Beneath the Dragoneye Moons | EV6 | 7 | `bdm.custom.fire-advanced-forms` · en b2 c20 p51 |
| He Who Fights with Monsters | SM7 | 1 | `hwfwm.institution.gold-ranker-patron` · en b12 c59 p8 |
| He Who Fights with Monsters | SM9 | 8 | `hwfwm.law.essence-single-confluence` · en b11 c84 p97 |
| He Who Fights with Monsters | EV6 | 1 | `hwfwm.other.transfiguration` · en b3 c41 p89 |
| The Wandering Inn | SM4 | 8 | `twi.other.dual-class-leveling` · en b11 c11 p24 |
| The Wandering Inn | EV6 | 2 | `twi.ability.bartender-class` · en b15 c6 p65 |
| The Primal Hunter | SM1 | 99 | `ph.other.level-up-free-points` · en b10 c13 p67 |
| The Primal Hunter | SM2 | 17 | `ph.other.kill-bonus-experience` · en b10 c29 p43 |
| The Primal Hunter | SM4 | 4 | `ph.other.perfect-evolution` · en b12 c66 p51 |
| The Primal Hunter | SM7 | 5 | `ph.ability.divine-bargain` · en b14 c53 p37 |
| The Primal Hunter | EV3 | 3 | `ph.craft.storybook-page-upgrade` · en b11 c55 p39 |
| The Primal Hunter | EV4 | 4 | `ph.ability.skill-fusion-cultivate-toxin` · en b10 c68 p42 |
| The Primal Hunter | EV6 | 51 | `ph.other.skill-selection-grades` · en b13 c35 p8 |
| Dungeon Crawler Carl | SM1 | 5 | `dcc.other.stat-points` · en b1 c4 p41 |
| Dungeon Crawler Carl | SM3 | 2 | `dcc.other.party` · en b1 c4 p102 |
| Dungeon Crawler Carl | SM7 | 7 | `dcc.custom.patron-boxes` · en b1 c4 p68 |
| Chrysalis | SM1 | 2 | `chry.ability.superior-hatchling-evolution` · en b3 c7 p119 |
| Chrysalis | SM4 | 1 | `chry.other.skill-class-fusion` · en b3 c1 p392 |
| Chrysalis | EV4 | 14 | `chry.ability.bite-chomp-fusion` · en b3 c7 p70 |
| Chrysalis | EV6 | 6 | `chry.ability.antspeaker` · en b6 c115 p8 |
| Tree of Aeons | SM4 | 4 | `toa.rule.class-merge-plateau` · en b2 c11 p88 |
| Tree of Aeons | SM5 | 1 | `toa.ability.dream-tutor` · en b1 c82 p86 |
| Tree of Aeons | SM7 | 1 | `toa.craft.two-stage-crystal-bomb` · en b4 c3 p61 |
| Tree of Aeons | EV6 | 1 | `toa.rule.guild-skill-limit-evolution` · en b5 c48 p7 |
| Randidly Ghosthound | SM1 | 17 | `rg.rule.newbie-path-stat` · en b1 c1 p74 |
| Randidly Ghosthound | SM3 | 2 | `rg.other.party-experience-share` · en b5 c9 p11 |
| Randidly Ghosthound | SM4 | 1 | `rg.institution.city-classes` · en b5 c82 p25 |
| Randidly Ghosthound | SM5 | 5 | `rg.ability.leadership` · en b1 c39 p78 |
| Randidly Ghosthound | EV5 | 2 | `rg.system.skill-consolidation` · en b4 c90 p35 |
| Randidly Ghosthound | EV6 | 1 | `rg.rule.class-inheritance` · en b1 c42 p11 |
| The Path of Ascension | SM4 | 1 | `poa.institution.class-schedule` · en b1 c6 p15 |
| The Path of Ascension | SM5 | 3 | `poa.ability.flaming-strike` · en b6 c19 p11 |
| The Path of Ascension | SM7 | 5 | `poa.custom.path-completion-rewards` · en b10 c29 p44 |
| The Path of Ascension | EV5 | 1 | `poa.rule.skill-consolidate-fragments` · en b10 c35 p175 |
| Cinnamon Bun | SM4 | 16 | `cbun.ability.jumping` · en b1 c52 p53 |
| Cinnamon Bun | SM5 | 8 | `cbun.other.class-level-up` · en b1 c37 p19 |
| Cinnamon Bun | EV5 | 1 | `cbun.custom.skill-merge` · en b6 c58 p41 |
| Cinnamon Bun | EV6 | 10 | `cbun.ability.class-evolution` · en b1 c55 p65 |

Unlisted world and mechanism pairs have zero matches.

### Next foundation slices

Ranked by the number of contributing worlds, then by mean matches per 1,000 located records across the covered worlds. Systems with an exercised OOPS receipt in the Atlas are excluded. A recommendation calls for checking existing partial implementations before adding a law.

| Rank | Mechanism | Worlds | Matches | Mean per 1,000 |
|---:|---|---:|---:|---:|
| 1 | SM4 · Concurrent class and profession tracks | 9 | 74 | 1.92 |
| 2 | SM7 · An outside patron grants aid | 6 | 20 | 0.33 |
| 3 | SM2 · Reward depends on the level gap | 2 | 23 | 0.28 |
| 4 | SM3 · Shared defeat credit | 2 | 4 | 0.08 |
| 5 | SM9 · Several essence types determine a confluence | 1 | 8 | 0.10 |
