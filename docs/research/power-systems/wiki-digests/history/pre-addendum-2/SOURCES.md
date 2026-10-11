# Current lane W source ledger

Date: 2026-10-10 UTC. Every dump statement is a secondary, dated wiki claim. Models and takeaways are analyst proposals. Canon versions are not silently combined.

## Acquisition and privacy

Fandom public S3 dump route follows the authorized addendum. Requests used the named personal-research user agent in dump_crawl.py, serial access, cached HEAD/GET results and randomized 4 to 8 second gaps. At most two distinct database-name keys were tested for a wiki. S3 missing-key/access and Deep Archive errors are not Cloudflare challenges; no archive restore or purchase was attempted. A 429 or throttling would stop the whole S3 route. Existing wiki API robots/refusal state remains unchanged.

Compressed archives and selected raw XML-page text remain under ~/.codex/research/wikis/<wiki>/dump/. py7zr 1.1.3 in dump-tools/venv streamed the XML without materializing whole XML files on disk. Selection is bounded to 400 namespace-zero mechanics candidates per dump. Only the claim sections listed below were semantically reviewed. Skyrim requires a Skyrim title/category.

The dump addendum identifies Fandom's offered content as CC BY-SA. Each archived community's siteinfo is recorded; the existing non-Fandom wikis retain their independently checked license metadata. Tracked text is paraphrase and attribution; no wiki article body is stored in this repository. Initial S3 error bodies were hashed and their code/headers saved, not retained in full; they are not article evidence and were not refetched.

## Dump snapshots

| Requested wiki | XML source community | Last-Modified | Compressed bytes | SHA-256 / result |
|---|---|---|---|---|
| jujutsu-kaisen.fandom.com | jujutsu-kaisen.fandom.com | Fri, 20 Feb 2026 15:02:08 GMT | 2754355 | [f8a8ac1e26dde6931b0cb046a8d6c98a7f038a61318dea039269f89eec5ae37c](https://s3.amazonaws.com/wikia_xml_dumps/j/ju/jujutsukaisen_pages_current.xml.7z) |
| lordofthemysteries.fandom.com | not acquired | Mon, 31 Dec 2018 15:18:57 GMT | 13800 | dump_unavailable_storage |
| mother-of-learning.fandom.com | not acquired | unknown | unknown | unavailable_two_guesses |
| bleach.fandom.com | not acquired | unknown | unknown | unavailable_two_guesses |
| naruto.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| harrypotter.fandom.com | harrypotter.fandom.com | Mon, 14 Sep 2026 16:55:41 GMT | 54181689 | [34b0eeec50d81c12ce5a82965830bb726e3ad5263c1003034374d6be8c64b33a](https://s3.amazonaws.com/wikia_xml_dumps/h/ha/harrypotter_pages_current.xml.7z) |
| eldenring.fandom.com | eldenring.fandom.com | Fri, 20 Feb 2026 15:15:19 GMT | 3972437 | [de026d2785338b1e2c3abb7c2aca4a6491475a9b883d1dbf104befe4a28fad73](https://s3.amazonaws.com/wikia_xml_dumps/e/el/eldenring_pages_current.xml.7z) |
| elderscrolls.fandom.com | elderscrolls.fandom.com | Tue, 27 Jan 2026 16:19:13 GMT | 197057632 | [93f5da45f81de9213162b87542da612bae7cf31884200467b27f61c568fdddbf](https://s3.amazonaws.com/wikia_xml_dumps/e/el/elderscrolls_pages_current.xml.7z) |
| fallout.fandom.com | fallout.fandom.com | Sun, 30 Aug 2026 09:55:53 GMT | 154191038 | [e42801c4034e55a2065ed5d89bc283a7d89b23423623dec16a430fded3ab261e](https://s3.amazonaws.com/wikia_xml_dumps/f/fa/fallout_pages_current.xml.7z) |
| reincarnation-paradise.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| chainsaw-man.fandom.com | not acquired | Mon, 22 May 2023 22:27:53 GMT | 682971 | dump_unavailable_storage |
| hunterxhunter.fandom.com | hunterxhunter.fandom.com | Wed, 01 Jul 2026 15:10:25 GMT | 13616791 | [5fdc003e60ecf76936da8f0e04eb6b70b16f44a418fc58f4892c9a03b43c2a58](https://s3.amazonaws.com/wikia_xml_dumps/h/hu/hunterxhunter_pages_current.xml.7z) |
| undead-unluck.fandom.com | not acquired | Thu, 02 Jul 2020 15:41:51 GMT | 111514 | dump_unavailable_storage |
| typemoon.fandom.com | typemoon.fandom.com | Tue, 21 Jul 2026 16:09:18 GMT | 17340005 | [872ee43b72811383016f7e5776a67a55b2fb6beb434a15607d78d87f01178754](https://s3.amazonaws.com/wikia_xml_dumps/t/ty/typemoon_pages_current.xml.7z) |
| stormlightarchive.fandom.com | not acquired | Thu, 05 Dec 2024 23:00:12 GMT | 1884842 | dump_unavailable_storage |
| worm.fandom.com | not acquired | Fri, 01 Oct 2021 17:49:06 GMT | 30542 | dump_unavailable_storage |
| mistborn.fandom.com | not acquired | Mon, 02 Jul 2018 21:00:09 GMT | 241591 | dump_unavailable_storage |
| reverend-insanity.fandom.com | reverend-insanity.fandom.com | Thu, 27 Aug 2026 15:34:08 GMT | 2062702 | [fdcfd234d2cc4bbad29885808f491403a7ff9e851b334cb83a3c59e56f92de0b](https://s3.amazonaws.com/wikia_xml_dumps/r/re/reverendinsanity_pages_current.xml.7z) |
| omniscient-readers-viewpoint.fandom.com | not acquired | Thu, 27 Feb 2025 18:52:26 GMT | 870042 | dump_unavailable_storage |
| onepiece.fandom.com | onepiece.fandom.com | Sat, 29 Aug 2026 11:36:16 GMT | 64758346 | [c4e33cc6793425d9baa5f76a9f12f047d75dec135006093ed9357629a7d1f7bb](https://s3.amazonaws.com/wikia_xml_dumps/o/on/onepiece_pages_current.xml.7z) |
| myheroacademia.fandom.com | not acquired | Fri, 10 Mar 2023 15:28:18 GMT | 31803 | dump_unavailable_storage |
| fma.fandom.com | fma.fandom.com | Wed, 22 Jul 2026 03:26:40 GMT | 2494329 | [ecd822e8cc21c9492cb1bccc5d9fbf362e9411c86eb791a9491f82d91b2855e6](https://s3.amazonaws.com/wikia_xml_dumps/f/fm/fma_pages_current.xml.7z) |
| frieren.fandom.com | not acquired | Sat, 01 Mar 2025 08:53:35 GMT | 1180432 | dump_unavailable_storage |
| mob-psycho-100.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| kimetsu-no-yaiba.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| blackclover.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| dandadan.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| kagurabachi.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| fire-force.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| worldtrigger.fandom.com | not acquired | Wed, 05 Oct 2022 22:15:27 GMT | 3296436 | dump_unavailable_storage |
| kaiju-no-8.fandom.com | not acquired | Wed, 08 Jul 2020 20:03:04 GMT | 214374 | dump_unavailable_storage |
| towerofgod.fandom.com | not acquired | Sat, 17 Mar 2018 11:41:45 GMT | 6930124 | dump_unavailable_storage |
| solo-leveling.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| the-second-coming-of-gluttony.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| lout-of-counts-family.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| coiling-dragon.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| i-shall-seal-the-heavens.fandom.com | not acquired | Tue, 25 Oct 2016 12:45:07 GMT | 62899 | dump_unavailable_storage |
| renegade-immortal.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| martial-peak-mp.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| releasethatwitch.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| tbate.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| overgeared.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| shadowslave.fandom.com | shadow-slave.fandom.com | Sun, 11 Jan 2026 22:25:26 GMT | 66690 | [cffbcd4abad39149c10cdf104dd8172c77011257b1a607ae390901ae8d8de44c](https://s3.amazonaws.com/wikia_xml_dumps/s/sh/shadowslave_pages_current.xml.7z) |
| dresdenfiles.fandom.com | not acquired | Wed, 13 Oct 2021 17:21:32 GMT | 1843665 | dump_unavailable_storage |
| abridged-guide-to-evil.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| dungeon-crawler-carl.fandom.com | dungeon-crawler-carl.fandom.com | Fri, 21 Aug 2026 19:25:51 GMT | 1583523 | [432fc6e806b5317279c05ce0b12c1fa6e7a807a2215a0b16328480fe5d297e94](https://s3.amazonaws.com/wikia_xml_dumps/d/du/dungeoncrawlercarl_pages_current.xml.7z) |
| he-who-fights-with-monsters.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| marvel.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| dc.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| mtg.fandom.com | not acquired | Sat, 17 Mar 2018 04:06:25 GMT | 3102775 | dump_unavailable_storage |
| darksouls.fandom.com | darksouls.fandom.com | Sun, 06 Sep 2026 03:26:43 GMT | 22483584 | [cbcc42690bd629acda355963bdc9628e9ef2d268004afb98639be92cfe4aac34](https://s3.amazonaws.com/wikia_xml_dumps/d/da/darksouls_pages_current.xml.7z) |
| hades.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| slay-the-spire.fandom.com | not acquired | Fri, 04 Jul 2025 17:37:41 GMT | 1021609 | dump_unavailable_storage |
| my-cell-prison.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| soul-of-negary-novel.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| fantasy-simulator.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| carefree-path-of-dreams.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| vsbattles.fandom.com | not acquired | Sat, 10 Aug 2024 00:08:03 GMT | 736832427 | dump_unavailable_storage |
| doomsday-wonderland.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| thebookeatingmagician.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| the-book-eating-magician.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| the-main-heroines-are-trying-to-kill-me.fandom.com | not acquired | Fri, 08 Jul 2022 10:56:01 GMT | 2308 | dump_unavailable_storage |
| kidnappeddragons.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| mysranks.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| to-another-world-with-land-mines.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| lazydungeonmaster.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| isekai.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| monster-tamer.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| the-magician-who-rose-from-failure.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| the-daily-grind.fandom.com | not acquired | Fri, 16 Aug 2024 21:11:11 GMT | 539136 | dump_unavailable_storage |
| runebound-professor.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| the-stubborn-skillgrinder-in-a-time-loop.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| pale-lights.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |
| oracle-paths.fandom.com | not acquired | unknown | unknown | unavailable_name_guesses |

## Reviewed revision and section ledger

| Claim | Source page revision | Reviewed section | Text hash |
|---|---|---|---|
| DJ1 | [DJ1 Binding Vow r78401](https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow?oldid=78401) | Vows with Oneself; Vows with Others | `1eb15ef46039e900d41ac28036cfd0fff7213635706b084da3bf938955c026a0` |
| DJ2 | [DJ2 Ratio Technique r73430](https://jujutsu-kaisen.fandom.com/wiki/Ratio_Technique?oldid=73430) | Description; Usage | `47c069a9d9230bd371c98e284d9fdcd2d35b493fb8b2ddb136226e470716842f` |
| DJ3 | [DJ3 Mythical Beast Amber r75740](https://jujutsu-kaisen.fandom.com/wiki/Mythical_Beast_Amber?oldid=75740) | Description | `65e9544a44308a3683f69595a05a965b8e6638140bc6c4af45d5fc1959a1143a` |
| DJ4 | [DJ4 Heavenly Restriction r79234](https://jujutsu-kaisen.fandom.com/wiki/Heavenly_Restriction?oldid=79234) | Description; Physically Gifted | `9bb9e6a3d0e8d09fcb2236d7b4155bf16f353d5da5239257124366084d8c56e6` |
| DJ5 | [DJ5 Deadly Sentencing r73036](https://jujutsu-kaisen.fandom.com/wiki/Deadly_Sentencing?oldid=73036) | Description; Sentencing | `84e9b4294d8c342a118a346098e294a606eb2c6449d8ac6e99789ce7623db9bb` |
| DJ6 | [DJ6 Culling Game r79139](https://jujutsu-kaisen.fandom.com/wiki/Culling_Game?oldid=79139) | Rules; About the Culling Game | `b923fde965631644a2d6dd5647f45a42ec36b5ffadfe23b971ab4f402efa3c5b` |
| DJ7 | [DJ7 Domain Expansion r78744](https://jujutsu-kaisen.fandom.com/wiki/Domain_Expansion?oldid=78744) | Lethal Domains; Non-Lethal Domains; Incomplete Domains; Drawbacks; Countermeasures | `61af2e8bc4dc7e8a2c81554477b69dab64faf5be12e595b3d7d352dc16fa70af` |
| DJ8 | [DJ8 Binding Vow r78401](https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow?oldid=78401) | Known Vows | `1eb15ef46039e900d41ac28036cfd0fff7213635706b084da3bf938955c026a0` |
| DJ9 | [DJ9 Cursed Technique r79254](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique?oldid=79254) | Technique Activation; Innate Techniques; Inherited Techniques | `8ccbfcf380f663d3d560600a23142d793a55b981a304ca987d23f9de7f9e4a15` |
| DH1 | [DH1 Unbreakable Vow r1991314](https://harrypotter.fandom.com/wiki/Unbreakable_Vow?oldid=1991314) | Casting; Rules | `fd3e566443333ed477ba8ddeebe2278a8d1a1f7469e402c7accae1a1849e25db` |
| DH2 | [DH2 Binding magical contract r1996905](https://harrypotter.fandom.com/wiki/Binding_magical_contract?oldid=1996905) | Description; History | `d8dead3f4c7712af6123268dcdd218829fd36e8b7dfbdfb41c0557ff808ddb20` |
| DH3 | [DH3 Fidelius Charm r1933855](https://harrypotter.fandom.com/wiki/Fidelius_Charm?oldid=1933855) | Introduction | `437ced851a39eebd8b18aefc066c471407c319d2de1107240ff8fe3062ee15d1` |
| DH4 | [DH4 Wizengamot r2019998](https://harrypotter.fandom.com/wiki/Wizengamot?oldid=2019998) | Introduction; Functions | `47b19ce423483c5fd35d1df811d931135970de5c9305cd077e948dcb7f8086b4` |
| DH5 | [DH5 Gamp's Law of Elemental Transfiguration r2022631](https://harrypotter.fandom.com/wiki/Gamp%27s_Law_of_Elemental_Transfiguration?oldid=2022631) | Description | `c56e5b45a92126404f4a99ec7f01561180eb1628c14aa6f0fc6915d5bbe50b2b` |
| DE1 | [DE1 Law of Causality r67313](https://eldenring.fandom.com/wiki/Law_of_Causality?oldid=67313) | Description; Effect; Notes | `53c044152ef41c9f9ac49a1469a20a849f9b5c31cc1495b31df06ab7506aa71f` |
| DE2 | [DE2 Law of Regression r67314](https://eldenring.fandom.com/wiki/Law_of_Regression?oldid=67314) | Description; Effect; Notes | `03be5636a9ae16f93924e7d85b043a7a61ef0b954fe59ebbfba7a13c35ac7fa7` |
| DE3 | [DE3 Mending Rune of the Death-Prince r74273](https://eldenring.fandom.com/wiki/Mending_Rune_of_the_Death-Prince?oldid=74273) | Description; Effect | `adb5e7cb21bcf19f3a5a095ebcd9bef3e47ba3051392948107bbda18ec2c5f5d` |
| DE4 | [DE4 Golden Order r64471](https://eldenring.fandom.com/wiki/Golden_Order?oldid=64471) | Background; Golden Order | `6d880f05c97e0aac7878d4f5a89bf9f414298f4aaaf884f474563ae5bacd21e7` |
| DE5 | [DE5 Mending Rune of Perfect Order r78481](https://eldenring.fandom.com/wiki/Mending_Rune_of_Perfect_Order?oldid=78481) | Description; Effects | `ae7290123ea105223c37f31468e5af50c8600441c3f6a0f060975d3291cbd496` |
| DX1 | [DX1 Nen r421055](https://hunterxhunter.fandom.com/wiki/Nen?oldid=421055) | Nen and Limitation / Conditions | `be6101879634e9a83c8a073ac33ae950a27ea0b8cca033e818bab7d30e962e4f` |
| DX2 | [DX2 Nen r421055](https://hunterxhunter.fandom.com/wiki/Nen?oldid=421055) | Vows and Limitations; Risk | `be6101879634e9a83c8a073ac33ae950a27ea0b8cca033e818bab7d30e962e4f` |
| DX3 | [DX3 Nen r421055](https://hunterxhunter.fandom.com/wiki/Nen?oldid=421055) | Activation Requirements | `be6101879634e9a83c8a073ac33ae950a27ea0b8cca033e818bab7d30e962e4f` |
| DF1 | [DF1 Command Spell r404906](https://typemoon.fandom.com/wiki/Command_Spell?oldid=404906) | Obtaining Command Spells; Usage | `2e9c1451686706316a992d0a0d2f4e586db33b245adb180d7cf7201063795f4e` |
| DF2 | [DF2 Servant r405040](https://typemoon.fandom.com/wiki/Servant?oldid=405040) | Characteristics | `ffb1d567825deec1c9e1c1c3c216149dfd6f5e84d2bc939a071f7929f3d91460` |
| DF3 | [DF3 Command Spell r404906](https://typemoon.fandom.com/wiki/Command_Spell?oldid=404906) | Usage | `2e9c1451686706316a992d0a0d2f4e586db33b245adb180d7cf7201063795f4e` |
| DS1 | [DS1 Dragon Shouts r3299332](https://elderscrolls.fandom.com/wiki/Dragon_Shouts?oldid=3299332) | Introduction | `e1f059529c8f14987e98cc61e2ba3e305ffb9015b96315642e08f024a92d01dc` |
| DS2 | [DS2 Spells (Skyrim) r3222547](https://elderscrolls.fandom.com/wiki/Spells_(Skyrim)?oldid=3222547) | Usage; Schools | `8fa45736cf15818c1ffd4a32d54e80b336daf9615925d499c77e3fb4917c2e2c` |
| DA1 | [DA1 Karma r4146440](https://fallout.fandom.com/wiki/Karma?oldid=4146440) | Background; Characteristics | `97b40c6465b1ae42a6fe8b36b4bcc6a3b54f5f57db17f519da23a8141c6bf010` |
| DA2 | [DA2 Reputation r4507693](https://fallout.fandom.com/wiki/Reputation?oldid=4507693) | Fallout; Fallout 2; Fallout: New Vegas | `84e24ee998268cff79769675767ebc2a79ec9db31616bcba72249b40181411c9` |
| DR1 | [DR1 Gu r63539](https://reverend-insanity.fandom.com/wiki/Gu?oldid=63539) | The Rank of a Gu; Taking Care of Gu | `31287c88d519457e8f7aa46967ea16aa8313295a716cdee565587d802acd84cc` |
| DR2 | [DR2 Poison Vow Gu r63835](https://reverend-insanity.fandom.com/wiki/Poison_Vow_Gu?oldid=63835) | Introduction; Remove | `b6b4e9542cbfb5baea2c5e53be40266c063940e74c3d7ce47dfe0a2afc880e9c` |
| DM1 | [DM1 Philosopher's Stone r78123](https://fma.fandom.com/wiki/Philosopher%27s_Stone?oldid=78123) | Composition | `12cf8b5cd257f7208498533d7a691142b5f0e4f251fc236f0b93c576467450c1` |
| DM2 | [DM2 Alchemy r78024](https://fma.fandom.com/wiki/Alchemy?oldid=78024) | Introduction; Overview | `de977bcdd271f45c3580ef0618709d0023dd7651fb943939248b1d8614d0c0f4` |
| DSS1 | [DSS1 Aspect r824](https://shadow-slave.fandom.com/wiki/Aspect?oldid=824) | Aspect; Aspect Legacy; Flaw | `fb5bd0566378ae85b7c2fe51b2014213c3cee9eec325abe68b26feeb2b258636` |
| DO1 | [DO1 Devil Fruit r2129490](https://onepiece.fandom.com/wiki/Devil_Fruit?oldid=2129490) | Introduction; Origins | `05b8b151f868864a5c8e0b48334dbc57b20e17a4fc717904e9c63e14362adad8` |
| DO2 | [DO2 Haki r2127560](https://onepiece.fandom.com/wiki/Haki?oldid=2127560) | Introduction; Types of Haki | `fc9b3dc6fc38a27c94a7746f92595893a23afda762ad83842dc136abc75d9eac` |
| DC1 | [DC1 Sponsors r24476](https://dungeon-crawler-carl.fandom.com/wiki/Sponsors?oldid=24476) | Getting Sponsors; Sponsorship Tab | `1b9fe3c737c6b3b57ffb2af5c83e7997b494efb42b7a7fffba4525cd5e818d97` |
| DC2 | [DC2 System AI r26446](https://dungeon-crawler-carl.fandom.com/wiki/System_AI?oldid=26446) | Introduction; Description | `8dd9fd17abb3e877dd91acc4d6f9aa7c78cc9a715d1c864357ab96308b318b24` |
| DS3 | [DS3 Bounty (Skyrim) r3287795](https://elderscrolls.fandom.com/wiki/Bounty_(Skyrim)?oldid=3287795) | Separation by hold; Evading bounty; General overview | `64dff275238c7df3c34610e20c2ff669298e14f1f05d7e1ee5f69c691e9a59ab` |
| DT1 | [DT1 Covenant r362364](https://darksouls.fandom.com/wiki/Covenant?oldid=362364) | Changing covenants | `39d1d5d499f145f3e1689e295b048362e1e699d2dff5452690578b78b913e6e4` |
| DT2 | [DT2 Chaos Servant r357911](https://darksouls.fandom.com/wiki/Chaos_Servant?oldid=357911) | Requirements; Benefits | `1271c4037d6a4c32b23ae8de85829ff4b95a2639e6af375661ba2f1b401d07ae` |

## Prior API receipts

The initial pass's 20 distinct API revisions and 28 claims remain valid only within that bounded review. Its robots refusals and attribution are preserved in [the API ledger](history/pre-dump-addendum/SOURCES.md), [ACQUISITION.json](ACQUISITION.json) and [REVIEW.json](REVIEW.json). A dump download does not reopen a refused API host.

Operational reproducibility: dump_crawl.py, integrate_dumps.py; private dump-tools contains the qualified second-name, small-download and offline refinement scripts. Existing downloaded URLs must be reused from dump-route-state.json, never refetched. Failed generated gzip indexes were discarded only where complete plaintext remained; identical generated index copies were hash-checked and hardlinked to retain all bytes while reclaiming space. Raw archive bytes were not removed.
