# Jujutsu Kaisen source ledger

**Evidence status: dated secondary wiki snapshots.** The wiki is not primary canon authority. The archive has SHA-256 `f8a8ac1e26dde6931b0cb046a8d6c98a7f038a61318dea039269f89eec5ae37c`, frozen 2026-10-10 UTC. The JJK digest received its revision review on 2026-10-10; the main selected-text reading and parent semantic review completed separately. Read hashes/counts describe stored selections, sometimes mechanic spans rather than whole articles.

## Labels and coverage

- `W`: article-specific wiki assertion. It must keep its title, revision and cited continuity/medium.
- `I`: inference drawn from one or more bounded `W` claims.
- `P`: proposal for this world pack; never canon or accepted runtime behavior.
- `U`: unknown or unreviewed. Do not convert absence of a note into a prohibition.

`workers/qualifier/NOTES.jsonl` contains 501 retained main notes, all marked fully read against their selected payload; checkpoint reports 3,887,963 selected characters. `workers/jjk-full/NOTES.jsonl` contains repairs, and `parent-review/jjk/SEMANTIC_NOTES.jsonl` contains 501 semantic review records. The parent checkpoint reports all 481 previously pending notes (indices 20–500) reviewed against restored text. This is not 501 primary manga reads or complete wiki coverage. Six non-character pages were restored/integrated incrementally. `jujutsu-kaisen_EMPTY_INPUT_AUDIT.json` remains open because the restored payload is missing.

## Directly checked core laws

These payload texts were opened from each source-manifest `read_file`; their `text` length and SHA-256 matched the manifest `read_characters` and `read_sha256`. Locator language below paraphrases section-level content.

| Label | Article, revision and locator | Bounded claim used by this pack | Pack implication |
|---|---|---|---|
| `W` | Cursed Energy r79259, Description; Cursed Energy Manipulation; Applying Cursed Energy; Black Flash | Negative emotion is a source; training/control, leakage, reinforcement, output and perception have distinct described roles. The page includes exceptions and examples. | `P` Keep reserve/output/control/leakage/perception distinct; no universal mood-to-capacity formula. |
| `W` | Cursed Technique r79254, Technique Activation; Innate Techniques; Inherited Techniques; Non-Innate Techniques | Innate methods are body/brain engraved; learned barrier methods differ; inherited methods carry knowledge. Omitting activation parts improves efficiency; deliberately including them can improve effectiveness. | `P` Separate source, knowledge, execution and ritual. Do not say extra ritual always weakens a technique. |
| `W` | Binding Vow r78401, Overview; Vows with Oneself; Vows with Others | Self-breach loses the gain; mutual breach is described as more consequential but no general schedule is given. Examples include exact conditions and disputed clauses. | `P` Separate vow types and store exact terms/evidence. Mutual penalty, consent, coercion and release stay case-specific or `U`. |
| `W` | Heavenly Restriction r79234, Description; Physically Gifted; History | Imposed at birth without the bearer’s choice; exchange examples include body/energy; zero-energy affects many detection/barrier interactions with stated exceptions. | `P` Do not model this as a chosen vow. Separate sensory detection from physical boundaries and damage. |
| `W` | Barrier r74038, Description; Types of Barriers | Barriers conceal, contain or deny entry; page states recognition of cursed-energy-bearing individuals and disregard of inanimate objects/buildings; selective conditions require skill. | `P` Define boundary predicate and geometry independently; test a person separately from a structure. |
| `W` | Domain Expansion r78744, Description; Lethal/Non-Lethal/Incomplete Domains; Drawbacks; Countermeasures | Domain effects can be lethal or procedural; incomplete forms can lack sure-hit; countermeasures and technique burnout are described, with case variation. | `P` Separate shell, embedded effect, procedure, sure-hit, counter, clash and burnout. |
| `W` | Reverse Cursed Technique r79210, Description; Countermeasures; Usage | Positive energy and technique reversal differ; body healing, external healing, soul perception/repair and technique recovery have constraints. | `P` Select actual recipient, target, cost and source; never use one universal heal. |
| `W` | Culling Game r79139, Rules; About the Culling Game | Entry, point transfer, adding rules, removal and barriers are distinct; killing the organizer alone does not end the ritual. | `P` Version rules and separate authority, transport, sanction and exit. |
| `W` | Deadly Sentencing r73036, Description; Sentencing | The specific domain suspends violence, explains rules, uses evidence/statements and separates judge knowledge from what caster knows; confiscation/sanction routing varies. | `P` Keep procedure, knowledge and target separate; do not make all domains courts. |
| `W` | Sorcerer Clan/Zenin Clan r79324, succession and clan structure sections | Succession, acceptance, key/access, custody, hostage risk, institutional recognition and actual control can diverge. | `P` Store status, permission, asset access and custody separately. |
| `W` | Finger Bearer r73010, Description; Fly Heads r61878, Description | Same grade may contain varied strength; a finger bearer can form an incomplete domain without an innate method; signature clutter can obscure a zero-energy actor. | `P` Grade and detected energy are evidence, not deterministic combat outcomes. |

## Contradictions and caution register

| Label | Conflict / uncertainty | Treatment in pack |
|---|---|---|
| `W/U` | The digest is revision-bound and says cited-text scope is partial; character histories, archived catalogs and expanded galleries/templates were not certified complete. | Article claims stay local. A missing note is not a source negation. |
| `W/U` | Main-series pages and later Simurian/Modulo materials coexist in the dump; article infoboxes, debut fields and prose may carry different era/date references. | Main-series and later material are separate continuity/era records. Resolve each exact claim against its own cited page/medium. |
| `W/U` | Binding Vow r78401 gives a debated party-specific breach case and does not state a complete rule for valid consent, mutual sanction, witnesses or release. | Mark unresolved; never use a random or universal penalty table. |
| `W/U` | Heavenly Restriction r79234 says “most” domain sure-hit interactions; it does not establish immunity to all domains or ordinary physical barriers. | Preserve “most,” name exceptions only when sourced. |
| `W/U` | Domain Expansion r78744 examples vary: nonlethal procedure, incomplete shell/effect and open domains do not share a single sure-hit model. | Do not flatten them into “all domains always hit.” |
| `W/U` | Decay r68450: the JJK full reviewer repaired the actor and duration, and specified the *other* user activates it; victim-to-brothers connection is not “either sibling activates.” | Preserve exact actor, trigger, carrier and unknown duration. |
| `W/U` | Yuko Ozawa r76574: reviewer corrected speaker attribution. Multiple battle notes distinguish what an actor believes from established technique law. | Attribute statements and inferences to their speaker/page. |
| `W/U` | Full-review repairs commonly narrowed price, duration and growth: an energy/material used in an effect is not automatically consumed; a demonstrated variant is not progression; one event does not prove universal cost. | Leave absent costs/limits unknown. Do not promote examples into rules. |
| `W/U` | Cross-page carryover risk P1; actor/speaker slips P2; stated conditions dropped then called unknown P3; medium flattened P4; JJK span coordinates include gaps P5. | Spotcheck single-page text and exact payload coordinates before source-law claims. The source files remain auditable by title/revision. |
| `W/U` | Empty-input audit is OPEN; retained empty selection provisionally indicates only that its page had no mechanism-bearing text in saved metadata. | Do not claim characters or pages lack mechanics based on this gate. |

## Reader repairs and provenance

The independent JJK full review reports 481 pending parent notes reviewed (indices 20–500), with repaired semantic fields kept alongside append-only receipts. The full lane `NOTES.jsonl` has later review entries; it is not the same as the frozen qualifier input. Example repairs include: Decay activation attribution and unknown duration; Yuko’s speaker; Nanami’s named overtime vow; the exact carrier/price distinction for technique examples; and constraining Maru’s technique shutdown to the cited third-eye backlash event. See `workers/jjk-full/SUMMARY.md`, `CHECKPOINT.md`, and `parent-review/jjk/` for exact entries.

## Complete retained title/revision index

Each row below identifies one retained source note and its wiki revision. The URL is the revision-pinned source. Note completion applies to the selected text shown in the source note, not necessarily an untrimmed whole page. Main continuity is stated in individual notes; titles with Modulo, Simurian, anime, game, battle or media labels keep those narrower boundaries.

The coverage cell records selected-text read status only, not a universal continuity or medium. For claim reuse, match the article title and revision to `workers/jjk-full/NOTES.jsonl`; its `continuity` field is the claim-level medium/continuity boundary, including mixed-source qualifications. Do not infer main-series authority from a generic read-complete row. For example, Kensuke Nagino r71591 is identified there as a Phantom Parade game character.

| Index | Source page and revision | Coverage label |
|---:|---|---|
| 1 | [Kyoto Metropolitan Curse Technical College r76017](https://jujutsu-kaisen.fandom.com/wiki/Kyoto_Metropolitan_Curse_Technical_College?oldid=76017) | W, retained selected text marked read-complete |
| 2 | [Cursed Tool r74969](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Tool?oldid=74969) | W, retained selected text marked read-complete |
| 3 | [Jujutsu Kaisen r75583](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen?oldid=75583) | W, retained selected text marked read-complete |
| 4 | [Yuji Itadori r79333](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori?oldid=79333) | W, retained selected text marked read-complete |
| 5 | [Simurian r75529](https://jujutsu-kaisen.fandom.com/wiki/Simurian?oldid=75529) | W, retained selected text marked read-complete |
| 6 | [Domain r17022](https://jujutsu-kaisen.fandom.com/wiki/Domain?oldid=17022) | W, retained selected text marked read-complete |
| 7 | [Gojo Family r58582](https://jujutsu-kaisen.fandom.com/wiki/Gojo_Family?oldid=58582) | W, retained selected text marked read-complete |
| 8 | [Kamo Family r58581](https://jujutsu-kaisen.fandom.com/wiki/Kamo_Family?oldid=58581) | W, retained selected text marked read-complete |
| 9 | [Zenin Family r58668](https://jujutsu-kaisen.fandom.com/wiki/Zenin_Family?oldid=58668) | W, retained selected text marked read-complete |
| 10 | [Innate Technique r17019](https://jujutsu-kaisen.fandom.com/wiki/Innate_Technique?oldid=17019) | W, retained selected text marked read-complete |
| 11 | [Barrier Technique r17020](https://jujutsu-kaisen.fandom.com/wiki/Barrier_Technique?oldid=17020) | W, retained selected text marked read-complete |
| 12 | [Infinity r18079](https://jujutsu-kaisen.fandom.com/wiki/Infinity?oldid=18079) | W, retained selected text marked read-complete |
| 13 | [Inherited Technique r17021](https://jujutsu-kaisen.fandom.com/wiki/Inherited_Technique?oldid=17021) | W, retained selected text marked read-complete |
| 14 | [List of Characters r79068](https://jujutsu-kaisen.fandom.com/wiki/List_of_Characters?oldid=79068) | W, retained selected text marked read-complete |
| 15 | [Kensuke Nagino r71591](https://jujutsu-kaisen.fandom.com/wiki/Kensuke_Nagino?oldid=71591) | W, retained selected text marked read-complete |
| 16 | [Sotomura r70453](https://jujutsu-kaisen.fandom.com/wiki/Sotomura?oldid=70453) | W, retained selected text marked read-complete |
| 17 | [Shigeru Sonoda r74118](https://jujutsu-kaisen.fandom.com/wiki/Shigeru_Sonoda?oldid=74118) | W, retained selected text marked read-complete |
| 18 | [Takeru r78319](https://jujutsu-kaisen.fandom.com/wiki/Takeru?oldid=78319) | W, retained selected text marked read-complete |
| 19 | [Wasuke Itadori r78286](https://jujutsu-kaisen.fandom.com/wiki/Wasuke_Itadori?oldid=78286) | W, retained selected text marked read-complete |
| 20 | [Tadashi Okazaki r68987](https://jujutsu-kaisen.fandom.com/wiki/Tadashi_Okazaki?oldid=68987) | W, retained selected text marked read-complete |
| 21 | [Ultra Spin r44080](https://jujutsu-kaisen.fandom.com/wiki/Ultra_Spin?oldid=44080) | W, retained selected text marked read-complete |
| 22 | [Kappa Rokujushi r72836](https://jujutsu-kaisen.fandom.com/wiki/Kappa_Rokujushi?oldid=72836) | W, retained selected text marked read-complete |
| 23 | [Tsumiki Fushiguro r66890](https://jujutsu-kaisen.fandom.com/wiki/Tsumiki_Fushiguro?oldid=66890) | W, retained selected text marked read-complete |
| 24 | [Ultra Shield r57798](https://jujutsu-kaisen.fandom.com/wiki/Ultra_Shield?oldid=57798) | W, retained selected text marked read-complete |
| 25 | [Miracle Cannon r51493](https://jujutsu-kaisen.fandom.com/wiki/Miracle_Cannon?oldid=51493) | W, retained selected text marked read-complete |
| 26 | [Pigeon Viola r57577](https://jujutsu-kaisen.fandom.com/wiki/Pigeon_Viola?oldid=57577) | W, retained selected text marked read-complete |
| 27 | [List of Battles & Events r78202](https://jujutsu-kaisen.fandom.com/wiki/List_of_Battles_&_Events?oldid=78202) | W, retained selected text marked read-complete |
| 28 | [Blood Meteorite r70538](https://jujutsu-kaisen.fandom.com/wiki/Blood_Meteorite?oldid=70538) | W, retained selected text marked read-complete |
| 29 | [Ultimate Cannon r44077](https://jujutsu-kaisen.fandom.com/wiki/Ultimate_Cannon?oldid=44077) | W, retained selected text marked read-complete |
| 30 | [Fly Heads r61878](https://jujutsu-kaisen.fandom.com/wiki/Fly_Heads?oldid=61878) | W, retained selected text marked read-complete |
| 31 | [Furudate r78274](https://jujutsu-kaisen.fandom.com/wiki/Furudate?oldid=78274) | W, retained selected text marked read-complete |
| 32 | [Saori r79362](https://jujutsu-kaisen.fandom.com/wiki/Saori?oldid=79362) | W, retained selected text marked read-complete |
| 33 | [Fumi r79364](https://jujutsu-kaisen.fandom.com/wiki/Fumi?oldid=79364) | W, retained selected text marked read-complete |
| 34 | [Hazy Moon r70536](https://jujutsu-kaisen.fandom.com/wiki/Hazy_Moon?oldid=70536) | W, retained selected text marked read-complete |
| 35 | [Nobuko Takada r73214](https://jujutsu-kaisen.fandom.com/wiki/Nobuko_Takada?oldid=73214) | W, retained selected text marked read-complete |
| 36 | [Bayer r79087](https://jujutsu-kaisen.fandom.com/wiki/Bayer?oldid=79087) | W, retained selected text marked read-complete |
| 37 | [Crimson Binding r68985](https://jujutsu-kaisen.fandom.com/wiki/Crimson_Binding?oldid=68985) | W, retained selected text marked read-complete |
| 38 | [Slicing Exorcism r76567](https://jujutsu-kaisen.fandom.com/wiki/Slicing_Exorcism?oldid=76567) | W, retained selected text marked read-complete |
| 39 | [Boost On r44083](https://jujutsu-kaisen.fandom.com/wiki/Boost_On?oldid=44083) | W, retained selected text marked read-complete |
| 40 | [Ultra Cannon r69003](https://jujutsu-kaisen.fandom.com/wiki/Ultra_Cannon?oldid=69003) | W, retained selected text marked read-complete |
| 41 | [Blood Edge r61984](https://jujutsu-kaisen.fandom.com/wiki/Blood_Edge?oldid=61984) | W, retained selected text marked read-complete |
| 42 | [Takeda r61880](https://jujutsu-kaisen.fandom.com/wiki/Takeda?oldid=61880) | W, retained selected text marked read-complete |
| 43 | [Fujinuma r74080](https://jujutsu-kaisen.fandom.com/wiki/Fujinuma?oldid=74080) | W, retained selected text marked read-complete |
| 44 | [Hiten r64597](https://jujutsu-kaisen.fandom.com/wiki/Hiten?oldid=64597) | W, retained selected text marked read-complete |
| 45 | [Akuro-o Otake r78915](https://jujutsu-kaisen.fandom.com/wiki/Akuro-o_Otake?oldid=78915) | W, retained selected text marked read-complete |
| 46 | [Sara Kozuki r79605](https://jujutsu-kaisen.fandom.com/wiki/Sara_Kozuki?oldid=79605) | W, retained selected text marked read-complete |
| 47 | [Shota Ito r77286](https://jujutsu-kaisen.fandom.com/wiki/Shota_Ito?oldid=77286) | W, retained selected text marked read-complete |
| 48 | [Reiki r69598](https://jujutsu-kaisen.fandom.com/wiki/Reiki?oldid=69598) | W, retained selected text marked read-complete |
| 49 | [Kaori Itadori r77838](https://jujutsu-kaisen.fandom.com/wiki/Kaori_Itadori?oldid=77838) | W, retained selected text marked read-complete |
| 50 | [Maculation r74884](https://jujutsu-kaisen.fandom.com/wiki/Maculation?oldid=74884) | W, retained selected text marked read-complete |
| 51 | [Decay r68450](https://jujutsu-kaisen.fandom.com/wiki/Decay?oldid=68450) | W, retained selected text marked read-complete |
| 52 | [Renchoku Girls' Junior High r71299](https://jujutsu-kaisen.fandom.com/wiki/Renchoku_Girls'_Junior_High?oldid=71299) | W, retained selected text marked read-complete |
| 53 | [Nagi Yoshino r74405](https://jujutsu-kaisen.fandom.com/wiki/Nagi_Yoshino?oldid=74405) | W, retained selected text marked read-complete |
| 54 | [Q r74122](https://jujutsu-kaisen.fandom.com/wiki/Q?oldid=74122) | W, retained selected text marked read-complete |
| 55 | [Blu-ray & DVD Hidden Inventory / Premature Death Vol. 2 r63598](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Hidden_Inventory_/_Premature_Death_Vol._2?oldid=63598) | W, retained selected text marked read-complete |
| 56 | [Collapse r73544](https://jujutsu-kaisen.fandom.com/wiki/Collapse?oldid=73544) | W, retained selected text marked read-complete |
| 57 | [Spiderweb r63164](https://jujutsu-kaisen.fandom.com/wiki/Spiderweb?oldid=63164) | W, retained selected text marked read-complete |
| 58 | [Ember Insects r73103](https://jujutsu-kaisen.fandom.com/wiki/Ember_Insects?oldid=73103) | W, retained selected text marked read-complete |
| 59 | [Takagi r72391](https://jujutsu-kaisen.fandom.com/wiki/Takagi?oldid=72391) | W, retained selected text marked read-complete |
| 60 | [Stand In The Darkness r64429](https://jujutsu-kaisen.fandom.com/wiki/Stand_In_The_Darkness?oldid=64429) | W, retained selected text marked read-complete |
| 61 | [Kokun r79088](https://jujutsu-kaisen.fandom.com/wiki/Kokun?oldid=79088) | W, retained selected text marked read-complete |
| 62 | [Earthen Insect Trance r75139](https://jujutsu-kaisen.fandom.com/wiki/Earthen_Insect_Trance?oldid=75139) | W, retained selected text marked read-complete |
| 63 | [Moon Dregs r68670](https://jujutsu-kaisen.fandom.com/wiki/Moon_Dregs?oldid=68670) | W, retained selected text marked read-complete |
| 64 | [Jin Itadori r78272](https://jujutsu-kaisen.fandom.com/wiki/Jin_Itadori?oldid=78272) | W, retained selected text marked read-complete |
| 65 | [Mode: Albatross r55675](https://jujutsu-kaisen.fandom.com/wiki/Mode:_Albatross?oldid=55675) | W, retained selected text marked read-complete |
| 66 | [Popularity Polls r74081](https://jujutsu-kaisen.fandom.com/wiki/Popularity_Polls?oldid=74081) | W, retained selected text marked read-complete |
| 67 | [Biting Twist r76875](https://jujutsu-kaisen.fandom.com/wiki/Biting_Twist?oldid=76875) | W, retained selected text marked read-complete |
| 68 | [Cutie Honey r72938](https://jujutsu-kaisen.fandom.com/wiki/Cutie_Honey?oldid=72938) | W, retained selected text marked read-complete |
| 69 | [Blu-ray & DVD Shibuya Incident Vol. 6 r64644](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Shibuya_Incident_Vol._6?oldid=64644) | W, retained selected text marked read-complete |
| 70 | [Yuko Ozawa r76574](https://jujutsu-kaisen.fandom.com/wiki/Yuko_Ozawa?oldid=76574) | W, retained selected text marked read-complete |
| 71 | [Mimiko Hasaba r73185](https://jujutsu-kaisen.fandom.com/wiki/Mimiko_Hasaba?oldid=73185) | W, retained selected text marked read-complete |
| 72 | [Supernova r76568](https://jujutsu-kaisen.fandom.com/wiki/Supernova?oldid=76568) | W, retained selected text marked read-complete |
| 73 | [Maximum: Meteor r72862](https://jujutsu-kaisen.fandom.com/wiki/Maximum:_Meteor?oldid=72862) | W, retained selected text marked read-complete |
| 74 | [Miracles r79473](https://jujutsu-kaisen.fandom.com/wiki/Miracles?oldid=79473) | W, retained selected text marked read-complete |
| 75 | [Blu-ray & DVD Vol. 3 r63590](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._3?oldid=63590) | W, retained selected text marked read-complete |
| 76 | [Blu-ray & DVD Vol. 7 r63595](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._7?oldid=63595) | W, retained selected text marked read-complete |
| 77 | [Tiger Funeral r78134](https://jujutsu-kaisen.fandom.com/wiki/Tiger_Funeral?oldid=78134) | W, retained selected text marked read-complete |
| 78 | [Shino r59799](https://jujutsu-kaisen.fandom.com/wiki/Shino?oldid=59799) | W, retained selected text marked read-complete |
| 79 | [Blu-ray & DVD Shibuya Incident Vol. 2 r63600](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Shibuya_Incident_Vol._2?oldid=63600) | W, retained selected text marked read-complete |
| 80 | [Blu-ray & DVD Shibuya Incident Vol. 3 r63601](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Shibuya_Incident_Vol._3?oldid=63601) | W, retained selected text marked read-complete |
| 81 | [Blu-ray & DVD Shibuya Incident Vol. 4 r63602](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Shibuya_Incident_Vol._4?oldid=63602) | W, retained selected text marked read-complete |
| 82 | [Rozetsu r75121](https://jujutsu-kaisen.fandom.com/wiki/Rozetsu?oldid=75121) | W, retained selected text marked read-complete |
| 83 | [Blu-ray & DVD Vol. 8 r63596](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._8?oldid=63596) | W, retained selected text marked read-complete |
| 84 | [Prayer Song r66238](https://jujutsu-kaisen.fandom.com/wiki/Prayer_Song?oldid=66238) | W, retained selected text marked read-complete |
| 85 | [Ryu r79147](https://jujutsu-kaisen.fandom.com/wiki/Ryu?oldid=79147) | W, retained selected text marked read-complete |
| 86 | [Wind Scythe r63704](https://jujutsu-kaisen.fandom.com/wiki/Wind_Scythe?oldid=63704) | W, retained selected text marked read-complete |
| 87 | [Taichi Kanada r74079](https://jujutsu-kaisen.fandom.com/wiki/Taichi_Kanada?oldid=74079) | W, retained selected text marked read-complete |
| 88 | [Cloning Technique r79462](https://jujutsu-kaisen.fandom.com/wiki/Cloning_Technique?oldid=79462) | W, retained selected text marked read-complete |
| 89 | [Shiranui-Gata r77071](https://jujutsu-kaisen.fandom.com/wiki/Shiranui-Gata?oldid=77071) | W, retained selected text marked read-complete |
| 90 | [Promotional Videos r74117](https://jujutsu-kaisen.fandom.com/wiki/Promotional_Videos?oldid=74117) | W, retained selected text marked read-complete |
| 91 | [Michizane Sugawara r79516](https://jujutsu-kaisen.fandom.com/wiki/Michizane_Sugawara?oldid=79516) | W, retained selected text marked read-complete |
| 92 | [Jujutsu Kaisen The Stage r53636](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_The_Stage?oldid=53636) | W, retained selected text marked read-complete |
| 93 | [Blu-ray & DVD Shibuya Incident Vol. 1 r63599](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Shibuya_Incident_Vol._1?oldid=63599) | W, retained selected text marked read-complete |
| 94 | [Blu-ray & DVD Vol. 1 r66165](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._1?oldid=66165) | W, retained selected text marked read-complete |
| 95 | [Unblockable Drumming Beat r59812](https://jujutsu-kaisen.fandom.com/wiki/Unblockable_Drumming_Beat?oldid=59812) | W, retained selected text marked read-complete |
| 96 | [Blazing Courage r77291](https://jujutsu-kaisen.fandom.com/wiki/Blazing_Courage?oldid=77291) | W, retained selected text marked read-complete |
| 97 | [Nanako Hasaba r74977](https://jujutsu-kaisen.fandom.com/wiki/Nanako_Hasaba?oldid=74977) | W, retained selected text marked read-complete |
| 98 | [Blu-ray & DVD Vol. 6 r63594](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._6?oldid=63594) | W, retained selected text marked read-complete |
| 99 | [The Well's Unknown Abyss r68400](https://jujutsu-kaisen.fandom.com/wiki/The_Well's_Unknown_Abyss?oldid=68400) | W, retained selected text marked read-complete |
| 100 | [Icefall r74832](https://jujutsu-kaisen.fandom.com/wiki/Icefall?oldid=74832) | W, retained selected text marked read-complete |
| 101 | [Manami Suda r78615](https://jujutsu-kaisen.fandom.com/wiki/Manami_Suda?oldid=78615) | W, retained selected text marked read-complete |
| 102 | [Honoyagi r79317](https://jujutsu-kaisen.fandom.com/wiki/Honoyagi?oldid=79317) | W, retained selected text marked read-complete |
| 103 | [Misato Kuroi r79063](https://jujutsu-kaisen.fandom.com/wiki/Misato_Kuroi?oldid=79063) | W, retained selected text marked read-complete |
| 104 | [Manji Kick r56588](https://jujutsu-kaisen.fandom.com/wiki/Manji_Kick?oldid=56588) | W, retained selected text marked read-complete |
| 105 | [Okinawa r74051](https://jujutsu-kaisen.fandom.com/wiki/Okinawa?oldid=74051) | W, retained selected text marked read-complete |
| 106 | [Cursed Human r43627](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Human?oldid=43627) | W, retained selected text marked read-complete |
| 107 | [Blu-ray & DVD Shibuya Incident Vol. 5 r63603](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Shibuya_Incident_Vol._5?oldid=63603) | W, retained selected text marked read-complete |
| 108 | [Kaito Yuki r79603](https://jujutsu-kaisen.fandom.com/wiki/Kaito_Yuki?oldid=79603) | W, retained selected text marked read-complete |
| 109 | [Piercing Ox r58707](https://jujutsu-kaisen.fandom.com/wiki/Piercing_Ox?oldid=58707) | W, retained selected text marked read-complete |
| 110 | [Slaughter Demon r71596](https://jujutsu-kaisen.fandom.com/wiki/Slaughter_Demon?oldid=71596) | W, retained selected text marked read-complete |
| 111 | [Keita Oe r79494](https://jujutsu-kaisen.fandom.com/wiki/Keita_Oe?oldid=79494) | W, retained selected text marked read-complete |
| 112 | [Blu-ray & DVD Vol. 2 r63589](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._2?oldid=63589) | W, retained selected text marked read-complete |
| 113 | [Blu-ray & DVD Vol. 5 r68407](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._5?oldid=68407) | W, retained selected text marked read-complete |
| 114 | [Solo Forbidden Area r78140](https://jujutsu-kaisen.fandom.com/wiki/Solo_Forbidden_Area?oldid=78140) | W, retained selected text marked read-complete |
| 115 | [Toshihisa Negi r68867](https://jujutsu-kaisen.fandom.com/wiki/Toshihisa_Negi?oldid=68867) | W, retained selected text marked read-complete |
| 116 | [Hairpin r79496](https://jujutsu-kaisen.fandom.com/wiki/Hairpin?oldid=79496) | W, retained selected text marked read-complete |
| 117 | [Bath r58704](https://jujutsu-kaisen.fandom.com/wiki/Bath?oldid=58704) | W, retained selected text marked read-complete |
| 118 | [Saitama Urami East Junior High r66537](https://jujutsu-kaisen.fandom.com/wiki/Saitama_Urami_East_Junior_High?oldid=66537) | W, retained selected text marked read-complete |
| 119 | [Sword Option r68982](https://jujutsu-kaisen.fandom.com/wiki/Sword_Option?oldid=68982) | W, retained selected text marked read-complete |
| 120 | [Innate Domain r79293](https://jujutsu-kaisen.fandom.com/wiki/Innate_Domain?oldid=79293) | W, retained selected text marked read-complete |
| 121 | [Blu-ray & DVD Vol. 4 r68437](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Vol._4?oldid=68437) | W, retained selected text marked read-complete |
| 122 | [Cursed Womb r78895](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Womb?oldid=78895) | W, retained selected text marked read-complete |
| 123 | [Nobuaki Zenin r79330](https://jujutsu-kaisen.fandom.com/wiki/Nobuaki_Zenin?oldid=79330) | W, retained selected text marked read-complete |
| 124 | [Threefold Affliction r66815](https://jujutsu-kaisen.fandom.com/wiki/Threefold_Affliction?oldid=66815) | W, retained selected text marked read-complete |
| 125 | [Great Serpent r67355](https://jujutsu-kaisen.fandom.com/wiki/Great_Serpent?oldid=67355) | W, retained selected text marked read-complete |
| 126 | [Yuji Iwasaki r74053](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Iwasaki?oldid=74053) | W, retained selected text marked read-complete |
| 127 | [Blu-ray & DVD Hidden Inventory / Premature Death Vol. 1 r63597](https://jujutsu-kaisen.fandom.com/wiki/Blu-ray_&_DVD_Hidden_Inventory_/_Premature_Death_Vol._1?oldid=63597) | W, retained selected text marked read-complete |
| 128 | [Bird Strike r65628](https://jujutsu-kaisen.fandom.com/wiki/Bird_Strike?oldid=65628) | W, retained selected text marked read-complete |
| 129 | [Misato Kuroi vs. Cloning Curse User r64983](https://jujutsu-kaisen.fandom.com/wiki/Misato_Kuroi_vs._Cloning_Curse_User?oldid=64983) | W, retained selected text marked read-complete |
| 130 | [Chojuro Zenin r79331](https://jujutsu-kaisen.fandom.com/wiki/Chojuro_Zenin?oldid=79331) | W, retained selected text marked read-complete |
| 131 | [Kaichi r69597](https://jujutsu-kaisen.fandom.com/wiki/Kaichi?oldid=69597) | W, retained selected text marked read-complete |
| 132 | [Yu Haibara r76080](https://jujutsu-kaisen.fandom.com/wiki/Yu_Haibara?oldid=76080) | W, retained selected text marked read-complete |
| 133 | [Yoshinobu Gakuganji vs. Juzo Kumiya r29126](https://jujutsu-kaisen.fandom.com/wiki/Yoshinobu_Gakuganji_vs._Juzo_Kumiya?oldid=29126) | W, retained selected text marked read-complete |
| 134 | [Death Swarm r54527](https://jujutsu-kaisen.fandom.com/wiki/Death_Swarm?oldid=54527) | W, retained selected text marked read-complete |
| 135 | [Rainbow Dragon r78817](https://jujutsu-kaisen.fandom.com/wiki/Rainbow_Dragon?oldid=78817) | W, retained selected text marked read-complete |
| 136 | [Granite Blast r70137](https://jujutsu-kaisen.fandom.com/wiki/Granite_Blast?oldid=70137) | W, retained selected text marked read-complete |
| 137 | [Chain of a Thousand Miles r49786](https://jujutsu-kaisen.fandom.com/wiki/Chain_of_a_Thousand_Miles?oldid=49786) | W, retained selected text marked read-complete |
| 138 | [Dhruv Lakdawalla r76761](https://jujutsu-kaisen.fandom.com/wiki/Dhruv_Lakdawalla?oldid=76761) | W, retained selected text marked read-complete |
| 139 | [Antigravity System r78144](https://jujutsu-kaisen.fandom.com/wiki/Antigravity_System?oldid=78144) | W, retained selected text marked read-complete |
| 140 | [Jujutsu Kaisen The Stage: Kyoto Goodwill Event / The Origin of Obedience r68366](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_The_Stage:_Kyoto_Goodwill_Event_/_The_Origin_of_Obedience?oldid=68366) | W, retained selected text marked read-complete |
| 141 | [Sword of Extermination r78617](https://jujutsu-kaisen.fandom.com/wiki/Sword_of_Extermination?oldid=78617) | W, retained selected text marked read-complete |
| 142 | [Inverse r53209](https://jujutsu-kaisen.fandom.com/wiki/Inverse?oldid=53209) | W, retained selected text marked read-complete |
| 143 | [Maximum: Wing King r70008](https://jujutsu-kaisen.fandom.com/wiki/Maximum:_Wing_King?oldid=70008) | W, retained selected text marked read-complete |
| 144 | [Séance Technique r78485](https://jujutsu-kaisen.fandom.com/wiki/Séance_Technique?oldid=78485) | W, retained selected text marked read-complete |
| 145 | [Chizuru Hari r76886](https://jujutsu-kaisen.fandom.com/wiki/Chizuru_Hari?oldid=76886) | W, retained selected text marked read-complete |
| 146 | [Garry K. Johnson r77975](https://jujutsu-kaisen.fandom.com/wiki/Garry_K._Johnson?oldid=77975) | W, retained selected text marked read-complete |
| 147 | [Tamamo-no-Mae Incarnate r79429](https://jujutsu-kaisen.fandom.com/wiki/Tamamo-no-Mae_Incarnate?oldid=79429) | W, retained selected text marked read-complete |
| 148 | [Round Deer r77797](https://jujutsu-kaisen.fandom.com/wiki/Round_Deer?oldid=77797) | W, retained selected text marked read-complete |
| 149 | [Saki Rindo r79598](https://jujutsu-kaisen.fandom.com/wiki/Saki_Rindo?oldid=79598) | W, retained selected text marked read-complete |
| 150 | [Savage Jaw Strike r76580](https://jujutsu-kaisen.fandom.com/wiki/Savage_Jaw_Strike?oldid=76580) | W, retained selected text marked read-complete |
| 151 | [Frost Calm r61998](https://jujutsu-kaisen.fandom.com/wiki/Frost_Calm?oldid=61998) | W, retained selected text marked read-complete |
| 152 | [Cross Val Vol Yelvori r78388](https://jujutsu-kaisen.fandom.com/wiki/Cross_Val_Vol_Yelvori?oldid=78388) | W, retained selected text marked read-complete |
| 153 | [Heart Catch r74123](https://jujutsu-kaisen.fandom.com/wiki/Heart_Catch?oldid=74123) | W, retained selected text marked read-complete |
| 154 | [Nobara Kugisaki vs. Cursed Spirits r39486](https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki_vs._Cursed_Spirits?oldid=39486) | W, retained selected text marked read-complete |
| 155 | [Shinjuku r71722](https://jujutsu-kaisen.fandom.com/wiki/Shinjuku?oldid=71722) | W, retained selected text marked read-complete |
| 156 | [Hagane Daido r78916](https://jujutsu-kaisen.fandom.com/wiki/Hagane_Daido?oldid=78916) | W, retained selected text marked read-complete |
| 157 | [Maki Zenin vs. Mai Zenin r68979](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_vs._Mai_Zenin?oldid=68979) | W, retained selected text marked read-complete |
| 158 | [Rokujushi Miyo r79086](https://jujutsu-kaisen.fandom.com/wiki/Rokujushi_Miyo?oldid=79086) | W, retained selected text marked read-complete |
| 159 | [Yasohachi Bridge r74129](https://jujutsu-kaisen.fandom.com/wiki/Yasohachi_Bridge?oldid=74129) | W, retained selected text marked read-complete |
| 160 | [Setsuko Sasaki r72771](https://jujutsu-kaisen.fandom.com/wiki/Setsuko_Sasaki?oldid=72771) | W, retained selected text marked read-complete |
| 161 | [Hollow Wicker Basket r79252](https://jujutsu-kaisen.fandom.com/wiki/Hollow_Wicker_Basket?oldid=79252) | W, retained selected text marked read-complete |
| 162 | [Thin Ice Breaker r72348](https://jujutsu-kaisen.fandom.com/wiki/Thin_Ice_Breaker?oldid=72348) | W, retained selected text marked read-complete |
| 163 | [Black Rope r76870](https://jujutsu-kaisen.fandom.com/wiki/Black_Rope?oldid=76870) | W, retained selected text marked read-complete |
| 164 | [Ogami's Grandson r70562](https://jujutsu-kaisen.fandom.com/wiki/Ogami's_Grandson?oldid=70562) | W, retained selected text marked read-complete |
| 165 | [Coffin of the Iron Mountain r66820](https://jujutsu-kaisen.fandom.com/wiki/Coffin_of_the_Iron_Mountain?oldid=66820) | W, retained selected text marked read-complete |
| 166 | [Kuchisake-Onna r79428](https://jujutsu-kaisen.fandom.com/wiki/Kuchisake-Onna?oldid=79428) | W, retained selected text marked read-complete |
| 167 | [Cyrus Veil r78495](https://jujutsu-kaisen.fandom.com/wiki/Cyrus_Veil?oldid=78495) | W, retained selected text marked read-complete |
| 168 | [Festering Life Sword r69828](https://jujutsu-kaisen.fandom.com/wiki/Festering_Life_Sword?oldid=69828) | W, retained selected text marked read-complete |
| 169 | [Body Repel r64380](https://jujutsu-kaisen.fandom.com/wiki/Body_Repel?oldid=64380) | W, retained selected text marked read-complete |
| 170 | [Toad r71863](https://jujutsu-kaisen.fandom.com/wiki/Toad?oldid=71863) | W, retained selected text marked read-complete |
| 171 | [Baseball Game r71510](https://jujutsu-kaisen.fandom.com/wiki/Baseball_Game?oldid=71510) | W, retained selected text marked read-complete |
| 172 | [Dragon-Bone r78071](https://jujutsu-kaisen.fandom.com/wiki/Dragon-Bone?oldid=78071) | W, retained selected text marked read-complete |
| 173 | [Batto Sword Drawing r73989](https://jujutsu-kaisen.fandom.com/wiki/Batto_Sword_Drawing?oldid=73989) | W, retained selected text marked read-complete |
| 174 | [Evening Moon Sword Drawing r70537](https://jujutsu-kaisen.fandom.com/wiki/Evening_Moon_Sword_Drawing?oldid=70537) | W, retained selected text marked read-complete |
| 175 | [Osada r78743](https://jujutsu-kaisen.fandom.com/wiki/Osada?oldid=78743) | W, retained selected text marked read-complete |
| 176 | [Polymorphic Soul Isomer r69618](https://jujutsu-kaisen.fandom.com/wiki/Polymorphic_Soul_Isomer?oldid=69618) | W, retained selected text marked read-complete |
| 177 | [Ogami r74669](https://jujutsu-kaisen.fandom.com/wiki/Ogami?oldid=74669) | W, retained selected text marked read-complete |
| 178 | [Gorilla Mode r58932](https://jujutsu-kaisen.fandom.com/wiki/Gorilla_Mode?oldid=58932) | W, retained selected text marked read-complete |
| 179 | [Flowing Red Scale r61985](https://jujutsu-kaisen.fandom.com/wiki/Flowing_Red_Scale?oldid=61985) | W, retained selected text marked read-complete |
| 180 | [Rot Technique r62184](https://jujutsu-kaisen.fandom.com/wiki/Rot_Technique?oldid=62184) | W, retained selected text marked read-complete |
| 181 | [Noritoshi Kamo (Ancestor) r79490](https://jujutsu-kaisen.fandom.com/wiki/Noritoshi_Kamo_(Ancestor)?oldid=79490) | W, retained selected text marked read-complete |
| 182 | [Charles Bernard r78435](https://jujutsu-kaisen.fandom.com/wiki/Charles_Bernard?oldid=78435) | W, retained selected text marked read-complete |
| 183 | [Time Cell Moon Palace r79512](https://jujutsu-kaisen.fandom.com/wiki/Time_Cell_Moon_Palace?oldid=79512) | W, retained selected text marked read-complete |
| 184 | [Tool Manipulation r71007](https://jujutsu-kaisen.fandom.com/wiki/Tool_Manipulation?oldid=71007) | W, retained selected text marked read-complete |
| 185 | [Shiu Kong r76584](https://jujutsu-kaisen.fandom.com/wiki/Shiu_Kong?oldid=76584) | W, retained selected text marked read-complete |
| 186 | [Kamutoke r71569](https://jujutsu-kaisen.fandom.com/wiki/Kamutoke?oldid=71569) | W, retained selected text marked read-complete |
| 187 | [Niji Ebina r74667](https://jujutsu-kaisen.fandom.com/wiki/Niji_Ebina?oldid=74667) | W, retained selected text marked read-complete |
| 188 | [Black Bird Manipulation r66475](https://jujutsu-kaisen.fandom.com/wiki/Black_Bird_Manipulation?oldid=66475) | W, retained selected text marked read-complete |
| 189 | [Satoru Gojo vs. Sukuna: First Fight r72619](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Sukuna:_First_Fight?oldid=72619) | W, retained selected text marked read-complete |
| 190 | [Sukuna vs. Ryu Ishigori r73385](https://jujutsu-kaisen.fandom.com/wiki/Sukuna_vs._Ryu_Ishigori?oldid=73385) | W, retained selected text marked read-complete |
| 191 | [Takeshi Iguchi r70563](https://jujutsu-kaisen.fandom.com/wiki/Takeshi_Iguchi?oldid=70563) | W, retained selected text marked read-complete |
| 192 | [G Warstaff r72081](https://jujutsu-kaisen.fandom.com/wiki/G_Warstaff?oldid=72081) | W, retained selected text marked read-complete |
| 193 | [Garuda r66986](https://jujutsu-kaisen.fandom.com/wiki/Garuda?oldid=66986) | W, retained selected text marked read-complete |
| 194 | [Kyoto Sister-School Goodwill Event r74910](https://jujutsu-kaisen.fandom.com/wiki/Kyoto_Sister-School_Goodwill_Event?oldid=74910) | W, retained selected text marked read-complete |
| 195 | [Womb Profusion r76640](https://jujutsu-kaisen.fandom.com/wiki/Womb_Profusion?oldid=76640) | W, retained selected text marked read-complete |
| 196 | [Riko Amanai r79167](https://jujutsu-kaisen.fandom.com/wiki/Riko_Amanai?oldid=79167) | W, retained selected text marked read-complete |
| 197 | [Convergence r79304](https://jujutsu-kaisen.fandom.com/wiki/Convergence?oldid=79304) | W, retained selected text marked read-complete |
| 198 | [Larue r69064](https://jujutsu-kaisen.fandom.com/wiki/Larue?oldid=69064) | W, retained selected text marked read-complete |
| 199 | [Jacob's Ladder r64422](https://jujutsu-kaisen.fandom.com/wiki/Jacob's_Ladder?oldid=64422) | W, retained selected text marked read-complete |
| 200 | [Evacuation of the Eishu Detention Center r74110](https://jujutsu-kaisen.fandom.com/wiki/Evacuation_of_the_Eishu_Detention_Center?oldid=74110) | W, retained selected text marked read-complete |
| 201 | [Satoru Gojo vs. Cloning Curse User r71995](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Cloning_Curse_User?oldid=71995) | W, retained selected text marked read-complete |
| 202 | [Bonus Manga r65238](https://jujutsu-kaisen.fandom.com/wiki/Bonus_Manga?oldid=65238) | W, retained selected text marked read-complete |
| 203 | [REMEMBER r77999](https://jujutsu-kaisen.fandom.com/wiki/REMEMBER?oldid=77999) | W, retained selected text marked read-complete |
| 204 | [First Light Novel r68370](https://jujutsu-kaisen.fandom.com/wiki/First_Light_Novel?oldid=68370) | W, retained selected text marked read-complete |
| 205 | [Judgeman r72550](https://jujutsu-kaisen.fandom.com/wiki/Judgeman?oldid=72550) | W, retained selected text marked read-complete |
| 206 | [Maki Zenin vs. Kasumi Miwa r42717](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_vs._Kasumi_Miwa?oldid=42717) | W, retained selected text marked read-complete |
| 207 | [Soul Multiplicity r77602](https://jujutsu-kaisen.fandom.com/wiki/Soul_Multiplicity?oldid=77602) | W, retained selected text marked read-complete |
| 208 | [Remi r79104](https://jujutsu-kaisen.fandom.com/wiki/Remi?oldid=79104) | W, retained selected text marked read-complete |
| 209 | [Falling Blossom Emotion r77066](https://jujutsu-kaisen.fandom.com/wiki/Falling_Blossom_Emotion?oldid=77066) | W, retained selected text marked read-complete |
| 210 | [Ranta Zenin r78315](https://jujutsu-kaisen.fandom.com/wiki/Ranta_Zenin?oldid=78315) | W, retained selected text marked read-complete |
| 211 | [Satoru Gojo & Suguru Geto vs. Bayer & Kokun r49234](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_&_Suguru_Geto_vs._Bayer_&_Kokun?oldid=49234) | W, retained selected text marked read-complete |
| 212 | [Jujutsu Kaisen Modulo r74024](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_Modulo?oldid=74024) | W, retained selected text marked read-complete |
| 213 | [Talisman r74274](https://jujutsu-kaisen.fandom.com/wiki/Talisman?oldid=74274) | W, retained selected text marked read-complete |
| 214 | [Akari Nitta r78051](https://jujutsu-kaisen.fandom.com/wiki/Akari_Nitta?oldid=78051) | W, retained selected text marked read-complete |
| 215 | [Mythical Beast Amber r75740](https://jujutsu-kaisen.fandom.com/wiki/Mythical_Beast_Amber?oldid=75740) | W, retained selected text marked read-complete |
| 216 | [Second Light Novel r68368](https://jujutsu-kaisen.fandom.com/wiki/Second_Light_Novel?oldid=68368) | W, retained selected text marked read-complete |
| 217 | [Disaster Tides r79459](https://jujutsu-kaisen.fandom.com/wiki/Disaster_Tides?oldid=79459) | W, retained selected text marked read-complete |
| 218 | [Yuji Itadori vs. Panda r78244](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Panda?oldid=78244) | W, retained selected text marked read-complete |
| 219 | [Star Rage r74172](https://jujutsu-kaisen.fandom.com/wiki/Star_Rage?oldid=74172) | W, retained selected text marked read-complete |
| 220 | [Utahime Iori r79169](https://jujutsu-kaisen.fandom.com/wiki/Utahime_Iori?oldid=79169) | W, retained selected text marked read-complete |
| 221 | [Yuta Okkotsu vs. Cursed Spirit r78200](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu_vs._Cursed_Spirit?oldid=78200) | W, retained selected text marked read-complete |
| 222 | [Hanyu r79102](https://jujutsu-kaisen.fandom.com/wiki/Hanyu?oldid=79102) | W, retained selected text marked read-complete |
| 223 | [Technique Extinguishment r79463](https://jujutsu-kaisen.fandom.com/wiki/Technique_Extinguishment?oldid=79463) | W, retained selected text marked read-complete |
| 224 | [Merged Beast Agito r74399](https://jujutsu-kaisen.fandom.com/wiki/Merged_Beast_Agito?oldid=74399) | W, retained selected text marked read-complete |
| 225 | [Divine Dogs r76656](https://jujutsu-kaisen.fandom.com/wiki/Divine_Dogs?oldid=76656) | W, retained selected text marked read-complete |
| 226 | [Immortality r77617](https://jujutsu-kaisen.fandom.com/wiki/Immortality?oldid=77617) | W, retained selected text marked read-complete |
| 227 | [Transfigured Human r75753](https://jujutsu-kaisen.fandom.com/wiki/Transfigured_Human?oldid=75753) | W, retained selected text marked read-complete |
| 228 | [Ko-Guy r77922](https://jujutsu-kaisen.fandom.com/wiki/Ko-Guy?oldid=77922) | W, retained selected text marked read-complete |
| 229 | [Comedian r70685](https://jujutsu-kaisen.fandom.com/wiki/Comedian?oldid=70685) | W, retained selected text marked read-complete |
| 230 | [Nobara Kugisaki vs. Mai Zenin r71775](https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki_vs._Mai_Zenin?oldid=71775) | W, retained selected text marked read-complete |
| 231 | [Gege Akutami r75071](https://jujutsu-kaisen.fandom.com/wiki/Gege_Akutami?oldid=75071) | W, retained selected text marked read-complete |
| 232 | [Haba r79173](https://jujutsu-kaisen.fandom.com/wiki/Haba?oldid=79173) | W, retained selected text marked read-complete |
| 233 | [Give it back r59056](https://jujutsu-kaisen.fandom.com/wiki/Give_it_back?oldid=59056) | W, retained selected text marked read-complete |
| 234 | [Puppet Manipulation r63031](https://jujutsu-kaisen.fandom.com/wiki/Puppet_Manipulation?oldid=63031) | W, retained selected text marked read-complete |
| 235 | [Megumi Fushiguro & Maki Zenin vs. Hanami r42721](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_&_Maki_Zenin_vs._Hanami?oldid=42721) | W, retained selected text marked read-complete |
| 236 | [Jujutsu Kaisen 0: Jujutsu High r73985](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_0:_Jujutsu_High?oldid=73985) | W, retained selected text marked read-complete |
| 237 | [Miguel Oduol r77294](https://jujutsu-kaisen.fandom.com/wiki/Miguel_Oduol?oldid=77294) | W, retained selected text marked read-complete |
| 238 | [Yuji Itadori & Kento Nanami vs. Transfigured Humans r42709](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Kento_Nanami_vs._Transfigured_Humans?oldid=42709) | W, retained selected text marked read-complete |
| 239 | [Suguru Geto vs. Shikigami Curse User r71992](https://jujutsu-kaisen.fandom.com/wiki/Suguru_Geto_vs._Shikigami_Curse_User?oldid=71992) | W, retained selected text marked read-complete |
| 240 | [Ichizu r59057](https://jujutsu-kaisen.fandom.com/wiki/Ichizu?oldid=59057) | W, retained selected text marked read-complete |
| 241 | [Junpei Yoshino r73527](https://jujutsu-kaisen.fandom.com/wiki/Junpei_Yoshino?oldid=73527) | W, retained selected text marked read-complete |
| 242 | [Authentic Mutual Love r74915](https://jujutsu-kaisen.fandom.com/wiki/Authentic_Mutual_Love?oldid=74915) | W, retained selected text marked read-complete |
| 243 | [Cursed Corpse r77902](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Corpse?oldid=77902) | W, retained selected text marked read-complete |
| 244 | [Eso r78408](https://jujutsu-kaisen.fandom.com/wiki/Eso?oldid=78408) | W, retained selected text marked read-complete |
| 245 | [Piercing Blood r79308](https://jujutsu-kaisen.fandom.com/wiki/Piercing_Blood?oldid=79308) | W, retained selected text marked read-complete |
| 246 | [Resonance r79518](https://jujutsu-kaisen.fandom.com/wiki/Resonance?oldid=79518) | W, retained selected text marked read-complete |
| 247 | [Inverted Spear of Heaven r73530](https://jujutsu-kaisen.fandom.com/wiki/Inverted_Spear_of_Heaven?oldid=73530) | W, retained selected text marked read-complete |
| 248 | [Maximum: Uzumaki r74808](https://jujutsu-kaisen.fandom.com/wiki/Maximum:_Uzumaki?oldid=74808) | W, retained selected text marked read-complete |
| 249 | [Ice Formation r62004](https://jujutsu-kaisen.fandom.com/wiki/Ice_Formation?oldid=62004) | W, retained selected text marked read-complete |
| 250 | [Sendai City r79036](https://jujutsu-kaisen.fandom.com/wiki/Sendai_City?oldid=79036) | W, retained selected text marked read-complete |
| 251 | [Finger Bearer r73010](https://jujutsu-kaisen.fandom.com/wiki/Finger_Bearer?oldid=73010) | W, retained selected text marked read-complete |
| 252 | [Megumi Fushiguro vs. Yasohachi Bridge Curse r36795](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Yasohachi_Bridge_Curse?oldid=36795) | W, retained selected text marked read-complete |
| 253 | [Kechizu r78812](https://jujutsu-kaisen.fandom.com/wiki/Kechizu?oldid=78812) | W, retained selected text marked read-complete |
| 254 | [Max Elephant r66903](https://jujutsu-kaisen.fandom.com/wiki/Max_Elephant?oldid=66903) | W, retained selected text marked read-complete |
| 255 | [Divergent Fist r71497](https://jujutsu-kaisen.fandom.com/wiki/Divergent_Fist?oldid=71497) | W, retained selected text marked read-complete |
| 256 | [Dabura Karaba r79337](https://jujutsu-kaisen.fandom.com/wiki/Dabura_Karaba?oldid=79337) | W, retained selected text marked read-complete |
| 257 | [Rin Amai r79535](https://jujutsu-kaisen.fandom.com/wiki/Rin_Amai?oldid=79535) | W, retained selected text marked read-complete |
| 258 | [Kogane r79056](https://jujutsu-kaisen.fandom.com/wiki/Kogane?oldid=79056) | W, retained selected text marked read-complete |
| 259 | [Straw Doll Technique r79497](https://jujutsu-kaisen.fandom.com/wiki/Straw_Doll_Technique?oldid=79497) | W, retained selected text marked read-complete |
| 260 | [Grade r77461](https://jujutsu-kaisen.fandom.com/wiki/Grade?oldid=77461) | W, retained selected text marked read-complete |
| 261 | [Marmalade Boy r74893](https://jujutsu-kaisen.fandom.com/wiki/Marmalade_Boy?oldid=74893) | W, retained selected text marked read-complete |
| 262 | [Smallpox Deity r69970](https://jujutsu-kaisen.fandom.com/wiki/Smallpox_Deity?oldid=69970) | W, retained selected text marked read-complete |
| 263 | [Yuji Itadori vs. Finger Bearer r39487](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Finger_Bearer?oldid=39487) | W, retained selected text marked read-complete |
| 264 | [Arata Nitta r74077](https://jujutsu-kaisen.fandom.com/wiki/Arata_Nitta?oldid=74077) | W, retained selected text marked read-complete |
| 265 | [Sakayume r59058](https://jujutsu-kaisen.fandom.com/wiki/Sakayume?oldid=59058) | W, retained selected text marked read-complete |
| 266 | [Megumi Fushiguro vs. Sukuna r72529](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Sukuna?oldid=72529) | W, retained selected text marked read-complete |
| 267 | [Cursed Energy Discharge r55735](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Energy_Discharge?oldid=55735) | W, retained selected text marked read-complete |
| 268 | [Auspicious Beasts Summon r69601](https://jujutsu-kaisen.fandom.com/wiki/Auspicious_Beasts_Summon?oldid=69601) | W, retained selected text marked read-complete |
| 269 | [Kasumi Miwa r74585](https://jujutsu-kaisen.fandom.com/wiki/Kasumi_Miwa?oldid=74585) | W, retained selected text marked read-complete |
| 270 | [Rabbit Escape r78815](https://jujutsu-kaisen.fandom.com/wiki/Rabbit_Escape?oldid=78815) | W, retained selected text marked read-complete |
| 271 | [Juzo Kumiya r79443](https://jujutsu-kaisen.fandom.com/wiki/Juzo_Kumiya?oldid=79443) | W, retained selected text marked read-complete |
| 272 | [Kiyotaka Ijichi r76448](https://jujutsu-kaisen.fandom.com/wiki/Kiyotaka_Ijichi?oldid=76448) | W, retained selected text marked read-complete |
| 273 | [Horizon of the Captivating Skandha r68385](https://jujutsu-kaisen.fandom.com/wiki/Horizon_of_the_Captivating_Skandha?oldid=68385) | W, retained selected text marked read-complete |
| 274 | [Six Eyes r79275](https://jujutsu-kaisen.fandom.com/wiki/Six_Eyes?oldid=79275) | W, retained selected text marked read-complete |
| 275 | [Megumi Fushiguro vs. Aoi Todo r65040](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Aoi_Todo?oldid=65040) | W, retained selected text marked read-complete |
| 276 | [Fumihiko Takaba r78899](https://jujutsu-kaisen.fandom.com/wiki/Fumihiko_Takaba?oldid=78899) | W, retained selected text marked read-complete |
| 277 | [Iori Hazenoki vs. Kenjaku r72166](https://jujutsu-kaisen.fandom.com/wiki/Iori_Hazenoki_vs._Kenjaku?oldid=72166) | W, retained selected text marked read-complete |
| 278 | [Curse User r74477](https://jujutsu-kaisen.fandom.com/wiki/Curse_User?oldid=74477) | W, retained selected text marked read-complete |
| 279 | [Time Vessel Association r67583](https://jujutsu-kaisen.fandom.com/wiki/Time_Vessel_Association?oldid=67583) | W, retained selected text marked read-complete |
| 280 | [Sukuna vs. Finger Bearer r72617](https://jujutsu-kaisen.fandom.com/wiki/Sukuna_vs._Finger_Bearer?oldid=72617) | W, retained selected text marked read-complete |
| 281 | [Disaster Flames r79456](https://jujutsu-kaisen.fandom.com/wiki/Disaster_Flames?oldid=79456) | W, retained selected text marked read-complete |
| 282 | [Yuji Itadori & Nobara Kugisaki vs. Cursed Spirits r72369](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Nobara_Kugisaki_vs._Cursed_Spirits?oldid=72369) | W, retained selected text marked read-complete |
| 283 | [Megumi Fushiguro vs. Toji Fushiguro r74976](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Toji_Fushiguro?oldid=74976) | W, retained selected text marked read-complete |
| 284 | [Haruta Shigemo r77827](https://jujutsu-kaisen.fandom.com/wiki/Haruta_Shigemo?oldid=77827) | W, retained selected text marked read-complete |
| 285 | [Jujutsu Kaisen: Phantom Parade r75466](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen:_Phantom_Parade?oldid=75466) | W, retained selected text marked read-complete |
| 286 | [Instant Spirit Body of Distorted Killing r79438](https://jujutsu-kaisen.fandom.com/wiki/Instant_Spirit_Body_of_Distorted_Killing?oldid=79438) | W, retained selected text marked read-complete |
| 287 | [Ganesha r70180](https://jujutsu-kaisen.fandom.com/wiki/Ganesha?oldid=70180) | W, retained selected text marked read-complete |
| 288 | [Disaster Plants r79457](https://jujutsu-kaisen.fandom.com/wiki/Disaster_Plants?oldid=79457) | W, retained selected text marked read-complete |
| 289 | [Jinichi Zenin r79098](https://jujutsu-kaisen.fandom.com/wiki/Jinichi_Zenin?oldid=79098) | W, retained selected text marked read-complete |
| 290 | [Ui Ui r79377](https://jujutsu-kaisen.fandom.com/wiki/Ui_Ui?oldid=79377) | W, retained selected text marked read-complete |
| 291 | [Jujutsu Kaisen Official Fanbook r71725](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_Official_Fanbook?oldid=71725) | W, retained selected text marked read-complete |
| 292 | [Watching Movies r50937](https://jujutsu-kaisen.fandom.com/wiki/Watching_Movies?oldid=50937) | W, retained selected text marked read-complete |
| 293 | [Self-Embodiment of Perfection r79230](https://jujutsu-kaisen.fandom.com/wiki/Self-Embodiment_of_Perfection?oldid=79230) | W, retained selected text marked read-complete |
| 294 | [Maki Zenin vs. The Hei r78251](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_vs._The_Hei?oldid=78251) | W, retained selected text marked read-complete |
| 295 | [Contractual Re-Creation r62813](https://jujutsu-kaisen.fandom.com/wiki/Contractual_Re-Creation?oldid=62813) | W, retained selected text marked read-complete |
| 296 | [Ultimate Mechamaru r79278](https://jujutsu-kaisen.fandom.com/wiki/Ultimate_Mechamaru?oldid=79278) | W, retained selected text marked read-complete |
| 297 | [Epilogue r74284](https://jujutsu-kaisen.fandom.com/wiki/Epilogue?oldid=74284) | W, retained selected text marked read-complete |
| 298 | [Maki Zenin vs. The Kukuru Unit r78248](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_vs._The_Kukuru_Unit?oldid=78248) | W, retained selected text marked read-complete |
| 299 | [Nobara Kugisaki vs. Momo Nishimiya r42718](https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki_vs._Momo_Nishimiya?oldid=42718) | W, retained selected text marked read-complete |
| 300 | [Jiro Awasaka r74824](https://jujutsu-kaisen.fandom.com/wiki/Jiro_Awasaka?oldid=74824) | W, retained selected text marked read-complete |
| 301 | [Megumi Fushiguro vs. Finger Bearer r42672](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Finger_Bearer?oldid=42672) | W, retained selected text marked read-complete |
| 302 | [Panda vs. Hajime Kashimo r68499](https://jujutsu-kaisen.fandom.com/wiki/Panda_vs._Hajime_Kashimo?oldid=68499) | W, retained selected text marked read-complete |
| 303 | [Split Soul Katana r78349](https://jujutsu-kaisen.fandom.com/wiki/Split_Soul_Katana?oldid=78349) | W, retained selected text marked read-complete |
| 304 | [Masaki Takeda r78686](https://jujutsu-kaisen.fandom.com/wiki/Masaki_Takeda?oldid=78686) | W, retained selected text marked read-complete |
| 305 | [Momo Nishimiya r75409](https://jujutsu-kaisen.fandom.com/wiki/Momo_Nishimiya?oldid=75409) | W, retained selected text marked read-complete |
| 306 | [Uraume r78583](https://jujutsu-kaisen.fandom.com/wiki/Uraume?oldid=78583) | W, retained selected text marked read-complete |
| 307 | [Shikigami r79006](https://jujutsu-kaisen.fandom.com/wiki/Shikigami?oldid=79006) | W, retained selected text marked read-complete |
| 308 | [Kinji Hakari vs. Uraume r71793](https://jujutsu-kaisen.fandom.com/wiki/Kinji_Hakari_vs._Uraume?oldid=71793) | W, retained selected text marked read-complete |
| 309 | [Ratio Technique r73430](https://jujutsu-kaisen.fandom.com/wiki/Ratio_Technique?oldid=73430) | W, retained selected text marked read-complete |
| 310 | [Yuka Okkotsu r79544](https://jujutsu-kaisen.fandom.com/wiki/Yuka_Okkotsu?oldid=79544) | W, retained selected text marked read-complete |
| 311 | [Construction r77186](https://jujutsu-kaisen.fandom.com/wiki/Construction?oldid=77186) | W, retained selected text marked read-complete |
| 312 | [Fumihiko Takaba vs. Iori Hazenoki r71839](https://jujutsu-kaisen.fandom.com/wiki/Fumihiko_Takaba_vs._Iori_Hazenoki?oldid=71839) | W, retained selected text marked read-complete |
| 313 | [Prison Realm r77578](https://jujutsu-kaisen.fandom.com/wiki/Prison_Realm?oldid=77578) | W, retained selected text marked read-complete |
| 314 | [Yuta Okkotsu & Maki Zenin vs. Cursed Spirits r77809](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu_&_Maki_Zenin_vs._Cursed_Spirits?oldid=77809) | W, retained selected text marked read-complete |
| 315 | [Jujutsu Regulations r74759](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Regulations?oldid=74759) | W, retained selected text marked read-complete |
| 316 | [Yuji Itadori & Megumi Fushiguro vs. Cursed Spirits r71948](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Megumi_Fushiguro_vs._Cursed_Spirits?oldid=71948) | W, retained selected text marked read-complete |
| 317 | [Iori Hazenoki r69213](https://jujutsu-kaisen.fandom.com/wiki/Iori_Hazenoki?oldid=69213) | W, retained selected text marked read-complete |
| 318 | [Playful Cloud r78369](https://jujutsu-kaisen.fandom.com/wiki/Playful_Cloud?oldid=78369) | W, retained selected text marked read-complete |
| 319 | [Hollow Technique: Purple r78877](https://jujutsu-kaisen.fandom.com/wiki/Hollow_Technique:_Purple?oldid=78877) | W, retained selected text marked read-complete |
| 320 | [Suguru Geto vs. Toji Fushiguro r73683](https://jujutsu-kaisen.fandom.com/wiki/Suguru_Geto_vs._Toji_Fushiguro?oldid=73683) | W, retained selected text marked read-complete |
| 321 | [Cursed Speech r79274](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Speech?oldid=79274) | W, retained selected text marked read-complete |
| 322 | [Domain Amplification r77299](https://jujutsu-kaisen.fandom.com/wiki/Domain_Amplification?oldid=77299) | W, retained selected text marked read-complete |
| 323 | [Secret Execution r47507](https://jujutsu-kaisen.fandom.com/wiki/Secret_Execution?oldid=47507) | W, retained selected text marked read-complete |
| 324 | [Cursed Technique Reversal: Red r73082](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique_Reversal:_Red?oldid=73082) | W, retained selected text marked read-complete |
| 325 | [Yuji Itadori vs. Mahito r42711](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Mahito?oldid=42711) | W, retained selected text marked read-complete |
| 326 | [Megumi Fushiguro, Toge Inumaki & Noritoshi Kamo vs. Hanami r51410](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro,_Toge_Inumaki_&_Noritoshi_Kamo_vs._Hanami?oldid=51410) | W, retained selected text marked read-complete |
| 327 | [Cursed Womb: Death Painting r79491](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Womb:_Death_Painting?oldid=79491) | W, retained selected text marked read-complete |
| 328 | [Vivid Vice r74481](https://jujutsu-kaisen.fandom.com/wiki/Vivid_Vice?oldid=74481) | W, retained selected text marked read-complete |
| 329 | [Ogi Zenin r78323](https://jujutsu-kaisen.fandom.com/wiki/Ogi_Zenin?oldid=78323) | W, retained selected text marked read-complete |
| 330 | [Satoru Gojo vs. Toji Fushiguro: Rematch r72137](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Toji_Fushiguro:_Rematch?oldid=72137) | W, retained selected text marked read-complete |
| 331 | [Yuji Itadori vs. Ko-Guy r52410](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Ko-Guy?oldid=52410) | W, retained selected text marked read-complete |
| 332 | [Mei Mei vs. Niji Ebina r53875](https://jujutsu-kaisen.fandom.com/wiki/Mei_Mei_vs._Niji_Ebina?oldid=53875) | W, retained selected text marked read-complete |
| 333 | [Toji Fushiguro vs. Dagon r60901](https://jujutsu-kaisen.fandom.com/wiki/Toji_Fushiguro_vs._Dagon?oldid=60901) | W, retained selected text marked read-complete |
| 334 | [Kirara Hoshi r79099](https://jujutsu-kaisen.fandom.com/wiki/Kirara_Hoshi?oldid=79099) | W, retained selected text marked read-complete |
| 335 | [Megumi Fushiguro r79081](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro?oldid=79081) | W, retained selected text marked read-complete |
| 336 | [Satoru Gojo r79392](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo?oldid=79392) | W, retained selected text marked read-complete |
| 337 | [Nobara Kugisaki r79493](https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki?oldid=79493) | W, retained selected text marked read-complete |
| 338 | [Maki Zenin r79514](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin?oldid=79514) | W, retained selected text marked read-complete |
| 339 | [Toge Inumaki r76583](https://jujutsu-kaisen.fandom.com/wiki/Toge_Inumaki?oldid=76583) | W, retained selected text marked read-complete |
| 340 | [Fearsome Womb Arc r66161](https://jujutsu-kaisen.fandom.com/wiki/Fearsome_Womb_Arc?oldid=66161) | W, retained selected text marked read-complete |
| 341 | [Sukuna r79393](https://jujutsu-kaisen.fandom.com/wiki/Sukuna?oldid=79393) | W, retained selected text marked read-complete |
| 342 | [Panda r78690](https://jujutsu-kaisen.fandom.com/wiki/Panda?oldid=78690) | W, retained selected text marked read-complete |
| 343 | [Tokyo Metropolitan Curse Technical College r76365](https://jujutsu-kaisen.fandom.com/wiki/Tokyo_Metropolitan_Curse_Technical_College?oldid=76365) | W, retained selected text marked read-complete |
| 344 | [Shoko Ieiri r79318](https://jujutsu-kaisen.fandom.com/wiki/Shoko_Ieiri?oldid=79318) | W, retained selected text marked read-complete |
| 345 | [Kento Nanami r79197](https://jujutsu-kaisen.fandom.com/wiki/Kento_Nanami?oldid=79197) | W, retained selected text marked read-complete |
| 346 | [Jogo r77842](https://jujutsu-kaisen.fandom.com/wiki/Jogo?oldid=77842) | W, retained selected text marked read-complete |
| 347 | [Masamichi Yaga r78333](https://jujutsu-kaisen.fandom.com/wiki/Masamichi_Yaga?oldid=78333) | W, retained selected text marked read-complete |
| 348 | [Mahito r79361](https://jujutsu-kaisen.fandom.com/wiki/Mahito?oldid=79361) | W, retained selected text marked read-complete |
| 349 | [Vs. Mahito Arc r62810](https://jujutsu-kaisen.fandom.com/wiki/Vs._Mahito_Arc?oldid=62810) | W, retained selected text marked read-complete |
| 350 | [Suguru Geto r79552](https://jujutsu-kaisen.fandom.com/wiki/Suguru_Geto?oldid=79552) | W, retained selected text marked read-complete |
| 351 | [Mai Zenin r79489](https://jujutsu-kaisen.fandom.com/wiki/Mai_Zenin?oldid=79489) | W, retained selected text marked read-complete |
| 352 | [Aoi Todo r78758](https://jujutsu-kaisen.fandom.com/wiki/Aoi_Todo?oldid=78758) | W, retained selected text marked read-complete |
| 353 | [Yoshinobu Gakuganji r78535](https://jujutsu-kaisen.fandom.com/wiki/Yoshinobu_Gakuganji?oldid=78535) | W, retained selected text marked read-complete |
| 354 | [Hanami r77843](https://jujutsu-kaisen.fandom.com/wiki/Hanami?oldid=77843) | W, retained selected text marked read-complete |
| 355 | [Weekly Shonen Jump r75945](https://jujutsu-kaisen.fandom.com/wiki/Weekly_Shonen_Jump?oldid=75945) | W, retained selected text marked read-complete |
| 356 | [Yuta Okkotsu r79515](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu?oldid=79515) | W, retained selected text marked read-complete |
| 357 | [Cursed Child Arc r73572](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Child_Arc?oldid=73572) | W, retained selected text marked read-complete |
| 358 | [Kinji Hakari r79140](https://jujutsu-kaisen.fandom.com/wiki/Kinji_Hakari?oldid=79140) | W, retained selected text marked read-complete |
| 359 | [Noritoshi Kamo r79484](https://jujutsu-kaisen.fandom.com/wiki/Noritoshi_Kamo?oldid=79484) | W, retained selected text marked read-complete |
| 360 | [Kokichi Muta r74230](https://jujutsu-kaisen.fandom.com/wiki/Kokichi_Muta?oldid=74230) | W, retained selected text marked read-complete |
| 361 | [Mei Mei r79376](https://jujutsu-kaisen.fandom.com/wiki/Mei_Mei?oldid=79376) | W, retained selected text marked read-complete |
| 362 | [Naobito Zenin r76294](https://jujutsu-kaisen.fandom.com/wiki/Naobito_Zenin?oldid=76294) | W, retained selected text marked read-complete |
| 363 | [Takuma Ino r74281](https://jujutsu-kaisen.fandom.com/wiki/Takuma_Ino?oldid=74281) | W, retained selected text marked read-complete |
| 364 | [Curtain r77658](https://jujutsu-kaisen.fandom.com/wiki/Curtain?oldid=77658) | W, retained selected text marked read-complete |
| 365 | [Kyoto Goodwill Event Arc r68988](https://jujutsu-kaisen.fandom.com/wiki/Kyoto_Goodwill_Event_Arc?oldid=68988) | W, retained selected text marked read-complete |
| 366 | [Death Painting Arc r62896](https://jujutsu-kaisen.fandom.com/wiki/Death_Painting_Arc?oldid=62896) | W, retained selected text marked read-complete |
| 367 | [Choso r78657](https://jujutsu-kaisen.fandom.com/wiki/Choso?oldid=78657) | W, retained selected text marked read-complete |
| 368 | [Tengen r79303](https://jujutsu-kaisen.fandom.com/wiki/Tengen?oldid=79303) | W, retained selected text marked read-complete |
| 369 | [Toji Fushiguro r79047](https://jujutsu-kaisen.fandom.com/wiki/Toji_Fushiguro?oldid=79047) | W, retained selected text marked read-complete |
| 370 | [Gojo's Past Arc r65989](https://jujutsu-kaisen.fandom.com/wiki/Gojo's_Past_Arc?oldid=65989) | W, retained selected text marked read-complete |
| 371 | [Cursed Energy r79259](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Energy?oldid=79259) | W, retained selected text marked read-complete |
| 372 | [Domain Expansion r78744](https://jujutsu-kaisen.fandom.com/wiki/Domain_Expansion?oldid=78744) | W, retained selected text marked read-complete |
| 373 | [Atsuya Kusakabe r79191](https://jujutsu-kaisen.fandom.com/wiki/Atsuya_Kusakabe?oldid=79191) | W, retained selected text marked read-complete |
| 374 | [Rika Orimoto r79483](https://jujutsu-kaisen.fandom.com/wiki/Rika_Orimoto?oldid=79483) | W, retained selected text marked read-complete |
| 375 | [Cursed Spirit r78742](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Spirit?oldid=78742) | W, retained selected text marked read-complete |
| 376 | [Jujutsu Sorcerer r79419](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Sorcerer?oldid=79419) | W, retained selected text marked read-complete |
| 377 | [Shibuya Incident Arc r78800](https://jujutsu-kaisen.fandom.com/wiki/Shibuya_Incident_Arc?oldid=78800) | W, retained selected text marked read-complete |
| 378 | [Jujutsu Kaisen (Anime) r78654](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_(Anime)?oldid=78654) | W, retained selected text marked read-complete |
| 379 | [Yuki Tsukumo r77998](https://jujutsu-kaisen.fandom.com/wiki/Yuki_Tsukumo?oldid=77998) | W, retained selected text marked read-complete |
| 380 | [Cursed Technique r79254](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique?oldid=79254) | W, retained selected text marked read-complete |
| 381 | [Sorcerer Clan r79517](https://jujutsu-kaisen.fandom.com/wiki/Sorcerer_Clan?oldid=79517) | W, retained selected text marked read-complete |
| 382 | [Cursed Object r77600](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Object?oldid=77600) | W, retained selected text marked read-complete |
| 383 | [Reverse Cursed Technique r79210](https://jujutsu-kaisen.fandom.com/wiki/Reverse_Cursed_Technique?oldid=79210) | W, retained selected text marked read-complete |
| 384 | [Heavenly Restriction r79234](https://jujutsu-kaisen.fandom.com/wiki/Heavenly_Restriction?oldid=79234) | W, retained selected text marked read-complete |
| 385 | [Cursed Spirit Manipulation r77234](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Spirit_Manipulation?oldid=77234) | W, retained selected text marked read-complete |
| 386 | [Ten Shadows Technique r79547](https://jujutsu-kaisen.fandom.com/wiki/Ten_Shadows_Technique?oldid=79547) | W, retained selected text marked read-complete |
| 387 | [Simple Domain r79292](https://jujutsu-kaisen.fandom.com/wiki/Simple_Domain?oldid=79292) | W, retained selected text marked read-complete |
| 388 | [Binding Vow r78401](https://jujutsu-kaisen.fandom.com/wiki/Binding_Vow?oldid=78401) | W, retained selected text marked read-complete |
| 389 | [Boogie Woogie r79597](https://jujutsu-kaisen.fandom.com/wiki/Boogie_Woogie?oldid=79597) | W, retained selected text marked read-complete |
| 390 | [Black Flash r79146](https://jujutsu-kaisen.fandom.com/wiki/Black_Flash?oldid=79146) | W, retained selected text marked read-complete |
| 391 | [Blood Manipulation r79309](https://jujutsu-kaisen.fandom.com/wiki/Blood_Manipulation?oldid=79309) | W, retained selected text marked read-complete |
| 392 | [Limitless r79551](https://jujutsu-kaisen.fandom.com/wiki/Limitless?oldid=79551) | W, retained selected text marked read-complete |
| 393 | [Divine Dog: Totality r79305](https://jujutsu-kaisen.fandom.com/wiki/Divine_Dog:_Totality?oldid=79305) | W, retained selected text marked read-complete |
| 394 | [Nue r74113](https://jujutsu-kaisen.fandom.com/wiki/Nue?oldid=74113) | W, retained selected text marked read-complete |
| 395 | [Cursed Technique Lapse: Blue r72497](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique_Lapse:_Blue?oldid=72497) | W, retained selected text marked read-complete |
| 396 | [Malevolent Shrine r78967](https://jujutsu-kaisen.fandom.com/wiki/Malevolent_Shrine?oldid=78967) | W, retained selected text marked read-complete |
| 397 | [Chimera Shadow Garden r73416](https://jujutsu-kaisen.fandom.com/wiki/Chimera_Shadow_Garden?oldid=73416) | W, retained selected text marked read-complete |
| 398 | [Unlimited Void r78957](https://jujutsu-kaisen.fandom.com/wiki/Unlimited_Void?oldid=78957) | W, retained selected text marked read-complete |
| 399 | [Idle Transfiguration r79439](https://jujutsu-kaisen.fandom.com/wiki/Idle_Transfiguration?oldid=79439) | W, retained selected text marked read-complete |
| 400 | [Satoru Gojo vs. Jogo r72214](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Jogo?oldid=72214) | W, retained selected text marked read-complete |
| 401 | [Jujutsu r74153](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu?oldid=74153) | W, retained selected text marked read-complete |
| 402 | [Mode: Absolute r66704](https://jujutsu-kaisen.fandom.com/wiki/Mode:_Absolute?oldid=66704) | W, retained selected text marked read-complete |
| 403 | [Kawasaki City r79283](https://jujutsu-kaisen.fandom.com/wiki/Kawasaki_City?oldid=79283) | W, retained selected text marked read-complete |
| 404 | [Kento Nanami vs. Mahito r72346](https://jujutsu-kaisen.fandom.com/wiki/Kento_Nanami_vs._Mahito?oldid=72346) | W, retained selected text marked read-complete |
| 405 | [Dagon r78888](https://jujutsu-kaisen.fandom.com/wiki/Dagon?oldid=78888) | W, retained selected text marked read-complete |
| 406 | [Yuji Itadori vs. Junpei Yoshino r72890](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Junpei_Yoshino?oldid=72890) | W, retained selected text marked read-complete |
| 407 | [Yuji Itadori & Kento Nanami vs. Mahito r67668](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Kento_Nanami_vs._Mahito?oldid=67668) | W, retained selected text marked read-complete |
| 408 | [Projection Sorcery r78358](https://jujutsu-kaisen.fandom.com/wiki/Projection_Sorcery?oldid=78358) | W, retained selected text marked read-complete |
| 409 | [Spirit Bash Race r71509](https://jujutsu-kaisen.fandom.com/wiki/Spirit_Bash_Race?oldid=71509) | W, retained selected text marked read-complete |
| 410 | [Yuji Itadori & Aoi Todo vs. Hanami r66233](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Aoi_Todo_vs._Hanami?oldid=66233) | W, retained selected text marked read-complete |
| 411 | [Eight-Handled Sword Divergent Sila Divine General Mahoraga r79200](https://jujutsu-kaisen.fandom.com/wiki/Eight-Handled_Sword_Divergent_Sila_Divine_General_Mahoraga?oldid=79200) | W, retained selected text marked read-complete |
| 412 | [Yuji Itadori vs. Aoi Todo r71195](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Aoi_Todo?oldid=71195) | W, retained selected text marked read-complete |
| 413 | [Panda vs. Ultimate Mechamaru r68990](https://jujutsu-kaisen.fandom.com/wiki/Panda_vs._Ultimate_Mechamaru?oldid=68990) | W, retained selected text marked read-complete |
| 414 | [Kaikai Kitan r75472](https://jujutsu-kaisen.fandom.com/wiki/Kaikai_Kitan?oldid=75472) | W, retained selected text marked read-complete |
| 415 | [Lost in Paradise r68362](https://jujutsu-kaisen.fandom.com/wiki/Lost_in_Paradise?oldid=68362) | W, retained selected text marked read-complete |
| 416 | [Megumi Fushiguro vs. Noritoshi Kamo r68991](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Noritoshi_Kamo?oldid=68991) | W, retained selected text marked read-complete |
| 417 | [Yuji Itadori & Nobara Kugisaki vs. Eso & Kechizu r71762](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Nobara_Kugisaki_vs._Eso_&_Kechizu?oldid=71762) | W, retained selected text marked read-complete |
| 418 | [Yuta Okkotsu & Toge Inumaki vs. Cursed Spirits r77810](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu_&_Toge_Inumaki_vs._Cursed_Spirits?oldid=77810) | W, retained selected text marked read-complete |
| 419 | [Night Parade of a Hundred Demons r67800](https://jujutsu-kaisen.fandom.com/wiki/Night_Parade_of_a_Hundred_Demons?oldid=67800) | W, retained selected text marked read-complete |
| 420 | [Maki Zenin, Toge Inumaki & Panda vs. Suguru Geto r44362](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin,_Toge_Inumaki_&_Panda_vs._Suguru_Geto?oldid=44362) | W, retained selected text marked read-complete |
| 421 | [Yuta Okkotsu vs. Suguru Geto r74573](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu_vs._Suguru_Geto?oldid=74573) | W, retained selected text marked read-complete |
| 422 | [Naoya Zenin r78347](https://jujutsu-kaisen.fandom.com/wiki/Naoya_Zenin?oldid=78347) | W, retained selected text marked read-complete |
| 423 | [Satoru Gojo vs. Toji Fushiguro r75853](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Toji_Fushiguro?oldid=75853) | W, retained selected text marked read-complete |
| 424 | [Kokichi Muta vs. Mahito r67811](https://jujutsu-kaisen.fandom.com/wiki/Kokichi_Muta_vs._Mahito?oldid=67811) | W, retained selected text marked read-complete |
| 425 | [Satoru Gojo vs. Mahito's Group r71189](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Mahito's_Group?oldid=71189) | W, retained selected text marked read-complete |
| 426 | [Yuji Itadori & Megumi Fushiguro vs. Jiro Awasaka r63375](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Megumi_Fushiguro_vs._Jiro_Awasaka?oldid=63375) | W, retained selected text marked read-complete |
| 427 | [Takuma Ino vs. Ogami & Her Grandson r57578](https://jujutsu-kaisen.fandom.com/wiki/Takuma_Ino_vs._Ogami_&_Her_Grandson?oldid=57578) | W, retained selected text marked read-complete |
| 428 | [Nobara Kugisaki & Kento Nanami vs. Haruta Shigemo r74282](https://jujutsu-kaisen.fandom.com/wiki/Nobara_Kugisaki_&_Kento_Nanami_vs._Haruta_Shigemo?oldid=74282) | W, retained selected text marked read-complete |
| 429 | [Mei Mei & Ui Ui vs. Smallpox Deity r66416](https://jujutsu-kaisen.fandom.com/wiki/Mei_Mei_&_Ui_Ui_vs._Smallpox_Deity?oldid=66416) | W, retained selected text marked read-complete |
| 430 | [Yuji Itadori vs. Choso r54822](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Choso?oldid=54822) | W, retained selected text marked read-complete |
| 431 | [Jujutsu Sorcerers vs. Dagon r58630](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Sorcerers_vs._Dagon?oldid=58630) | W, retained selected text marked read-complete |
| 432 | [Jujutsu Kaisen 0: The Movie r74521](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_0:_The_Movie?oldid=74521) | W, retained selected text marked read-complete |
| 433 | [Kenjaku r79407](https://jujutsu-kaisen.fandom.com/wiki/Kenjaku?oldid=79407) | W, retained selected text marked read-complete |
| 434 | [Hana Kurusu r78434](https://jujutsu-kaisen.fandom.com/wiki/Hana_Kurusu?oldid=78434) | W, retained selected text marked read-complete |
| 435 | [Sukuna vs. Jogo r76452](https://jujutsu-kaisen.fandom.com/wiki/Sukuna_vs._Jogo?oldid=76452) | W, retained selected text marked read-complete |
| 436 | [Sukuna vs. Mahoraga r76453](https://jujutsu-kaisen.fandom.com/wiki/Sukuna_vs._Mahoraga?oldid=76453) | W, retained selected text marked read-complete |
| 437 | [Shibuya r78267](https://jujutsu-kaisen.fandom.com/wiki/Shibuya?oldid=78267) | W, retained selected text marked read-complete |
| 438 | [Shibuya/Tokyo Metro r68357](https://jujutsu-kaisen.fandom.com/wiki/Shibuya/Tokyo_Metro?oldid=68357) | W, retained selected text marked read-complete |
| 439 | [Hand-to-Hand Combat r77285](https://jujutsu-kaisen.fandom.com/wiki/Hand-to-Hand_Combat?oldid=77285) | W, retained selected text marked read-complete |
| 440 | [Sorcerer Clan/Zenin Clan r79324](https://jujutsu-kaisen.fandom.com/wiki/Sorcerer_Clan/Zenin_Clan?oldid=79324) | W, retained selected text marked read-complete |
| 441 | [Yuji Itadori & Nobara Kugisaki vs. Mahito r74768](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Nobara_Kugisaki_vs._Mahito?oldid=74768) | W, retained selected text marked read-complete |
| 442 | [Yuji Itadori & Aoi Todo vs. Mahito r67636](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Aoi_Todo_vs._Mahito?oldid=67636) | W, retained selected text marked read-complete |
| 443 | [Hajime Kashimo r79550](https://jujutsu-kaisen.fandom.com/wiki/Hajime_Kashimo?oldid=79550) | W, retained selected text marked read-complete |
| 444 | [Hiromi Higuruma r79095](https://jujutsu-kaisen.fandom.com/wiki/Hiromi_Higuruma?oldid=79095) | W, retained selected text marked read-complete |
| 445 | [Jujutsu Sorcerers vs. Kenjaku & Uraume r75181](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Sorcerers_vs._Kenjaku_&_Uraume?oldid=75181) | W, retained selected text marked read-complete |
| 446 | [Deadly Sentencing r73036](https://jujutsu-kaisen.fandom.com/wiki/Deadly_Sentencing?oldid=73036) | W, retained selected text marked read-complete |
| 447 | [Reggie Star r75364](https://jujutsu-kaisen.fandom.com/wiki/Reggie_Star?oldid=75364) | W, retained selected text marked read-complete |
| 448 | [Shibuya Incident r76739](https://jujutsu-kaisen.fandom.com/wiki/Shibuya_Incident?oldid=76739) | W, retained selected text marked read-complete |
| 449 | [Yuji Itadori & Choso vs. Cursed Spirits r78241](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_&_Choso_vs._Cursed_Spirits?oldid=78241) | W, retained selected text marked read-complete |
| 450 | [Yuji Itadori vs. Yuta Okkotsu r78242](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Yuta_Okkotsu?oldid=78242) | W, retained selected text marked read-complete |
| 451 | [Choso vs. Naoya Zenin r78736](https://jujutsu-kaisen.fandom.com/wiki/Choso_vs._Naoya_Zenin?oldid=78736) | W, retained selected text marked read-complete |
| 452 | [Culling Game r79139](https://jujutsu-kaisen.fandom.com/wiki/Culling_Game?oldid=79139) | W, retained selected text marked read-complete |
| 453 | [Maki Zenin vs. Ogi Zenin r79186](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_vs._Ogi_Zenin?oldid=79186) | W, retained selected text marked read-complete |
| 454 | [Kurourushi r69969](https://jujutsu-kaisen.fandom.com/wiki/Kurourushi?oldid=69969) | W, retained selected text marked read-complete |
| 455 | [Maki Zenin vs. Naoya Zenin r78789](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_vs._Naoya_Zenin?oldid=78789) | W, retained selected text marked read-complete |
| 456 | [Takako Uro r72570](https://jujutsu-kaisen.fandom.com/wiki/Takako_Uro?oldid=72570) | W, retained selected text marked read-complete |
| 457 | [Ryu Ishigori r72730](https://jujutsu-kaisen.fandom.com/wiki/Ryu_Ishigori?oldid=72730) | W, retained selected text marked read-complete |
| 458 | [Gachinko Fight Club r78310](https://jujutsu-kaisen.fandom.com/wiki/Gachinko_Fight_Club?oldid=78310) | W, retained selected text marked read-complete |
| 459 | [Love Rendezvous r78792](https://jujutsu-kaisen.fandom.com/wiki/Love_Rendezvous?oldid=78792) | W, retained selected text marked read-complete |
| 460 | [Megumi Fushiguro & Panda vs. Kirara Hoshi r78788](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_&_Panda_vs._Kirara_Hoshi?oldid=78788) | W, retained selected text marked read-complete |
| 461 | [Yuji Itadori vs. Kinji Hakari r79000](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Kinji_Hakari?oldid=79000) | W, retained selected text marked read-complete |
| 462 | [Yuji Itadori vs. Haba & Hanyu r79162](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Haba_&_Hanyu?oldid=79162) | W, retained selected text marked read-complete |
| 463 | [Yuji Itadori vs. Hiromi Higuruma r72775](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori_vs._Hiromi_Higuruma?oldid=72775) | W, retained selected text marked read-complete |
| 464 | [Megumi Fushiguro vs. Reggie Star's Group r76420](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Reggie_Star's_Group?oldid=76420) | W, retained selected text marked read-complete |
| 465 | [Megumi Fushiguro vs. Reggie Star r60093](https://jujutsu-kaisen.fandom.com/wiki/Megumi_Fushiguro_vs._Reggie_Star?oldid=60093) | W, retained selected text marked read-complete |
| 466 | [Culling Game/Colonies r79189](https://jujutsu-kaisen.fandom.com/wiki/Culling_Game/Colonies?oldid=79189) | W, retained selected text marked read-complete |
| 467 | [Yuta Okkotsu vs. Kurourushi r58713](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu_vs._Kurourushi?oldid=58713) | W, retained selected text marked read-complete |
| 468 | [Rika r79482](https://jujutsu-kaisen.fandom.com/wiki/Rika?oldid=79482) | W, retained selected text marked read-complete |
| 469 | [Yuta Okkotsu vs. Takako Uro vs. Ryu Ishigori r77574](https://jujutsu-kaisen.fandom.com/wiki/Yuta_Okkotsu_vs._Takako_Uro_vs._Ryu_Ishigori?oldid=77574) | W, retained selected text marked read-complete |
| 470 | [Idle Death Gamble r78064](https://jujutsu-kaisen.fandom.com/wiki/Idle_Death_Gamble?oldid=78064) | W, retained selected text marked read-complete |
| 471 | [Kinji Hakari vs. Charles Bernard r47016](https://jujutsu-kaisen.fandom.com/wiki/Kinji_Hakari_vs._Charles_Bernard?oldid=47016) | W, retained selected text marked read-complete |
| 472 | [Yorozu r78614](https://jujutsu-kaisen.fandom.com/wiki/Yorozu?oldid=78614) | W, retained selected text marked read-complete |
| 473 | [Kinji Hakari vs. Hajime Kashimo r58527](https://jujutsu-kaisen.fandom.com/wiki/Kinji_Hakari_vs._Hajime_Kashimo?oldid=58527) | W, retained selected text marked read-complete |
| 474 | [Culling Game Arc r79077](https://jujutsu-kaisen.fandom.com/wiki/Culling_Game_Arc?oldid=79077) | W, retained selected text marked read-complete |
| 475 | [Jujutsu Headquarters r79495](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Headquarters?oldid=79495) | W, retained selected text marked read-complete |
| 476 | [Maki Zenin & Noritoshi Kamo vs. Naoya Zenin r64805](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin_&_Noritoshi_Kamo_vs._Naoya_Zenin?oldid=64805) | W, retained selected text marked read-complete |
| 477 | [Maki Zenin, Hagane Daido & Rokujushi Miyo vs. Naoya Zenin r65080](https://jujutsu-kaisen.fandom.com/wiki/Maki_Zenin,_Hagane_Daido_&_Rokujushi_Miyo_vs._Naoya_Zenin?oldid=65080) | W, retained selected text marked read-complete |
| 478 | [Jujutsu Kaisen: Cursed Clash r71105](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen:_Cursed_Clash?oldid=71105) | W, retained selected text marked read-complete |
| 479 | [Shinjuku Showdown Arc r78290](https://jujutsu-kaisen.fandom.com/wiki/Shinjuku_Showdown_Arc?oldid=78290) | W, retained selected text marked read-complete |
| 480 | [Ao no Sumika r74480](https://jujutsu-kaisen.fandom.com/wiki/Ao_no_Sumika?oldid=74480) | W, retained selected text marked read-complete |
| 481 | [Akari r72004](https://jujutsu-kaisen.fandom.com/wiki/Akari?oldid=72004) | W, retained selected text marked read-complete |
| 482 | [Barrier r74038](https://jujutsu-kaisen.fandom.com/wiki/Barrier?oldid=74038) | W, retained selected text marked read-complete |
| 483 | [SpecialZ r76093](https://jujutsu-kaisen.fandom.com/wiki/SpecialZ?oldid=76093) | W, retained selected text marked read-complete |
| 484 | [Yuki Tsukumo & Choso vs. Kenjaku r79272](https://jujutsu-kaisen.fandom.com/wiki/Yuki_Tsukumo_&_Choso_vs._Kenjaku?oldid=79272) | W, retained selected text marked read-complete |
| 485 | [More Than Words r76166](https://jujutsu-kaisen.fandom.com/wiki/More_Than_Words?oldid=76166) | W, retained selected text marked read-complete |
| 486 | [Angel r79284](https://jujutsu-kaisen.fandom.com/wiki/Angel?oldid=79284) | W, retained selected text marked read-complete |
| 487 | [Yuji Itadori, Maki Zenin & Hana Kurusu vs. Sukuna r68455](https://jujutsu-kaisen.fandom.com/wiki/Yuji_Itadori,_Maki_Zenin_&_Hana_Kurusu_vs._Sukuna?oldid=68455) | W, retained selected text marked read-complete |
| 488 | [Fumihiko Takaba vs. Kenjaku r77992](https://jujutsu-kaisen.fandom.com/wiki/Fumihiko_Takaba_vs._Kenjaku?oldid=77992) | W, retained selected text marked read-complete |
| 489 | [Sukuna vs. Yorozu r71865](https://jujutsu-kaisen.fandom.com/wiki/Sukuna_vs._Yorozu?oldid=71865) | W, retained selected text marked read-complete |
| 490 | [Ryomen Sukuna's Fingers r78141](https://jujutsu-kaisen.fandom.com/wiki/Ryomen_Sukuna's_Fingers?oldid=78141) | W, retained selected text marked read-complete |
| 491 | [Climax☆JUMPING! r74410](https://jujutsu-kaisen.fandom.com/wiki/Climax☆JUMPING!?oldid=74410) | W, retained selected text marked read-complete |
| 492 | [Copy r69366](https://jujutsu-kaisen.fandom.com/wiki/Copy?oldid=69366) | W, retained selected text marked read-complete |
| 493 | [Satoru Gojo vs. Sukuna r78092](https://jujutsu-kaisen.fandom.com/wiki/Satoru_Gojo_vs._Sukuna?oldid=78092) | W, retained selected text marked read-complete |
| 494 | [Hajime Kashimo vs. Sukuna r77293](https://jujutsu-kaisen.fandom.com/wiki/Hajime_Kashimo_vs._Sukuna?oldid=77293) | W, retained selected text marked read-complete |
| 495 | [Shrine r79523](https://jujutsu-kaisen.fandom.com/wiki/Shrine?oldid=79523) | W, retained selected text marked read-complete |
| 496 | [Jujutsu Sorcerers vs. Sukuna r79067](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Sorcerers_vs._Sukuna?oldid=79067) | W, retained selected text marked read-complete |
| 497 | [Tsurugi Okkotsu r79548](https://jujutsu-kaisen.fandom.com/wiki/Tsurugi_Okkotsu?oldid=79548) | W, retained selected text marked read-complete |
| 498 | [Marulu Val Vol Yelvori r79365](https://jujutsu-kaisen.fandom.com/wiki/Marulu_Val_Vol_Yelvori?oldid=79365) | W, retained selected text marked read-complete |
| 499 | [Simuria r78373](https://jujutsu-kaisen.fandom.com/wiki/Simuria?oldid=78373) | W, retained selected text marked read-complete |
| 500 | [Aizo r77342](https://jujutsu-kaisen.fandom.com/wiki/Aizo?oldid=77342) | W, retained selected text marked read-complete |
| 501 | [Yoake no Uta r76809](https://jujutsu-kaisen.fandom.com/wiki/Yoake_no_Uta?oldid=76809) | W, retained selected text marked read-complete |

Index source: `workers/qualifier/NOTES.jsonl` (501 rows). The manifest `jujutsu-kaisen_SOURCES.json` records the frozen revision and selected payload/hash for each row.
