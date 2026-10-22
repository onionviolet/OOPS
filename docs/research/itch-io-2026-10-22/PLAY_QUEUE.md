# itch decode wave: play queue, 2026-10-22

Games from the [itch screen](../ITCH_IO_IDLE_SCREEN_2026-10-22.md) and its
batch decodes, kept for possible future play. Weibao asked to record them
alongside the committed research.

Nothing here has been played. Each row names the one thing a play session
should confirm, usually the depth check that static reading could not settle.
The game builds are not in git: they are third-party code with no license or
an incompatible one, and the repo is public. Local copies of the served files,
with hashes, live in the gitignored `private/<slug>/` folders and
[private TRACE](private/TRACE.md). Remote builds change, so compare the hash
before treating a later play as the same build.

Agents playing these use a background or headless browser. Native-only
builds (Windows, Android) need Weibao to download and run them himself.

## Shortlist v2 (2026-10-22, after the genre audits)

Ranked by what a play session would settle for YAIR. All run in a browser.

1. **My Cultivation Sect**: a family and social sim with grudges, rivalry,
   inheritance from both parents and succession.
2. **Kinfolks**: inheritance law, divided land and heirlooms.
3. **EMERGENT - The Heir** (albeus-games): chronic conditions, a health
   ceiling that falls with age, neglect versus burnout. Confirm the "To
   decide" tray with expiring defaults feels like help, not punishment.
4. **DRGN**: bonding rites by temperament, scene memory, companions who
   leave unless bound. Confirm the rite feels like a relationship rather than
   a stat button.
5. **Nine Peaks**: awakening from where servants sleep, deaths charged by
   cause.

Next five: Progress Knight of Shirania (remembered scenes), HUNGERHOLD
(death-cause lessons), Silver Way (faction tiers and rivals, 30 minutes),
Hacksmith (shape as a scored quantity), Condition Unknown (witness
knowledge).

Quick samplers, 15 minutes or less each, one mechanism apiece:

- Runemaster: legal-next runes
- Etsa Djavul: magic conlang
- Tasks of the Spell Looper: opposition recharge
- PokeQuest: priced scouting
- The Path Past The Mountain: instruments instead of a map
- Cartographomancer: map errors
- Monster Ranch: pairing dice
- Grim Brood: hide reading
- Idle Fantasy Shop: acceptance breakdown
- Fivefold Crown: delayed events

The batch files give each game's play check.

## Shortlist v1 (superseded by v2 above, kept for history)

Ranked by what a play session would settle for YAIR. All run in a browser.

1. **My Cultivation Sect.** Its deeper decode found a real family and social
   sim: two-parent inheritance, grudges, rivalries, adult traits, adventures
   with delayed returns, and death followed by succession. It is the closest
   match to YAIR's lives and household. Play to see whether these produce
   stories you notice, or just stay in the numbers.
2. **Kinfolks.** Inheritance law, divided land and heirlooms with a history.
   It has the highest page rating of the set and was updated on 2026-10-21.
   Play through one death and one land division.
3. **Nine Peaks.** Servants who awaken based on where they sleep, deaths
   charged by cause, and a qi field you shape. Play until the first awakening
   and the first neglect death.
4. **Progress Knight of Shirania.** Choices that only appear for scenes you
   lived in an earlier life, and a named keeper of your role thread. Play two
   lives.
5. **HUNGERHOLD.** Each way of dying gives the next life a specific edge, plus
   a succession crisis. Play two deaths by different causes.

Next five, when there is time:

6. **Condition Unknown** (Cook and Smith Nicholls, short PROCJAM game).
   Events travel as noise and per-witness knowledge, and the ending compares
   your diagnosis with the recorded causes.
7. **Hidden Grimoire.** Failure is an ingredient, and each reagent's
   description hints at its pairings.
8. **Qingxuan.** Story windows lapse while you are away. One route takes
   about 1 to 1.5 hours.
9. **Incremortal.** Death is the clock, and instincts persist across lives.
   About 2 hours of content.
10. **Path of the Idle Cultivator.** Long. Skim one tribulation and one law
    choice rather than playing it through.

## Tier A: play first

| Game | Where | Runs as | What play should confirm | Notes |
| --- | --- | --- | --- | --- |
| Nine Peaks | https://charlequin.itch.io/nine-peaks | HTML5, plain JS | A well-housed, fed servant awakens sooner than a neglected one. A neglect death leaves resentment while an old-age death does not. | Report I2 |
| Kinfolks | https://mdawg74.itch.io/kinfolks | HTML5, inline JS | The widow's life estate, then partible land with the buyout and undivided options, and how standing moves for each. Heirloom deed lines grow on each passing. | Report I3 |
| Progress Knight of Shirania | https://wernerina.itch.io/progress-knight-of-shirania | HTML5, plain JS | A remembered scene offers its option only in a life after it was lived. The thread keeper appears at rebirth. | Report I4 |
| Path of the Idle Cultivator | https://wuxiadev.itch.io/idle-cultivation-path (hosted at cultivator-path.com) | HTML5, obfuscated bundle | The tribulation ramp and cash-out. Law depth persisting while the pick resets. The calendar running faster at long lifespans. | Report I1, [BATCH_I1_DEEP](BATCH_I1_DEEP.md) |
| HUNGERHOLD | https://biosicstudios.itch.io/hungerhold | HTML5 | Each death cause gives the next life its specific edge. The succession-crisis formula in play. | [BATCH_SCOUT](BATCH_SCOUT.md) S1 |
| My Cultivation Sect | https://voyagestudio.itch.io/my-cultivation-sect | HTML5, Cocos | Children inherit root, elements and a hidden trait from both parents. Twins, the population cap and adoption. | [BATCH_SECT](BATCH_SECT.md) |
| Incremortal | https://incremortal-dev-sam.itch.io/incremortal | HTML5, Godot | Which values reset at death and which instincts persist. The lethal-task guard. | [BATCH_LIFE_A](BATCH_LIFE_A.md) |
| Qingxuan: Alchemy Hall Cold Case | https://yuhaolin2005.itch.io/qingxuan-volume1 | HTML5 | A story window lapses while away and the miss effect is reported on return. | [BATCH_PROGRESSION](BATCH_PROGRESSION.md) |
| Great Expanse | https://vegros101.itch.io/great-expanse-road-to-immortality | HTML5 + APK | One in-world month per real hour away. Choices never fire while away. Karma carries into the next life. | [BATCH_PROGRESSION](BATCH_PROGRESSION.md) |
| Hidden Grimoire: Idle Alchemy | itch creator `claucas` | HTML5, Flutter | Failed pairs leave residue and a "tried" mark that survives death. The bench names why a combination cannot run. | [BATCH_POTION](BATCH_POTION.md); logic not traced |

## Tier B: play when the related system is next

| Game | Where | Runs as | Confirm | Notes |
| --- | --- | --- | --- | --- |
| Ascending the Dao | https://cygryu.itch.io/ascending-the-dao | HTML5 | Pay-or-gamble breakthrough and the auto-mode exposure cap. Sect promotion stalling on realm. | [BATCH_SECT](BATCH_SECT.md) |
| Patriarch: Murim Idle | https://bebko-ink.itch.io/patriarch-murim-idle | HTML5 | The six-line promotion checklist. | [BATCH_SECT](BATCH_SECT.md) |
| Frostward | https://digitalacresstudios.itch.io/frostward | HTML5 (also Steam) | Housing-driven pairing and births. Orphan, widow and homeless-youth events. | [BATCH_SCOUT](BATCH_SCOUT.md) |
| Peasant to King | https://madmarkiemarc.itch.io/peasant-to-king | HTML5 | Regency and disputed succession settled by gold, court or arms. | [BATCH_SCOUT](BATCH_SCOUT.md) |
| House of Ashes | https://doubleorcrit.itch.io/house-of-ash | HTML5 | An inheritance ruling rewrites both parties' traits and logs. | [BATCH_SCOUT](BATCH_SCOUT.md) |
| Noble: Family Tree Sim | https://extra-nice.itch.io/noble-fts | HTML5, Unity | Role requirements and outcome-usage scene choice. | [BATCH_SCOUT](BATCH_SCOUT.md) |
| Beggar's Life | https://pidroh.itch.io/beggars-life-grand-theft | HTML5, Unity | Paths closing others. Feelings as capped resources. | [BATCH_LIFE_A](BATCH_LIFE_A.md); code not decompiled |
| Lowmoor | https://lilchill-games.itch.io/lowmoor | HTML5 (also Steam) | The away recap, and the legacy upgrade raising the away cap. | [BATCH_LIFE_A](BATCH_LIFE_A.md) |
| Terraformental | https://sh4dowsand.itch.io/terraformental | HTML5, Unity | What crosses the loop, using its "this life, last life, any life" scopes. | [BATCH_LIFE_B](BATCH_LIFE_B.md); names only |
| Surviving Magic Academy as a Demon Lord | https://stripedbutterfly.itch.io/surviving-magic-academy-as-a-demon-lord | HTML5, Unity | The goal planner, banked fast time and its corruption cost. | [BATCH_LIFE_B](BATCH_LIFE_B.md) |
| Ascension Tower (andr3mar) | https://andr3mar.itch.io/ascension-tower | HTML5 + server | Death merchant spending before rebirth. | [BATCH_LIFE_B](BATCH_LIFE_B.md) |
| The Reincarnation System | https://rasmuskoit.itch.io/the-reincarnation-system | HTML5 | A vow must really restrict before it pays. | [BATCH_PROGRESSION](BATCH_PROGRESSION.md) |
| Cycle of the First Dawn | https://doorwatchers.itch.io/cycle-of-the-first-dawn | HTML5 | Investigation prerequisites. Journal and atlas across lives. | [BATCH_PROGRESSION](BATCH_PROGRESSION.md) |
| Drifting Cloud Chronicles | https://mdoge00.itch.io/drifting-cloud-chronicles-idle-incremental-rpg | HTML5 | The kept-versus-reset dialog, and whether territory bonuses really persist. | [BATCH_SECT](BATCH_SECT.md) |
| Tụ Linh Quyết | https://shuushine.itch.io/tu-linh-quyet | HTML5, obfuscated | The rebirth retention shop. | [BATCH_CULT_REST](BATCH_CULT_REST.md) |
| Ninefold | https://shibaki-dev.itch.io/ninefold | HTML5, closed test | The no-loss absence promise. Bed ripening. | [BATCH_CULT_REST](BATCH_CULT_REST.md) |
| Seedship (Space Goblin Games) | itch build `html/18244111` | HTML5, Twine | Falling counters that drive events and the ending. | [BATCH_PROCGEN](BATCH_PROCGEN.md) |
| CHROMA: The Apprentice's Workshop | itch creator `seshu` | HTML5, Godot | Names that encode composition. The plan-versus-batch journal. | [BATCH_POTION](BATCH_POTION.md) |

## Tier C: decoded, lower priority

Play only for a narrow question:

- **Sect batch:** 开宗立派 P0, Xianxia Sect Simulator, Office Immortal (MIT)
- **Progression batch:** Heavenly Path Idle, Immortal Ascension, Ascendant
  Dao, Peak Cultivator (obfuscated, unread)
- **Remaining cultivation:** Idle Xanxia, Ascension Tower (hopefuloftech),
  Cultivation Genesis, A Mortal's Path of Cultivation, Quest of Qinghe
- **Life sim:** ONE CLICK ONE YEAR, Lifeidle, Town Tycoon, God of Ashes,
  Existence Simulator (GPLv3, source on GitHub), ReCycler, Simultree, A Dark
  Cave, Cyberpunk Life, Slime Reborn, Trader Life
- **Potion:** Potion Brew Shop, Alchemica, Corpus et Spiritus
- **Procedural:** Signal Garden, You wake up in a new town
- **Scout:** Pegs & Bones, Colony Adventure, Midnight Idle, Ensis IDLE

Each batch file has the build identity and locators.

## Open-source generators (run locally, not played)

These have readable source under MIT and can be run as tools:

- [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator)
- Eigengrau's Essential Establishment Generator (`ryceg`)
- Talk of the Town (James Ryan)

Details are in [BATCH_PROCGEN](BATCH_PROCGEN.md).

## Not yet decoded but worth a session

- Heirdeep (`senaris`, page slug `emberfall`)
- Mos Maiorum and Labor Omnia Vincit (multi-generation houses, from
  [BATCH_SCOUT](BATCH_SCOUT.md))
- Nothing Beside Remains and Condition Unknown (Unity, stated only)
- Herbarium and Pestis Apotheca (Unity, stated only)
- Alchemyst Apprentice (Windows-only download)

The earlier chat's native-only cultivation games remain with
[that report](../PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md):
Cultivation Sect Chronicle and Cultivation Stories.

Play-only questions from the gap ledgers are listed in [OPEN_GAPS](OPEN_GAPS.md) section OG-C.
