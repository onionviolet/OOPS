# LOTM pathway potion table, all 22 pathways, Sequences 9 to 0

Lane L1 of [the potion-pathways dispatch](CHECKPOINT.md), 2026-10-24. Research only: a reuse pass over existing notes, no new book reading, no web. Nothing here is an accepted decision or implemented gameplay. Gate codes (LMG1 to LMG33) are cited from [the LOTM gate pass](../../../worlds/progression-gates-2026-10-23/LORD_OF_THE_MYSTERIES.md), not restated. Prior round: [CRAFTING_ENGINE round 8](../../../CRAFTING_ENGINE.md) (PZ1 to PZ12).

## 0. How to read this

**Evidence tags** (per fact): `S` SHOWN (on the page, locator given); `T` STATED (a character says it); `W` WIKI (crosscheck only, outside reader notes); `I` INFERRED (a reader or Klein deduces it); `M` MISSING (not in any note).

**Locators** are EPUB member numbers, `0209` = `lotm_c_0209.xhtml`. `C0000` locators are Circle of Inevitability (COI). Ritual rows are keyed to the Sequence being entered (a "Seq 5 ritual" is the rite for taking the Seq 5 potion).

**Sources used.** Census ([JSONL](../../research/novels/lord-of-mysteries/census-2026-10-19/LOTM_CENSUS.jsonl), [report](../../research/novels/lord-of-mysteries/census-2026-10-19/LOTM_CENSUS_REPORT.md), `dwf57`, `dwf59`, `grammar`); reader files [A](../../research/novels/lord-of-mysteries/readers-2026-10-10/LOTM_PATHWAYS_A.md), [B](../../research/novels/lord-of-mysteries/readers-2026-10-10/LOTM_PATHWAYS_B.md), [C](../../research/novels/lord-of-mysteries/readers-2026-10-10/LOTM_PATHWAYS_C.md), [rules](../../research/novels/lord-of-mysteries/readers-2026-10-10/LOTM_RULES.md); [deep dive](../../research/novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md); [wiki crosscheck](../../research/novels/lord-of-mysteries/WIKI_CROSSCHECK_2026-10-10.md). The two `POWERS.md` files and `claims.json` were searched and add no new formula rows (the full-book POWERS index is a rule-level index with only Part 1 and early Part 2 integrated; claims.json holds trade and rule claims, not ingredient lists). Only 5 census claims were re-checked against the EPUB; the rest is Sonnet reader output.

### 0.1 Rules that apply to every row

| Rule | Fact | Tag, locator |
|---|---|---|
| Low brewing | Seq 9 to 7: add ingredients in listed order, no special flame, ritual or spirituality | T Old Neil 0031, 0034 |
| Dose tolerance | Active ingredients cannot be over-dosed (madness or death); under-dosing is safer | T Old Neil 0031 |
| Main versus aux | Formula = main[] plus aux[]; a main may list "or" alternates; a same-Sequence characteristic can replace the main, aux still needed, no skipping | S 0142, 1204, 0723; T 0214, 0221 |
| Characteristic worth | A dead Beyonder's characteristic is roughly a potion minus auxiliaries; polluted ones poison; imprint risk | T 0209, 0214, 0403, 0254, 0357 |
| Rituals | Begin at Seq 5, scale up; Seq 4 and above need a rite plus special material | T 0254, 0706, 1039, 0214 |
| Church supply | Low and mid: church hands recipe and materials; Seq 4 and above: finished potion plus ritual only | I Klein 0161, 0706 |
| Church wait | Three years plus review between potions | T Dunn 0018, 0096 |
| Digestion | With acting: Seq 8 to 7 three months to two years, Seq 7 to 6 six months to three years, Seq 5 to 4 three to twenty years; without acting about three years | T Dai 0150, T Neil 0093 |
| Acting | The potion name is the invitation; live its hidden principles | T Klein 0057, 0059; Cecima says every drinker's rules differ, T 0171 |
| Loss of control causes | Skipping Sequences, wrong-pathway potion, switching, residue, temptation; pre-signs reversible about a week, full loss terminal (LMG11) | T 0018, 0348, 0165 |
| Mythical form | From Seq 4; unretracted form is loss of control (LMG14) | T 0725 |
| Seq 0 and 1 | One Seq 0 per pathway (needs the Uniqueness); at most three Seq 1, none while Seq 0 lives (LMG17) | T 0269, 0327, 0412, 0449 |
| Ingredient class | Mains are creature organs, blood or crystals; aux are plant liquids, powders, water; no stated rule linking ingredients across Sequences or pathways | I (dwf57, dwf59) |

### 0.2 Price ladder (pounds, LOTM era; formula = recipe sheet, material = each main item, char = characteristic)

| Tier | Price points | Tag, locator |
|---|---|---|
| Seq 9 | main materials 50 to 200 each (two needed, about 400 total); Corpse Collector formula 230, black-spotted frog 170 each; Seq 9 formula price otherwise M | I 0243; T 0128, 0278 |
| Seq 8 | formula 450 (Sheriff board; Barbarian formula traded for weapons at 450 to 520); materials about 300 each; characteristic about 600 to 700 (Pugilist 0656, 0694; Sheriff 600 at 0403, 0414); Beast Trainer crystal 300 | S 0132; T 0243, 0278, 0403 |
| Seq 7 | formula about 800 (Klein sold Briber at 900, 0350); materials 500 to 700; Astrologer materials 600 each via Tarot Club (0700); Solar High Priest main about 2000 (0527); Psychiatrist char 1200 to 1500 (0582); Interrogator char 1000 (0816) | S/T as listed |
| Seq 6 | formula normally under 2000, asked 3000 (0459); materials 1500+ each; Hypnotist 1500 to 2000 (0700); Faceless main 1450 (0444), about 2235 (0419); Wind-blessed about 2500 plus a mask (0460); char 3000 to 4000, Faceless sold at 3825 (0494, 0543) | S/T as listed |
| Seq 5 | Druid formula 5000, Druid char 8000 (1121, 0847); Mentor of Disorder char 8000 plus 1500 to craft (0846); crafted 5500 item from a 4500 char (0526) | T |
| Seq 4 and up | none in notes; Blood Admiral (Wraith, Seq 5) bounty 42,000 is a bounty, not a price (0752); COI scale: Seq 8 char 15,000 verl d'or, Seq 5 about 200,000 | T; COI scale from deep dive P4 |

### 0.3 Census conflicts (listed, not resolved)

C1 Fool/Error/Door swap rank: Seq 4 (Klein 0700) vs Seq 3 (Azik 0708, checked). C2 Death Spirit Guide rank: Seq 6 (0947, 0150) vs Seq 5 (1113), both checked. C3 Hanged Man Seq 3 gloss: Three-Headed Hall vs Trinity Templar (Chinese checked 1064). C4 Abyss Seq 6/4 English glosses (Devil/Demon) vary; Chinese order fixed, spot-check inconclusive. C5 Ferryman Seq 3: Death line (0933, 1202) vs "Immortal-bird line" (0929). C6 Paragon Seq 1: Civilization Enlightener (1419) vs Illuminator (wiki); slate fragment 1299 unplaced. C7 Swap start rank: "from Seq 5" vs "from Seq 4" in 0146, "Seq 4 and above" in 0205. C8 Fourth member of the Sun swap group: Spectator or Secrets Suppliant (0269 vs 0295). C9 Gloss variants (Hermit 5/4/3, Moon 4/2, White Tower 7, Wheel 2, Error 2, several Seq 1). C10 Error Seq 3 and Twilight Giant Seq 2 names are memory or COI only. C11 Archbishop headcount wording (0096 vs 0168). C12 Name-count method differences (205 vs 195 plus 8 plus 7).

## 1. Fool line (Sefirah Castle group)

**Pathway:** Fool (愚者). **Sequences:** 9 Seer, 8 Clown, 7 Magician, 6 Faceless, 5 Marionettist, 4 Bizarro Sorcerer, 3 Scholar of Yore, 2 Miracle Invoker, 1 Attendant of Mysteries, 0 Fool. All ten named.
**Neighbours/swap:** Error and Door at Seq 3 per Azik (T 0708) or Seq 4 per Klein (I 0700), C1. Seq 4 options named: Door Secrets Sorcerer, Error Parasite (T 0708). Three-way ritual to free Mr. Door needs one demigod of each of Fool, Door, Error (S 1167).
**Holders:** Mystery Order (密修会; Zarathustra and Antigonus families; source of Seq 8 to 4, T 0065); Evernight Church holds only Seq 9 (T 0075); Antigonus notebook (0696). Seq 9 recipe and materials from Nighthawks, Seq 8 after a merit check (0167 to 0170), Seq 7 onward from a killed Mystery Order agent's remains then Tarot Club.
**Acting principle:** Seq 9 "someone who peeks at fate but fears it" (T Cecima 0171). Seq 7 win cheers by deceiving, needs audience feedback (I Klein 0370, 0376). Seq 6 you may pose as anyone but must stay yourself (T 0254, I 0464). Seq 4 digestion slower without audience reaction (I 1061). Others M.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Seer | Lavatan octopus blood, star crystal [S 0031]; 10 ml and 50 g [W game guide, medium] | purified water, night-vanilla juice, golden mint leaves, poison hemlock juice, dragonblood grass powder [S 0031] | none | Nighthawks issue it; Old Neil brews [S 0031] | whispers and urge to destroy right after drinking [S 0032] |
| 8 Clown | adult Honagis grey-goat horn crystal, intact human-face rose [S 0170] | M | none | church after merit check; recipe from Aurora Order case [S 0106 to 0170] | whispers again at promotion [S 0170] |
| 7 Magician | 1 true Mist Treant rhizome, all spinal fluid of an evil-stripe black panther [S 0254] | 60 ml pure water, 30 ml treant sap, 3 g water-gem powder, 4 drops hallucination-herb oil [S 0254] | none | via killed agent [S 0254] | |
| 6 Faceless | mutated pituitary of a thousand-face hunter, skin-shadow characteristic [S 0254] | 80 ml hunter blood, 5 drops black mandrake juice, 10 g dragonblood grass powder, 3 hairs of a deep-sea naga [S 0254] | none seen [I] | main plus blood about 1450 [S 0444]; char sold 3825 [S 0543] | lose "self" and become a monster [T 0254] |
| 5 Marionettist | dust of an ancient wraith, core crystal of a six-winged gargoyle [S 0254] | 80 ml Sunia-island golden spring water, 10 g dragon-pattern bark, wraith's residual spirituality, pair of gargoyle eyes [S 0254] | drink while a mermaid sings at sea [S 0254, 0685] | M | contaminated characteristic poisoned a user [S 0255] |
| 4 Bizarro Sorcerer | main eye of a trick-evil-monster, true soul body of a spirit-world plunderer [S 0871] | 200 ml trick-monster blood, 30 g plunderer dust, 10 g red-hair birch bark, golden grapevine, homemade rubber mask [S 0871] | stage a grand play that kills a demigod [S 0871] | M | six Fool-line abilities fuse here [T 0096, 0700] |
| 3 Scholar of Yore | eyes of a Fugen hound, flocculated heart of a mist-wolf [S 1086] | 100 ml hound blood, 30 g mist-wolf frost crystal, a large amount of true ancient historical records [S 1086] | stay out of reality at least 300 years [S 1086] | M | |
| 2 Miracle Invoker | heart of the Black Wolf of Wishes (a god) or another Miracle Invoker's characteristic [S 1204] | 300 ml wolf blood, 1 Time Worm, 1 Star Worm [S 1204] | bring a lost piece of history into the present era [S 1204] | M | Zarathustra lost control at Seq 1 promotion [T 0733] |
| 1 Attendant | one Attendant characteristic (only 3 exist) [S 1330] | nine spirit-world specialties [S 1330] | found a town of puppets with designed fates [S 1330] | M | |
| 0 Fool | the Fool uniqueness plus two Attendant characteristics [S 1330] | control of at least a quarter of the history fog [S 1330] | fool time, history or fate once [S 1330] | M | |

**Gaps:** Seq 8 aux; Seq 3 to 0 prices; any Seq 5 to 0 price.

## 2. Error line (Sefirah Castle group)

**Pathway:** Error (错误). **Sequences:** 9 Marauder, 8 Swindler, 7 Cryptologist, 6 Prometheus, 5 Dream Stealer, 4 Parasite, 3 **missing** (memory: Mentor of Deceit, C10), 2 Trojan Horse of Destiny (deep dive: of Fate), 1 Worm of Time, 0 Error. Nine named.
**Neighbours/swap:** Fool and Door, Seq 3 or 4 (C1); Seq 4 Parasite named as Azik's option [T 0708].
**Holders:** Soroaster family (Mobert, an angel in Leonard, T 0717, 0628); Fate Hermits' gathering as market for ability-stealing items (I 0612). No church.
**Acting principle:** none stated. Seq 4 Parasite "offers knowledge, formulas and benefits as bait" is an ability note, not acting [S 0880].

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 0 | M (never printed in any note) | M | M | M; Hazel got a promotion chance via Hanged Man and Tarot contacts [T 1034]; Klein hunts Seq 4 demigods (Bizarro Sorcerer, Parasite, Secrets Sorcerer) for a characteristic [S 1365, 1390] | Worm of Time is both a mythical twelve-ringed worm and a potion name, usable as sacrifice or spell material [T 0401, 0635]; Amon's parasitism spreads copies [S 1015] |

**Gaps:** the entire line has zero formula data in the notes. Seq 3 name.

## 3. Door line (Sefirah Castle group)

**Pathway:** Door (门). **Sequences:** 9 Apprentice, 8 Trickmaster, 7 Astrologer, 6 Scribe, 5 Traveler, 4 Secrets Sorcerer, 3 Wanderer, 2 Planeswalker, 1 Key of Stars, 0 Door. All ten named.
**Neighbours/swap:** Fool and Error (C1). **Holders:** Abraham family, later Tamara family (T 0341, 1108); Gnosis Society has Apprentice and Trickmaster (T 0402); Aurora Order priest Louis Vane is Scribe/Traveler (0699). Formulas revealed by the Abraham family to descendants, Traveler characteristic can be consumed (T 1108).
**Acting principle:** none stated. Drinking at full moon exposes the drinker to Mr. Door's whispers (I 0341).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Apprentice | a dead Beyonder's characteristic (Fors used Anelisa's) [T 0341, S 0411] | amounts elided in Abraham diary [M] | none | M | full-moon whispers [I 0341] |
| 8 Trickmaster | spirit-eater stomach, 20 ml deep-sea marlin blood [S 0350] | 5 ml hornbeam oil, 10 g thread-ball grass powder, 1 red chestnut flower, 80 ml pure water [S 0350] | none | Seq 8 formula 450 at Tarot Club [S 0350] | |
| 7 Astrologer | meteoric crystal, Lavatan octopus blood crystal [T Fors 0700] | M | none | 600 each via Tarot Club, 60 g meteoric crystal [T 0700] | "slightly like a stronger Seer recipe" [I 0700]; Lavatan octopus also in Seer 9 |
| 6 Scribe | ancient-wraith curse item [T 1228], plus a dream-related material (unnamed) | M | M | M | |
| 5 Traveler | a Traveler characteristic replaces main [T 1108] | in a Traveler's pack [T 1108] | exists, content M [T 1221] | M | digest within about half a year or lose spirituality [T 1108] |
| 4 Secrets Sorcerer | M | M | seal a hostile demigod-tier creature, better with less outside help [T 1333] | M | hostile Secrets Sorcerer demigods exist [S 1230] |
| 3 Wanderer | M | M | M | M | |
| 2 Planeswalker | main M | Star Worm, Time Worm, Spirit-Body Worm [T 1242] | leave a legend in nine places beyond this planet [T 1242] | M | star pollution risk [I 1243] |
| 1, 0 | M | M | M | M | Seq 0 is Mr. Door (Bertel Abraham) trying to ascend [S 1393] |

**Gaps:** Seq 9, 7 aux; Seq 6 main in full; every Seq 4 and above material; Seq 5 ritual content.

## 4. Visionary line (Chaos Sea group)

**Pathway:** Visionary (空想家). **Sequences:** 9 Spectator, 8 Telepathist, 7 Psychiatrist, 6 Hypnotist, 5 Dreamwalker, 4 Manipulator, 3 Dream Weaver, 2 Discerner, 1 Author, 0 Visionary. All ten named.
**Neighbours/swap:** Sun, Tyrant, White Tower, Hanged Man at Seq 4 (T 1136); C8 on whether Spectator or Hanged Man is the fourth member of the Sun group in 0269 and 0295. **Holders:** Psychology Alchemists (hold many Spectator-line formulas, T Alger 0060; president Barros Hopkins, 1085); the old "Old Organization" lets members choose Bard, Sailor, Reader or Spectator lines (T 0269); Twilight Hermit Order (Adam, Hermes, 0788). Routes: Alger trades (0006, 0034), Tarot Club (0160, 0700).
**Acting principle:** Seq 9 be an absolutely neutral spectator, never an actor (T Alger 0035, 0034); a dog digested it by watching (S 0299). Seq 7 counsel people's troubles, "psychiatrist rules" (S 0650, 0734). Seq 5 acting uses own subconscious (I 1214). Others M.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Spectator | pair of adult Manhar-fish eyes, 35 ml horn-black-fish blood [T Alger 0034] | 80 ml purified water, 5 drops meadow-saffron essence, 13 g ox-tooth peony powder, 7 elf flowers [T 0034] | none | Alger asked 100 ml ghost shark blood as fee [T 0006] | emotional involvement skews perception [T 0035] |
| 8 Telepathist | complete pituitary of an adult rainbow-lizard dragon, 10 ml Farsman rabbit spinal fluid [S 0157] | 5 g chestnut buds, 8 g dragonblood grass powder, 3 pure-white elf flowers, 100 ml pure water [S 0157] | none | M | |
| 7 Psychiatrist | Elder Tree fruit [I 0706] or heart of a sealed controllable creature [I 0188] | M | none | char 1200 to 1500 [T 0582]; Audrey offers a formula as fee [T 0270] | |
| 6 Hypnotist | young mind dragon pituitary, or 60 ml black-hunt monitor lizard spinal fluid plus wind-bell tree fruit [T 0700] | M; wiki lists Mind Dragon blood 100 ml or Dream Catcher blood 90 ml [W, low] | none seen | 1500 to 2000 [T 0700] | |
| 5 Dreamwalker | dream-catcher heart plus mind-phantom crystal, or adult mind dragon brain [S 1045] | M | contract a spirit-world harpy, drink with its tail feather in intense joy or anger so an outside pull prevents sleeping forever [S 1045] | M | |
| 4 Manipulator | whole brain of an old mind dragon, or crystallized Treant mentor heart, or a Manipulator characteristic [T 1085] | 80 ml old mind-dragon blood, 3 golden treant leaves, one tear from each of seven humanoids in strong emotion [T 1085] | drink within a gathering of at least 10,000 amid their resonance [T 1085] | M | |
| 3, 2, 1, 0 | M (Hewin does not know them) | M | M | M | Adam is the Visionary uniqueness holder (I 0788) |

**Gaps:** Seq 7 aux and exact main; Seq 6 and 5 aux; Seq 3 and above entirely.

## 5. Sun line (Chaos Sea group)

**Pathway:** Sun (太阳). **Sequences:** 9 Bard, 8 Light Supplicant, 7 Solar High Priest, 6 Notary, 5 Priest of Light, 4 Unshadowed, 3 Justice Mentor, 2 Lightseeker (author's note only), 1 Pure White Angel (inferred), 0 Sun. All ten named, two inferred.
**Neighbours/swap:** Tyrant, White Tower, Visionary, Hanged Man at Seq 4 (T 1136, I 0269, 0295). **Holders:** Church of the Eternal Blazing Sun (Intis; holds the line, contracts a god, 0254, 0269); Silver City's ancient Sun creator (0839). Klein divined Seq 9 to 4 formulas from the church's presence (0142). Derrick Berg ("Sun") is the worked example.
**Acting principle:** Seq 9 motto "Let us praise the Sun" (T 0142). Seq 6 notarize validly or the boost disperses (T 0254, ability note). Others M.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Bard | crystal sunflower, OR fire-stone-bird or arson-bird tail feather, OR siren stone, OR singing mallow [S 0146, 0142] | 1 midsummer grass, 5 drops July-wine juice, 1 elf dark leaf [S 0146] | none | Alger could source Seq 9 [T 0146] | |
| 8 Light Supplicant | radiant stone, OR white-hot soul powder, OR mirror-hedgehog blood, OR lava-troll heart [S 0142] | 1 gold-edge sunflower, 3 drops aconite juice [S 0142] | none | | |
| 7 Solar High Priest | red crown of a dawn rooster, fruit of a radiant covenant tree [S 0527] | 100 ml rooster blood, 10 drops Sun oil, 8 g golden bergamot powder, 5 g solidified lava [S 0527] | none | main about 2000 [S 0527] | |
| 6 Notary | crystal rhizome of an Elder Tree, 5 tail feathers of a covenant bird [S 0706] | 100 ml radiant covenant tree sap, 1 gold-edge sunflower, 1 white-edge sunflower, 5 drops water-fern juice [S 0706] | none | | Elder Tree also in Spectator 7 (I 0706) |
| 5 Priest of Light | red crown of the dawn rooster king, 1 pure-white radiant stone [S 0706] | 5 g rosemary, 7 drops golden bergamot juice, 10 ml rock water, 60 ml rooster-king blood [S 0706] | bury the whole body in non-melting ice in pure darkness, then drink [S 0706] | | Klein: demigod formulas are issued with the rite (I 0706) |
| 4 Unshadowed | one drop of Sun god blood, OR 3 tail feathers of an adult sun-bird plus a holy radiant stone [S 1064] | 60 ml sun-bird blood, 30 ml holy radiant-stone fluid, 7 drops mutated golden bergamot juice, 10 g magma-heart powder [S 1064] | extract the strongest emotion you refuse to give up, drink, pour it back during the process [S 1064] | church supplies directly [T 0161]; Klein sold a partial formula [S 0294] | |
| 3, 2, 1, 0 | M | M | M | M | |

**Gaps:** Seq 9 to 5 prices except Seq 7 main; all Seq 3 and above. This line has the longest complete chain with aux (Seq 9 to 4).

## 6. Tyrant line (Chaos Sea group)

**Pathway:** Tyrant (暴君). **Sequences:** 9 Sailor, 8 Folk of Rage, 7 Navigator, 6 Wind-blessed, 5 Ocean Songster, 4 Cataclysmic Interrer, 3 Sea King, 2 Calamity (author's note), 1 Thunder God, 0 Tyrant. All ten named.
**Neighbours/swap:** Sun group at Seq 4 (T 1136). **Holders:** Church of the Storm (Lord of Storms; supplies, 0740, 0460); pirates (Five Seas King Nast; Gohrinam the Calamity Queen angel, 0625); Mandated Punishers (0540). Alger Wilson is the worked example (Seq 9 to 5). Twilight Hermit Order prefers Sailor, Reader, Sun (I 0839).
**Acting principle:** none stated.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Sailor | probably merfolk parts [I 0504] | M | none | black market and Storm Church [T] | |
| 8, 7 | M | M | none | M | |
| 6 Wind-blessed | 6 crystal feathers of a blue-shadow falcon, pair of dragon-eye sea eagle eyes [S 0460] | M | none | about 2500 plus a golden mask [S 0460] | |
| 5 Ocean Songster | a siren characteristic [T Klein 0723] | M | drink inside an Obnis (ancient three-headed sea monster), mostly tamed by the Storm Church [S 0740] | killed-for-characteristic route [S 0723] | characteristic leaves residual spirit [T 0723] |
| 4 Cataclysmic Interrer | recipe seen, not printed [M 0839] | M | drink amid earthquakes and tsunamis you provoke and survive [I 0839] | Mr A requested it as a Seq 4 recipe [T 0247] | |
| 0 Tyrant | M | M | fear of hundreds of thousands, fight a true god and survive, drink in the atmosphere of fear [I 0839] | | |
| 3, 2, 1 | M | M | M | M | |

**Gaps:** Seq 9 to 7 main and aux; Seq 6 aux; every Seq 4 and above material.

## 7. White Tower line (Chaos Sea group)

**Pathway:** White Tower (白塔). **Sequences:** 9 Reader, 8 **missing** (memory: Student of Ratiocination, deep dive C), 7 Detective/Knowledge Keeper (C9), 6 Polymath, 5 **missing** (deep dive C: Mysticism Magister), 4 Prophet, 3 Cognizer (W ch.279), 2 **missing** (deep dive C: Wisdom Angel), 1 All-Knowing Eye (I), 0 White Tower. Seven named by any label.
**Neighbours/swap:** Sun group at Seq 4 (T 1136). Not swappable with Hermit or Paragon (T Roselle 0735). **Holders:** Church of Knowledge and Wisdom (0427, 1162); the Old Organization (0269); Knowledge-church Prophet demigod (1162). Edwina Edwards is a Seq 5 Reader who mimics seen abilities (T 0540).
**Acting principle:** none stated; Seq 9 is described as ideal for sharp rigorous reasoning (T 0437).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 0 | M (no ingredient in any note) | M | M | M; church supplies [T] | Polymath potion easily causes loss of control [T Eisengard 0427] |

**Gaps:** the entire line has zero formula data; three Sequence names missing.

## 8. Hanged Man line (Chaos Sea group)

**Pathway:** Hanged Man (倒吊人). **Sequences:** 9 Secrets Suppliant, 8 Listener, 7 Shadow Ascetic, 6 Rose Bishop, 5 Shepherd, 4 Black Knight, 3 Trinity Templar (C3), 2 **missing** (deep dive C: Profane Presbyter), 1 Dark Angel (I), 0 Hanged Man. Eight named by notes, one inferred.
**Neighbours/swap:** Sun group at Seq 4 (T 1136); Audrey dismisses the Seq 4 swap as unusable for her. **Holders:** Aurora Order (terrorist, worships the True Creator, 0105); Silver City keeps the line up to Seq 5 (T Derrick 0140). Mr. A and Lovia are worked examples.
**Acting principle:** none stated.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 5 | M (wiki says some rows list "or a matching characteristic" [W, medium]) | M | M | M | Listener: every Listener is secretly mad, survives about five years if not promoted [T 0105]; veterans warp and lose control easily [T 0105] |
| 4 Black Knight | M | M | materials and ritual prepared by Lovia, contents M [T 1252] | M | |
| 3 to 0 | M | M | M | M | Shepherd keeps multiple demigod flocks only at Seq 3 [T 1230] |

**Gaps:** zero formula data; one name missing.

## 9. Darkness line (River of Eternal Darkness group)

**Pathway:** Darkness (黑暗; text mostly says Night 黑夜). **Sequences:** 9 Sleepless, 8 Midnight Poet (I), 7 Nightmare, 6 Soul Assurer, 5 Spirit Warlock, 4 Nightwatcher, 3 Horror Bishop, 2 Servant of Concealment, 1 Knight of Misfortune, 0 Darkness. All ten named, one inferred.
**Neighbours/swap:** Death and Twilight Giant (T 0146, 0205, 0222); cross-group a Sleepless demigod can go to Demoness (T Adam 1388); at Seq 2 an angel may convert to Seq 1 of Twilight Giant or Death (I 1433). Swap rank C7.
**Holders:** Church of Evernight holds the complete line, Seq 9 to 7 is open staff knowledge (T 0022, 0028); War God Church had a Soul Assurer (S 0561); Nighthawks. Staff must accumulate merit first (0028).
**Acting principle (hints only):** Seq 6 mass spirit-calming work, Leonard spent months calming Backlund ghosts (S 1101, 1009). Seq 5 Leonard writes his own rules (S 1435). Seq 4 act the Nightwatcher on missions (S 1311). Others M.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 5 | M (no numbers in any note) | M | M | M; church issues after merit | Seq 9: first-day loss of strength control, needs 2 to 4 h sleep [T 0022, 0045]; Dunn memory loss and dream blur "Nightmare's style" [T 0119] |
| 4 Nightwatcher | M | Ince's route: leftover Death-descendant characteristic, Saint Selina's ashes [S 0212] | that route is a one-off swap from Death Seq 5 [S 0212, I 0214] | Leonard's ancestor spirit does not know the formula [T 1068] | Dunn took 3, 9, 3+ years across the first three potions [T 0096] |
| 3 to 0 | M | M | M | M | |

**Gaps:** zero formula data for the pathway the Tingen Nighthawks are on. Note LMC1 says only the Seer supply loop is live in code.

## 10. Death line (River of Eternal Darkness group)

**Pathway:** Death (死神). **Sequences:** 9 Corpse Collector, 8 Gravedigger, 7 Spirit Medium, 6 Spirit Guide/Necromancer (C2), 5 Gatekeeper, 4 Undying, 3 Ferryman (C5), 2 Death Consul, 1 Pale Emperor, 0 Death. All ten named.
**Neighbours/swap:** Darkness and Twilight Giant; example Gatekeeper to Demon Hunter (T 0222) or to Nightwatcher (S 0212). **Holders:** Evernight Church to at least Seq 4 (T 0147); War God Church and the Spirit Sect hold Seq 9 (T 0278); Artificial Death faction (1046, 1113). Evernight holds the Death uniqueness too (I 1413).
**Acting principle:** Dai's route is cited as a summary (T 0144 to 0150) but its content is M in the notes.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Corpse Collector | dried adult black-spotted frog [T Neil 0033] | M | none | formula 230, frog 170 [S 0128, T 0278] | "needs courage to drink" [T 0033]; Dai got special approval after 1 year [T 0096] |
| 8 to 5 | M | M | none | M | Gatekeeper holds a mini underworld that stores wraiths [T 0947, 0962] |
| 4 Undying | M | M | M | M | dies and returns about every 60 years, loses memory [T 0603, 0483] |
| 3 Ferryman | M | M | a tomb as special requirement [I Klein 0222] | M | Silver City's former chief failed, became a monster [T 0929] |
| 2, 1, 0 | M | M | M | M | |

**Gaps:** Seq 8 and above formula; Seq 4 ritual.

## 11. Twilight Giant line (River of Eternal Darkness group)

**Pathway:** Twilight Giant (黄昏巨人). **Sequences:** 9 Warrior, 8 Pugilist, 7 Weapon Master, 6 Dawn Paladin, 5 Guardian, 4 Demon Hunter, 3 Silver Knight, 2 **missing** (memory or COI: Glory, C10), 1 Hand of God, 0 Twilight Giant. Nine named. Silver City uses different names at 9 and 8 (Extraordinary Warrior, Gladiator; T 0140).
**Neighbours/swap:** Darkness and Death (T 0205, 0222). **Holders:** War God Church (full line); Silver City (to Seq 4, Seq 3 as characteristics only, T 0140, 1296); Earth Mother bishop Utravsky was a Dawn Paladin (0311). Monsters in the dark drop formulas (Klein's remark, 0140). Evernight holds the Giant uniqueness (I 1413).
**Acting principle:** none stated.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 4 | M; Seq 5 main makes a stone-monster core [T 0671] | M | M | Pugilist char about 600 to 700 [S 0656, 0694]; a Warrior formula offered at a pirate gathering with no buyer [S 0575] | Silver City lacks formulas above Seq 4 for generations [T 0929, 1146] |
| 3 Silver Knight | main may be replaced by a characteristic [T 1155] | M | altar with the remains of six strong creatures you hunted yourself, plus a god's or angel's blessing [T Mirgon 1155] | M | |
| 2, 1, 0 | M | M | M | M | |

**Gaps:** zero named ingredients; Seq 2 name.

## 12. Red Priest line (City of Calamity group)

**Pathway:** Red Priest (红祭司). **Sequences:** 9 Hunter, 8 Provoker, 7 Pyromaniac, 6 Conspirer, 5 Reaper, 4 Iron-Blooded Knight, 3 War Bishop, 2 Weather Warlock, 1 Conqueror, 0 Red Priest. All ten named. (COI has a complete 9 to 2 chain; not in the LOTM notes.)
**Neighbours/swap:** Demoness (T 1136); Demoness Seq 5 can go to Iron-Blooded Knight (I 0797). Cross-group Darkness group (W). **Holders:** Intis (Soren family), Fusac (Einhorn house), Iron-Blood Cross Order (0202, 0239, 0467); Danitz's captain held the Conspirer formula (S 0624).
**Acting principle:** Seq 9 "everyone is both prey and hunter": traps, weapons, specialty (T Night Watch 0202, T Danitz 0564, I Klein 0237). Seq 7 re-act Hunter, Provoker, Pyromaniac in order to stay safe (T Anderson 0727).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Hunter | two crimson "jelly" characteristic substitutes; each Seq 9 main 50 to 200, about 400 total [I Klein 0243] | M | none | Becklan supplied it to gang boss Morse [S 0237] | Morse missed the essence by not setting traps [T] |
| 8, 7 | M | M | none | M | Pyromaniac: Danitz nearly lost control, strong digestion pain [S 0566] |
| 6 Conspirer | M | M | M | killing Becklan (Seq 6) cost over 10,000 [S 0624] | |
| 4 Iron-Blooded Knight | M | "ritual and auxiliary materials" needed [T 1070, 1073] | exists, content M | M | |
| 0 Red Priest | M | M | start and win a continent-sweeping war decisively [S 0978] | | |

**Gaps:** every named ingredient; Seq 4 ritual content; Seq 3 to 1.

## 13. Demoness line (City of Calamity group)

**Pathway:** Demoness (魔女). **Sequences:** 9 Assassin, 8 Instigator, 7 Witch, 6 Pleasure Witch, 5 Affliction Witch, 4 Despair Witch, 3 Unaging Witch, 2 **missing** (deep dive C: Catastrophe), 1 Doomsday (I; deep dive C: Apocalypse), 0 Demoness. Eight named, one inferred.
**Neighbours/swap:** Red Priest (T 1136); a Sleepless demigod can switch to Demoness (T 1388). **Holders:** Witch Cult (upper ranks women, 0066); Gnosis Society uses Assassin and Instigator (0201); the church holds none (S 0202).
**Acting principle:** Seq 9 and 8 hidden common thread: bring disaster, pain, grief (T 0066, 0096). Seq 6 give pleasure to men and women and control them thus; "irresistible pleasure is a form of pain" (T 0202, 0271). Seq 5 digests by blending in and detaching from roles (S 0589 to 0598).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9, 8 | formulas were viewed in Klein's divination but not written [S 0202] | M | none | M | |
| 7 Witch | whole blood of a black-abyss fish, peacock-agate egg [S 0202] | 80 ml pure water, 5 drops golden mandrake juice, 3 shadow lizard scales, 10 drops narcissus juice [S 0202] | gender switch (men become women) is a body effect, not a rite [S 0202] | Witch Cult supplies [S 0202] | |
| 6 Pleasure Witch | pair of succubus-siren eyes, 1 adult widow-spider silk gland [S 0202] | 100 ml pure water, 5 drops black mandrake juice, all residual siren hair, 10 g Fenebot fly powder, 5 g true mummy ash [S 0202] | none seen | M | |
| 5 to 3 | M | M | M | M | Night church killed a Despair Witch to stop a Primordial Demoness awakening (T 0495) |

**Gaps:** Seq 5 and above entirely; Seq 9 and 8 numbers.

## 14. Paragon line (Knowledge Moor group)

**Pathway:** Paragon (完美者). **Sequences:** 9 Savant, 8 Archaeologist, 7 Appraiser, 6 Artisan, 5 **missing** (memory: Astronomer), 4 Alchemist, 3 Arcane Scholar (I), 2 Knowledge Magister (W, author WeChat), 1 Civilization Enlightener or Illuminator (C6), 0 Paragon. Seven named by notes.
**Neighbours/swap:** Hermit (T 0146, 0735, 1136); Roselle swapped Savant line to Hermit at Seq 1; White Tower excluded. **Holders:** Church of Steam and Machinery owns the complete line (T 0147); Tingen Machinery team. Seq 7 holder: university president Mormont (1312).
**Acting principle:** Seq 9 live as the Savant, study and apply; the whispers and temper calm (T Roselle 0059). Others M.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 5 | M (no quantities or ingredients in any note) | M | M | church supplies; 4500 char plus 1000 craft made a 5500 mask [T 0526] | Seq 9 lower spirituality gain [T] |
| 4 Alchemist | M | M | drain a whole region's vitality (soil to sand, lakes dry) [T Roselle 0472] | M | |
| 3 to 0 | M | M | M | M | "Artisan God" took Seq 1 and 0 while undigested [T 1419] |

**Gaps:** zero formula data for the pathway the Machinery team would start on.

## 15. Hermit line (Knowledge Moor group)

**Pathway:** Hermit (隐者; Seq 0 potion Concealed Sage 隐匿贤者, S 1349). **Sequences:** 9 Mystery Pryer, 8 **missing** (church file blank; deep dive C: Melee Scholar), 7 Warlock, 6 Scroll Professor, 5 Astrologer, 4 Occultist, 3 Prophecy Master, 2 Sage, 1 Knowledge Emperor, 0 Concealed Sage. Nine named; gloss variants C9.
**Neighbours/swap:** Paragon; not White Tower (T 0735). **Holders:** Moses Ascetic Order originated it (five years of silence, 0028, 0094); Evernight holds Seq 9 and 7 names only; Steam Church "fairly complete" (0147); Elemental Dawn and Gaderia hold higher formulas (0632, 1363). Church acquired the formula from the Moses Order (T 0028).
**Acting principle:** the motto "do as you please but do no harm" (T 0028). Must stay reverent (T 0028).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 6 | M | M | none | M | |
| 4 Occultist | M | M | fully analyze one drop of mythical-creature blood (choice shifts specialty; Gaderia used Fate Serpent blood) [S 1229] | M | most danger-prone Seq 4, sees what should not be seen [S 1229] |
| 3 Prophecy Master | M; needs a Seq 3 characteristic [S 1207] | M | M | formula from the Moses Order [S 1207] | Fate Serpent blood makes it easier [S 1207] |
| 1 Knowledge Emperor | a purified "0"-grade artifact characteristic [S 1137] | M | refine a grade-0 artifact into a Seq 1 characteristic, ritual smooth [S 1137] | M | Seq 1 seat probably empty because the Seq 0 was a concept [I 0734] |
| 0 | M | M | M | | Seq 0 can influence same-pathway lower ranks [S 1349] |

**Gaps:** every named ingredient; Seq 8 name.

## 16. Mother line (Brood Hive group, wiki-assigned)

**Pathway:** Mother (母亲); Seq 0 potion name never given. **Sequences:** 9 Planter, 8 Doctor, 7 Harvest Priest, 6 Biologist, 5 Druid, 4 Classical Alchemist, 3 Pallbearer, 2 Desolate Matriarch, 1 Naturewalker, 0 Mother (label only). All named; Seq 0 potion name M.
**Neighbours/swap:** Moon at high Seq (T 1136; Seq 5 to 4 inferred); with Moon an outer-god-derived pair, "easily polluted" (T 1361, 1363); Chaos Primogenitor wiki neighbour (W).
**Holders:** Church of Earth Mother (Backlund Harvest Church, 0306); Silver City trades Mother-line formulas via Klein's circle (S 1110, 1165, 1168). Silver City's six-man council gave the Classical Alchemist formula as payment for farming knowledge (S 1165 to 1169).
**Acting principle:** Druid ritual built from writing out accumulated knowledge and experience (T 1133).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 6 | M | M | none | M | |
| 5 Druid | M | M | write out accumulated knowledge and experience [T 1133] | formula 5000, characteristic 8000 [T 1121, 0847] | Frank wanted to skip the rite and drink; Gardelia stopped him [S 1133]; catalysts needed [T 1121] |
| 4 Classical Alchemist | M | M | M | formula from Silver City council [S 1165] | |
| 3 to 0 | M | M | M | M | |

**Gaps:** zero named ingredients anywhere in the pathway.

## 17. Moon line (Brood Hive group, wiki-assigned)

**Pathway:** Moon (月亮); Seq 0 potion name never given. **Sequences:** 9 Apothecary, 8 Beast Trainer, 7 Vampire (the 0610 list skips it), 6 Potions Professor, 5 Scarlet Scholar, 4 Witch-King, 3 Summoner Master (W: High Summoner), 2 Creator, 1 Beauty God, 0 Moon. All named. Titles double as clan ranks (W): Baron 6, Viscount 5, Count 4, Marquis 3, Duke 2, Queen 1, True Ancestor 0.
**Neighbours/swap:** Mother (T 1136); vampires dislike switching, it means losing identity (T 1136).
**Holders:** vampire clan under Marquis Nibus (0610, 1255); Church of Earth Mother (partial, T 0243); Life School and the Church both hold Apothecary parts (T 0240, 0259, 0627); Rose School (artificial vampires, Witch-King Karaman, 1272). Greenlint and Dakewell are Apothecary examples.
**Acting principle:** Seq 5 sincerely love, worship and study the Moon (T 1039). Seq 6 Emlyn taught herbology and brewed special potions at the church (T 1039).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Apothecary | M | M | none | formula 300 [I Forth 0318]; Harvest Church bishop gives one for a task [T 0306] | |
| 8 Beast Trainer | elf-spring marrow crystal [I Dakewell story 0259, 0306] | M | none | Klein sold the crystal for 300 plus a formula clue [S 0306]; listed 300 to 400 elsewhere [S 0295] | |
| 7 Vampire | vampire blood essence [T Emlyn 0430] | M | none; Baron needs an inheritance rite or the aux materials [T 0607] | M | natural vampires hate artificial ones because of the blood essence [T 0430] |
| 6 Potions Professor | M | carries many aux items [S 0626] | none | M | |
| 5 Scarlet Scholar | M | M | under a full moon, with metals and gems standing for moon phases, plus blood of supernatural creatures; clan elite performed it free [T narration 1039] | M | |
| 4 Witch-King | M | M | semi-god approval and a rite; characteristic supply is the bottleneck [T 1039, 1255] | no free Count characteristic in the clan; Emlyn is 12th in line [T 1255] | |
| 3 to 0 | M | M | M | M | |

**Gaps:** every aux and every main above Seq 7.

## 18. Black Emperor line (Nation of Disorder group, wiki-assigned)

**Pathway:** Black Emperor (黑皇帝). **Sequences:** 9 Lawyer, 8 Barbarian, 7 Briber, 6 Baron of Corruption, 5 Mentor of Disorder, 4 Earl of the Fallen, 3 Frenzied Mage, 2 Duke of Entropy, 1 Prince Who Slays Order, 0 Black Emperor. All ten named, shown on the Blasphemy Card (S 0327).
**Neighbours/swap:** Justiciar (T 1136); Hugh (Arbiter) reasons she could jump at Seq 5 (I 1136); Earl can imitate some Arbiter effects (T 1055). Outer-god derived with Chaos Mist (T 1361).
**Holders:** Rune Military Intelligence Division 9 (Cernas Colgg, Seq 4 Earl, 1055); pirates (Nast Seq 3, I 0929; Misore Seq 6, 0614); Fourth-Epoch dynasties Solomon, Tudor, Trensost kept Solomonic style because of the acting (I 0263). The Fool holds the Blasphemy Card, with a sensing link to the high-sequence materials (T Roselle 0327).
**Acting principle:** the pathway grows into "the shadow of order": rules must look lawful on their face (T Klein from card 0327); Seq 8 "what law cannot solve goes to force, another kind of rule" (S 0327). Detailed principle per Sequence M.

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 Lawyer | M (sheet elided on card) | M | none | M | |
| 8 Barbarian | 1 mad-grass plant, 1 earth-rhino solid horn crystal [S 0339] | 1 deep-pattern walnut, 1 lemon balm, 10 ml poplar-bark hydrosol, 100 ml strong liquor [S 0339] | none | formula as currency, weapons 450 to 520 or one formula [S 0243, 0278] | |
| 7 Briber | 1 weeping-baby flower, 1 odd-face cannabis crystal [S 0350] | 5 drops golden mandrake juice, 5 drops black mandrake juice, 4 drops hallucination-herb oil, 80 ml red wine [S 0350] | none | about 800; Klein got 900 [S 0350] | |
| 6 Baron | M (sheet elided) | M | none | M | |
| 5 Mentor of Disorder | M | M | M | char 8000, plus 1500 to craft into a glove [S 0846] | glove flaws: mind darkens toward shortcuts, confusion after 3 minutes [S 0853] |
| 4 Earl | M | M | M | M | |
| 0 Black Emperor | main includes the characteristics of two other living Seq 1 "Princes" [S 0412] | M | own a kingdom; make your name and "emperor" common knowledge; set up a strict, deliberately abnormal rule set; have the populace secretly build nine pyramid-like tombs; drink inside one tomb during simultaneous mass sacrificial rites [T card 0327] | | cannot truly die until all nine tombs fall; King George III shown mid-ritual, collapsed when one tomb was destroyed [S 1179 to 1189] |
| 3, 2, 1 | M | M | M | M | |

**Gaps:** Seq 9 and 6 sheets; every Seq 5 and above ingredient; Seq 5, 4, 3 rites.

## 19. Justiciar line (Nation of Disorder group, wiki-assigned)

**Pathway:** Justiciar (审判者); Seq 0 potion name never given. **Sequences:** 9 Arbiter, 8 Sheriff, 7 Interrogator, 6 Judge, 5 Disciplinary Paladin, 4 Imperative Mage, 3 Chaos Hunter (I, pathway not stated in text), 2 Balancer, 1 Hand of Order, 0 Justiciar. All named; Seq 0 potion name M.
**Neighbours/swap:** Black Emperor (T 1136). **Holders:** royal houses Augustus (Rune) and Castiya (Feynapotter), military, old nobles (T Alger 0114, S 0233); leaked formulas are fragments, one or two sheets per ruined noble (S 0233). Seq 4 and above formulas granted only by the throne with prepared potion and ritual (I Hugh 1136). Military demigods know the rite and the rough main range, not the aux (I 1136). Storm Church may hold some (I 1067).
**Acting principle:** Hugh digested Arbiter by unconsciously arbitrating disputes (I Audrey 0132); royal houses use it, hence stern authority (I 0114).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 8 Sheriff | fear-worm eyes, silver-white war-bear right palm [T masked man 0235] | M | none | formula 450 (board) [S 0132]; char 600 [T 0403, 0414]; non-standard materials about 300 each [T 0403] | |
| 7 Interrogator | flash-pattern black snake horn, lake-spirit dust [T 0462] | M | none | char 1000 [T 0816] | |
| 6 Judge | a Judge sealed item, shattered and recombined, becomes the main (Gardelia offers one) [T 1067] | M | M | M | |
| 4 Imperative Mage | M | M | Hugh "performs a ritual" (content M); Hugh got Seq 4 through a Fool wish reward [S 1432] | throne grant [I 1136] | |
| 9, 5, 3 to 0 | M | M | M | M | |

**Gaps:** Seq 9 and 6 mains in full; all aux; every rite.

## 20. Abyss line (Tenebrous World group, wiki-assigned)

**Pathway:** Abyss (深渊, also called the Demon pathway 恶魔途径, T 0261, 0296); Seq 0 potion name M. **Sequences:** 9 Criminal, 8 Unwinged Angel (ancient Coldblooded), 7 Serial Killer, 6 Devil (恶魔), 5 Desire Apostle, 4 Demon (魔鬼), 3 Blatherer (W), 2 Bloody Archduke (W), 1 Filthy Monarch, 0 Abyss. Glosses at 6 and 4 swap by translator, C4.
**Neighbours/swap:** Chained (T Gardelia 1136; Medici ghost offers an Abyss Seq 4 formula to Chained Seq 5 Sharon, S 0467). Outer-god derived with the Desire Mother-Tree (T 1361).
**Holders:** Blood-Worshippers (T 0261, 0202); Rose School adjacent.
**Acting principle:** rite of indulging evil desire and sacrificing (I; the Demon trait is pre-emptive vengeance, T 0315). Corruption: members repeatedly sacrifice to high demons, likely incurable (I Klein 0919).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 7 | M | M | none | M | Seq 8 loses conscience; Seq 7 pleases demons with serial murders [T 0261] |
| 6 Devil (to 5) | M | M | "rite of the removed organs": 13 to 49 victims, 3 to 9 days between kills (longer resets the rite), the demon eats the organs; more complete rite means better odds [T Derrick 0296] | M | cruel bloodthirsty fits [T 0315] |
| 4 Demon | M | M | Fountain-of-Youth hoax and mass killings may be part of Agaritu's rite [I 0694] | M | |
| 3 to 0 | M | M | M | M | |

**Gaps:** zero ingredients; the one specified rite is an entry to Seq 5.

## 21. Chained line (Tenebrous World group, wiki-assigned)

**Pathway:** Chained (被缚者, "Aberrant" pathway); Seq 0 potion name M, god title 被缚之神. **Sequences:** 9 Prisoner, 8 Lunatic, 7 Werewolf, 6 Zombie, 5 Wraith, 4 Puppet, 3 Disciple of Silence (W, alt Cursed Artifact), 2 **missing** (deep dive C: Ancient Bane), 1 Abomination (神孽), 0 Chained. Eight named by notes.
**Neighbours/swap:** Abyss (T 1136, S 0467); Seq 5 to 4 is "the key node to become a demigod" (T Medici ghost 0466). **Holders:** Rose School (temperance and indulgence factions, 0335) holds only the starting line; deserters Sharon and Marich cannot easily buy Seq 4 (S 0466). Worships the Bound God, an avatar of the Desire Mother-Tree (T 0647, 0318).
**Acting principle:** restraint. Sharon: the temperance faction suppresses desire; Klein thinks restraint fits the Prisoner acting (T 0335, I). Heart is the body's prisoner, the body is the world's prisoner (T Marich 0336, 0318).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 4 | M (wiki Seq 4: Wraith consciousness crystal main; Wraith blood, dust, contaminated water, mirror, nine souls aux [W, medium]) | M | M | characteristics seen as loot: Werewolf (S 0357, 0414), Wraith (S 0532); Blood Admiral bounty 42,000 | each promotion adds a curse that replaces the last: Lunatic instability, Werewolf full red moon, Zombie warm-blood craving, Wraith must absorb a set number of souls on red-moon nights [T 0336]; Werewolf characteristic carries lingering madness [S 0357] |
| 3 to 0 | M | M | M | M | Seq 3 ability "curse source" changes quality [S 1272] |

**Gaps:** zero text ingredients; no rite for any step.

## 22. Wheel of Fortune line (Key of Light group)

**Pathway:** Wheel of Fortune (命运之轮; Seq 0 potion name M). **Sequences:** 9 Monster, 8 Robot, 7 Lucky One, 6 Calamity Priest, 5 Winner, 4 Misfortune Mage (W), 3 Chaoswalker (W), 2 Soothsayer (C9: Prophet or Seer), 1 Snake of Mercury (also Snake of Fate), 0 Wheel of Fortune. Eight named by notes, two wiki-only.
**Neighbours/swap:** none (T Gardelia 1136, who knows because she used the Snake's blood); wiki says only fate-derived outer pathways.
**Holders:** Life School (master and apprentice; holds Monster and part of Apothecary; led by a Snake as chair of a seven-councillor "Fate Council", T 0605); "only the Life School holds the beginning" (T Neil 0068).
**Acting principle:** restraint to manage luck (T narration 0939); a restart clears madness but needs a faith anchor (T Will 0792).

| Seq | Main | Aux | Ritual | Price, source | Loss and notes |
|---|---|---|---|---|---|
| 9 to 4 | M | M | M | M | Lucky One luck is uncontrolled, must stay temperate [S 0939]; luck is conserved and reverses on a delay (ten minutes for combat luck, a month for daily luck) [S Lucky Scale 0752] |
| 1 Snake | M | M | M | M | Snake blood served as Hermit's Seq 4 promotion ingredient for Gardelia; any Seq 1 mythical creature's blood works, Fate-path best [T 1041] |

**Gaps:** zero ingredients, prices or rites.

## 23. Coverage summary

"Formula" counts Sequences where at least a main ingredient is named (S, T or I); "full" is main plus aux. "Acting" counts Sequences with a principle or hint in the notes (stated or inferred, not just an ability description). "Ritual" counts Sequences with rite content in the notes. Counts are mine from the rows above, not a census field. Seq 0 and 1 rows included.

| # | Pathway | Names (of 10) | Formula known | Full (main+aux) | Acting | Ritual content | Price points |
|---|---|---|---|---|---|---|---|
| 1 | Fool | 10 | 10 | 9 | 4 | 6 | 1 (Faceless) |
| 2 | Error | 9 | 0 | 0 | 0 | 0 | 0 |
| 3 | Door | 10 | 5 | 1 | 0 | 2 | 2 |
| 4 | Visionary | 10 | 6 | 3 | 3 | 2 | 3 |
| 5 | Sun | 10 | 6 | 6 | 1 | 2 | 1 |
| 6 | Tyrant | 10 | 3 | 0 | 0 | 3 (two inferred) | 1 |
| 7 | White Tower | 7 | 0 | 0 | 0 | 0 | 0 |
| 8 | Hanged Man | 9 | 0 | 0 | 0 | 0 | 0 |
| 9 | Darkness | 10 | 0 | 0 | 3 hints | 1 (one-off swap) | 0 |
| 10 | Death | 10 | 1 | 0 | 1 (content M) | 1 (inferred) | 1 |
| 11 | Twilight Giant | 9 | 0 | 0 | 0 | 1 | 1 |
| 12 | Red Priest | 10 | 1 (substitute only) | 0 | 2 | 1 | 1 |
| 13 | Demoness | 9 | 2 | 2 | 3 | 0 | 0 |
| 14 | Paragon | 7 | 0 | 0 | 1 | 1 | 1 (mask) |
| 15 | Hermit | 9 | 1 (Seq 1 material) | 0 | 1 | 2 | 0 |
| 16 | Mother | 10 (Seq 0 potion name M) | 0 | 0 | 1 | 1 | 2 |
| 17 | Moon | 10 (Seq 0 potion name M) | 2 | 0 | 2 | 2 | 3 |
| 18 | Black Emperor | 10 | 3 (8, 7, 0 partial) | 2 | 1 (I) | 1 | 3 |
| 19 | Justiciar | 10 (Seq 0 potion name M) | 3 (mains only) | 0 | 1 (I) | 0 (Seq 4 rite exists, content M) | 3 |
| 20 | Abyss | 10 (Seq 0 potion name M) | 0 | 0 | 2 | 1 (plus 1 inferred) | 0 |
| 21 | Chained | 9 | 0 | 0 | 1 | 0 | 0 |
| 22 | Wheel of Fortune | 10 (Seq 0 potion name M) | 0 | 0 | 1 | 0 | 0 |

Totals: formula known 43 of 220 Sequence slots, full formula 23 (census has 63 formula rows because it splits main and aux into separate rows). Eight pathways have no named ingredient anywhere (Error, White Tower, Hanged Man, Darkness, Twilight Giant, Abyss, Chained, Wheel of Fortune). Seq 9 formula price is missing for 20 of 22 pathways (only Corpse Collector 230 and an inferred Apothecary 300). Known ingredients stop at Seq 4 for every pathway except Fool (Seq 3 to 0 materials), plus a Hermit Seq 1 material and a partial Black Emperor Seq 0.

## 24. Game data shape and playable picks

### 24.1 Fields every row needs

L3 designs the loader. These are the facts the notes can actually fill, plus the "unknown" handling they force.

- **Identity:** pathway id, Sequence number, English and Chinese name, name evidence tag (shown, stated, inferred, wiki, missing), alternate names (Silver City names, ancient names, translator glosses) and conflict codes (C1 to C12).
- **Pathway-level (once per pathway):** group (Sefirah group, wiki-sourced), neighbour list with the Sequence at which the swap opens (default 4, conflict C7) and a "no partner" value (Wheel of Fortune), holder organizations by Sequence range, Seq 0 potion name (often missing), outer-god derivation flag (six pathways).
- **Formula:** main[] where each entry has item, optional alternates (an "or" set, each with its own quantity), quantity, and a flag for "same-Sequence characteristic may replace"; aux[] with item and quantity; brew order; evidence tag and locator per field (a row can be main-known, aux-missing); a wiki-only flag for entries outside reader notes.
- **Ritual:** present or absent, entered-Sequence key, condition text, scale marker (solitary, creature-bound, mass-participation, territory, war), special materials, whether an existing alternative route exists (Ince's swap, wish reward), evidence tag. "Ritual exists, content missing" must be a distinct value from "no ritual" (Traveler, Black Knight, Iron-Blooded Knight, Imperative Mage).
- **Acting:** principle text, tag, and about-three-principles slot (the notes give one phrase at most; the COI figure of about three per potion is from C0301).
- **Economy:** formula price, per-material price, characteristic price, price tier, market versus issued, and the source (church issue after merit, Tarot Club trade, Silver City council, underground market, hunted from a dead Beyonder).
- **Risk:** loss-of-control notes (free text plus structured causes: dose, residue, temptation, imprint, pollution, skipping), pre-sign text, digestion time band, and per-row "side effect on drinking" (Seer whispers).
- **Status flags per field:** SHOWN, STATED, WIKI, INFERRED, MISSING, GENERATED (reserved for engine-made fills, per the grammar proposal), so a missing formula is a visible gap and not a silent default.

### 24.2 Picks beyond Tingen

Tingen's current institutions map to Darkness (Nighthawks, Evernight; also Death and Hermit Seq 9 names there), Tyrant (Mandated Punishers, Storm) and Paragon (Machinery team, Steam); LMG21 jurisdiction gives the split. The two cheapest facts to take from this table: the Tingen-native pathways are the thinnest in ingredients (Darkness and Paragon have none), and the best-evidenced chains belong to organizations that are not Tingen churches.

- **First choice for a second playable pathway: Visionary.** Three full formulas (Seq 9, 8, 4), two ritual rows (Dreamwalker, Manipulator), a stated acting principle at Seq 9, a real route into Tingen (Alger trades, Tarot Club, Psychology Alchemists), and it sits in the Sun/Tyrant/White Tower/Hanged Man swap group, so a Seq 4 branch is data-backed.
- **Third: Sun (Bard).** The only line with complete main plus aux for Seq 9 to 4 and two rituals (ice burial, emotion pour-back). Gap: the Church of the Eternal Blazing Sun is an Intis church, not a Tingen one, so access is through the Tarot Club or Derrick's route; acting is a motto only.
- **Tingen-native, thin data: Tyrant.** Storm Church and Mandated Punishers are already in Tingen and the pathway joins the same Seq 4 swap group, but only Seq 6 and 5 have ingredients and Seq 9 to 7 are blank, so it needs the most authoring.
- **Evidence-richest overall: Fool.** Ten Sequences with materials and rites, but it is the protagonist's own line and contends for the single Uniqueness and three Attendants (LMG17, deep dive M4), so it suits a rival or cameo role better than a first alternative.
- **Not yet playable from notes:** Darkness (zero ingredients despite being the Nighthawks' line), Paragon (zero), Error, White Tower, Hanged Man, Chained, Abyss, Wheel of Fortune.

Everything past the table is a proposal. A pass through Hunter, Demoness or Black Emperor adds depth elsewhere: Demoness (Seq 7 and 6 full), Black Emperor (Seq 8 and 7 full plus the only complete Seq 0 ritual) are the best second-tier data after Sun and Visionary.
