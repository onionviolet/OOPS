# Fifteen deeper systems

Build 25097075, executable SHA-256 `93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.
SHOWN means static instructions or a recovered file reader/writer. INFERRED marks interpretation. STATED is reserved for documentation, not used to upgrade a formula. All native addresses use the preferred image base. No game ran.

The source model in these reads is fixed C++ globals, temporary locals and flat files. No class hierarchy was recovered. A field's name alone does not establish its semantics. All save indices below are zero-based write-site indices from the prior [save census](../pass-2026-10-14-rea/SAVE_FORMAT_DIGEST.md), rejoined to these routines. They prove writes, not runtime round trips. New full pseudocode, resolved literals, assembly and save references are in `~/.codex/research/ds-warsim/extract/` and `notes/`. Prior tables remain in the read-only aspect workspace.

## S01: directed diplomacy updates

**Payoff:** institutions can remember an action toward one party without changing every relationship.

**Model and authorship, SHOWN:** `DiplomacyRelation`, entry `0x140a3d55d`, opens `Data/Relations.txt`, skips `RelationID-1` newline rows, parses fifteen period-separated integers, retains preceding/following rows and rewrites the selected row. There are fourteen rows in the prior initializer. Each is a directed record, not a demonstrated symmetric object. Column 15 is special: ordinary RelationID 5..9 updates copy IK1AR..IK5AR into it. This identifies its player-relation use for those five factions; it does not decode every column's faction name.

**Rules, SHOWN:** event 2 sets that last column and all five IK*AR values to 100 and IW1..5 to zero. Event 3 sets them to -100 and IW1..5 to one. Event 5 sets the relation between row IDs 3 and 4 to -50; event 6 sets it to +50. Event 7 adds 45 to selected GoodLeague peers for rows 5..9. Event 9 assigns -100 to a choice-selected column. Event 22 sets the last column to 10; event 69 sets it to -100. Ordinary rows 1..4 and 10..14 subtract RelationDrop from their last column. The helper resets RelationID to zero. Do not extrapolate a universal clamp, symmetric treaty or AI policy from these assignments.

**Connections and save:** compiled event IDs drive disk mutation alongside saved IK*AR, IW* and BanditTruce fields. The disk relation file and main save remain separate evidence surfaces. Full save-copy isolation, bandit truce consumers and event callers remain UNREAD. The loader's row/column guards and malformed-file handling also remain open.

**PROPOSAL mapping:** K6/K7/K12/K18; P07/P12/P25/P16; characters and society owners, world-kit KW3 corrected by FK2. No new relation engine is needed merely because this source uses one.

## S02: noble rosters as generated persistent records

**Payoff:** a world's population can reuse its own race, naming and social institutions.

**Model, SHOWN:** `LordGenerator`, entry `0x140a6e235`, writes `Data/NobilityOne.txt` through `NobilityFive.txt`. The first roster's full-generation loop creates IL1-1 records. A record has eight values: titled name, face, battle score, three integer categories, a bounded attitude-like number and a year-like value. The last two semantic names are INFERRED; the exact writer is known. The eight-value size is corroborated by its later line-count divided by eight, not by reading live roster data.

**Rules, SHOWN:** score = BattleScoreBonus + IKS1 for the first realm. Three categories draw `rand()%6`, `%3`, `%10`; the next value is `min(rand()%200-50,100)`. On LoadingScreen==1 and Year>9, the last value is `floor(Year/2)+rand()%floor(Year/2)`; otherwise it is Year. It must not be called age without a consumer. IWEIRD1 selects NameWriter recipe 1, temporarily preserves that first name across a normal Name call, and restores it. RaceEffectSlot=1 applies the faction's portrait traits before FaceGenerator. The other four explicit slot branches repeat the same architecture.

**Authorship and save:** race/name tables feed compiled record construction; LordGenUse selects full generation or a selected roster maintenance route. The latter compares record count to ILn-1, with additional deletion/maintenance branches still UNREAD. Main SaveGame/LoadGame reference save-named nobility companion files. Thus the roster is outside the 1,903-field main stream. No live roster was read or written; companion copying and all eight readers remain open.

**PROPOSAL mapping:** K6/K7/K18; P15/P16/P23; generation foundation and characters, with genetics round 13's carrier distinction. No parent IDs or inherited lineage were shown.

## S03: adventuring groups

**Payoff:** generated groups have a purpose and composition, rather than being a loose list of names.

**Model, SHOWN:** `AdventurerGenerator`, entry `0x140a7ee0d`, opens `Data/Adventurers.txt` for output and loops CUSTOMAdventurerQuant times. It draws one of six origin slots: five current independent races and a human branch. NameWriter can supply the race-specific first name. ForceAdventurerType is reset to 99 on completion. The writer includes generated name, numeric group facts, color, face, species, a zero-initialized field and descriptive purpose text.

**Rules, bounded SHOWN:** one selected race branch derives combat values from the realm's IKS/IPS values plus name-derived bonus; another human branch uses base 150/100. Purpose handling distinguishes four modes with different prose and group generation branches. These are concrete generator dependencies, not proof of an autonomous adventuring planner. This decompile has six unresolved jump-table warnings at `0x140a7fdf0` through `0x140a8087f`. The complete group-size/type distributions and positional schema therefore remain UNREAD; no probability claim is based on those switches.

**Authorship, links and save:** native branches combine world race facts, names, faces and purpose wording. SaveGame and LoadGame reference an Adventurers companion. A generated purpose string does not prove executed jobs, shared player/NPC budgets, simulated travel, a party hierarchy or companion consent. Those consumers and the full companion lifecycle remain open. Do not read the installed mutable file to fill this gap.

**PROPOSAL mapping:** K6/K7/K8/K18; P06/P15/P25/P23; characters and life-sim owners. The missing YAIRPG leaf is a selected group's lawful work consumer, not a new generic group registry.

## S04: recruit offers and champion slots

**Payoff:** one observed encounter can become a lasting ally with a known origin.

**Model and rules, SHOWN:** `RandChampHire`, entry `0x140c8397f`, checks five ACN slots for an empty string. If one is empty it generates Name, calls QuickStat, combines BattleScoreBonus+BattleScore and generates a human face. Choice 1 stores the offer in the first empty slot: ACNn, ACFn, ACSn and ACStoryn. HeroBackground supplies an authored biography and a short encounter-origin tail is appended. Choice 2 declines without those assignments. All-full takes a refusal path. This helper has no shown gold debit or calendar increment. Five slots are a source constraint, not a YAIRPG limit.

`ChampionChallenge`, entry `0x1408cc2a2`, separately fills the first empty tournament place from tSpot2..9 with ChampionName and ChampionScore. It is a bracket-placement adapter, not the combat or hiring resolver.

**Authorship and save:** native slot logic reuses Name, face and HeroStory pools. ACN1..5 are writer indices 106..110; ACS1..5 are 196..200; stories 1327..1331. Portraits are separate string writes. This closes an encounter-to-retained-lore route. It does not turn generated biography into factual history or establish wages, orders, loyalty or a body lineage. Those consumers and caller frequency remain UNREAD.

**PROPOSAL mapping:** K6/K10/K12/K18; P06/P12/P15; characters, life sim and generation owners. Retain actual recruitment provenance separately from generated backstory.

## S05: council attendance and staff consequences

**Payoff:** speech and service availability depend on who actually attends.

**Model, SHOWN:** `CouncilMeet`, entry `0x140c97075`, admits a meeting if any of DiplomatName, SpymasterName, JesterName, GeneralName or StewardName is nonempty. It builds temporary attendance flags and recomputes CouncilStaff from the five available people. FirstMeeting==0 presents an introduction then becomes 1. Native discussion branches read existing harvest policy, shrine level, army/resource state and staff identities. This is compiled contextual conversation, not a decoded universal social graph.

**Rules, SHOWN:** attendance toggles change CouncilStaff by one and gate participant branches. Choice 7 additionally requires CouncilStaff>0 and MoonDoor==1. Its selected staff-removal paths subtract one attendee, clear the corresponding identity and set that staff skill to zero. Full removal side effects, speaker rotation and all discussions are still UNREAD. `FiredStaff`, entry `0x140b7a3cc`, draws `rand()%10`, with several cases branching on FiredStaffType 1..7. Its inspected body prints role-specific reactions and pauses. It does not itself clear the staff roster or debit wages. Firing state must be traced at its caller.

**Authorship and save:** dialogue is mostly embedded native text with predicate reads. FirstMeeting is main-writer index 1578; role names, portraits, wages, mind/skill/training fields have separate writes. CouncilStaff is absent from the bounded writer census and is rebuilt here. Temporary attendance is not thereby proven resumable mid-conversation. No save round trip was run.

**PROPOSAL mapping:** K6/K7/K11/K14; P07/P19/P21/P24; dialogue and characters owners. A saved pending YAIRPG meeting needs actual speaker/transaction continuation, not only a count of employees.

## S06: monster care joins stock, training and public reaction

**Payoff:** bodies and companions gain from an activity that spends real means.

**Model, SHOWN:** `MonsterViewer`, entry `0x140b0e92d`, selects one of three slots into local description, name, image, color, strength, abilities, Fed, armor, XP and level. Feeding is offered and accepted only when local Fed==0; exit writes the selected Fed flag back. Rename/unname alter labels separately from combat facts. Discard clears the selected identity/state, armor and XP and resets level to one.

**Rules, SHOWN:** the selected peasant-feeding route requires YourPeasants>0, removes one, sets Fed=1, adds 5 XP, checks XP>99 and calls MonsterLeveller once. A `rand()%5==0` rumor costs 3 PublicOpinion; a separate `rand()%3==0` adds one strength. Other feed branches have their own stock and reaction effects. An important inconsistency: the branch gated by YourTribal>0 decrements AslonaTotem at `0x140b0f4c0`, not YourTribal. This is confirmed in assembly; do not silently translate it to intended stock conservation. These source acts are not proposed YAIRPG content.

**Cadence and save:** retained `RefreshPhase` instructions `0x140a11f60..0x140a11f74` clear all three Fed flags. On the previously traced annual path refresh precedes Year++. This closes the reset reader, not all annual entry routes. Feed flags are saved at 1468 onward; first-slot XP/level at 1896/1897, armor at 1771. Prior growth remains +newLevel+1 strength and -100 XP per helper call. No starvation timer or compulsory care system is established.

**PROPOSAL mapping:** K3/K6/K8/K10/K18; P06/P09/P13/P15; genetics round 13, nonhuman progression and life-sim owners. Transfer the activity/cost/growth relationship using original world-supported inputs.

## S07: monster combat reads generated abilities

**Payoff:** generated body parts have demonstrated mechanical readers.

**Model, SHOWN:** `MonsterFight`, entry `0x140b12035`, accepts generated or selected temporary creature records with strength and three ability slots each. It has separate local HP, owned-monster selectors, trainer skill, background and winner state. It does not simply compare MonsterStrength and declare the larger winner.

**Rules, SHOWN for positive safe input S:** a five-way mood draw sets starting HP to: (0) `4*(rand()%S+1)`; (1) `4*(floor(S/2)+rand()%floor((S+1)/2)+1)`; (2) `4*(S+rand()%floor((S+1)/4)+1)`; (3) `4*(S+floor((S+1)/4))`; (4) `4*(S+floor((S+1)/2))`. Small S can make a modulo denominator zero in selected formulas; caller validation remains open. No robustness guarantee is inferred.

For an owned side, trainer multipliers are truncated to integer HP: absent trainer .95; skill<50 .98; 50..79 unchanged; 80..99 1.05; 100..119 1.10; 120..139 1.15; 140..159 1.20; >=160 1.25. Constants at `0x140fc2900`, `0x140fc2930`, `0x140fc29b8`, `0x140fc2988`, `0x140fc2a98`, `0x140fc2990`, `0x140fc29a8` were decoded from bytes and threshold branches checked in assembly.

If all six ability values sum to zero the match is canceled as docile. Otherwise a live-HP loop draws one of three ability slots; ability-specific subdraws apply HP effects. A zero slot can consume an attempt without entering an ability effect. Full per-ability damage tables, armor effects, human fights, timing and termination guarantees remain UNREAD. Death branches clear owned creature state; selected participation branches add 50 XP and invoke leveling when XP>99. Full ownership/winner predicates for every XP award remain open.

**Authorship and save:** `Data/monsters.txt` supplies generated ability IDs; native switches author their effects. Saved body/XP/armor records outlive local fight HP, but mid-fight resume was not shown. **PROPOSAL:** K3/K10/K18; P15/P17/P16; nonhuman progression and ability authoring. Preserve anatomy, health, training and action grammar as separate facts.

## S08: Protofolk community states and immediate loot

**Payoff:** a local community remembers the encounter and changes later options.

**Model, SHOWN:** `ProtofolkTribe`, entry `0x140bca87a`, loads one of two durable communities into local tribe type, leader type, population, name and portrait. Tribe types 0..4 have live local routes; defeated forms use type+5. Friendly/hostile leader variants change menu branches. Exit writes the locals back to the selected ProtoTribe* fields.

**Rules, SHOWN:** one encounter choice maps leader type 0→5, 1→6, 3→8, 4→9. A separate type-0 gift route requires Bluetrii>0, removes one and adds five to the leader-type value. Do not label every talk branch a relationship increase. Attack prepares the selected community's population as extra troops, score 95, sets BattleAttackType=1, AttackerIsYou=1, BattleSimRelDrop=1 and calls the shared battle path. Afterward it rereads the real population; if <1 it transitions the place to its defeated form.

The defeated route calls QuestGenerator, describes the resulting item, then adds questItemValue directly to YourGold. Assembly joins are at `0x140bd2313..0x140bd244a` and `0x140bd43e0..0x140bd4517`. This is immediate loot valuation. No inventory item, buyer, delivery objective or journal is established by this path. Other QuestGenerator callers remain open.

**Authorship/save:** native finite state branches, talk pool and QuestItem value pool. State and identity are writer indices 1713..1724. Destruction, social change and reward are distinct writes, not a single prose flag. Full commerce, pit fights and all leader-state readers remain UNREAD.

**PROPOSAL mapping:** K5/K6/K7/K9/K12/K16; P07/P12/P15/P19; world kit, characters and chains round 5. A YAIRPG physical object should not become money until an actual selected sale/salvage consumer acts.

## S09: nomad camps reuse local culture and a shared activity

**Payoff:** one activity feels local through participants, access and world state.

**Model, SHOWN:** `NomadCamp`, entry `0x140a8792c`, reads SouthNomadsLocation, SouthernNomadsTurned, population and mercenary counts. Hostile and ordinary routes differ. After a selected battle, population+mercenaries==0 marks location=3. The same place supplies dialogue, travel-related branches and brawling.

**Rules, SHOWN:** choice 3 samples `Data/NomadTalk.txt` by counted rows; a separate `%45==0` draw replaces ordinary delivery with a song path. Choice 4 prepares a FreeBrawl. First contestant `%25` residues 0/1/2 choose fixed score/health pairs 300/300, 20/350, 315/250; other residues generate a nomad name and request default brawler setup. The second draw uses the same special types but checks it differs from the first special type, otherwise falls back to generated setup. This prevents that selected special-versus-itself pairing, not universal name uniqueness. Both then call FreeBrawl.

**Authorship/save:** compiled cultural variation plus the 64-row talk pool. SouthNomadsLocation is writer 1158; population/mercenaries 1160/1161; turned state 1165. Brawler scratch globals are not a demonstrated durable crowd. Camp movement cadence, all trading, TitanBone routes and FreeBrawl's complete resolution remain UNREAD. No marriage, hereditary clan or household economy is proved.

**PROPOSAL mapping:** K5/K6/K8/K10/K14; P07/P15/P21; life sim and world kit. Use an existing original activity with world-qualified cast and terms instead of copying a minigame per culture.

## S10: traveling duel with alternate recruitment route

**Payoff:** a competition can change recruitment and wider danger.

**Model, SHOWN:** `TravDuneReavers`, entry `0x140be93e8`, tests treasury and the existing champion slots; a second menu lets a known champion's information be inspected. The challenge sets ArenaDuelBackground=1 and delegates to ArenaChallengeChoice. Its return status selects the settlement branch.

**Rules, bounded SHOWN:** the challenge admission rejects funds below 1,000 or an unusable champion roster. When the delegated helper returns ArenaDuelBackground==99, the observed success adds 50 YourBandits, reduces a positive GlobalBanditLevel by 2 with a zero floor, and sets WheresDunereavers=0. The opposing settlement branch subtracts 1,000 gold and resets GabeChallenge. This helper does not debit the 1,000 before the duel in the shown path; do not import a guessed escrow model. Exact delegated combat/win condition and every champion qualification remain UNREAD.

**Authorship/save:** native encounter and tournament adapter; champion IDs/score/portrait feed it. Treasury, troop count and global/local flags have main-save writes, with exact references retained privately. No timer or guaranteed repeat frequency appears in this helper; encounter location/cadence belongs to callers. TravDuneWarriors is a separate watch/talk route, with HireableWinner=0 and an 18-row talk pool, not this reward path.

**PROPOSAL mapping:** K6/K7/K10/K12; P06/P10/P12/P18; characters and engine owners. Quote the actual selected commitment and let an earned result change a real downstream service or threat.

## S11: children’s gang resolution

**Payoff:** head count, local closure and standing can all matter in a small social scene.

**Model, SHOWN:** `KidsHideout`, entry `0x140ad68de`, uses BlackmarketKidsName/Leader/Face, Members, Location and KidRelation. Identity and random small talk are distinct from transaction choices. `Data/Ruffian.txt` supplies 49 lines.

**Rules, SHOWN for ordinary nonnegative member count M:** choice 4 requires gold>=M, subtracts M, adds one PublicOpinion and five KidRelation, exits and sets location=99/members=0. Choice 5 requires gold>=10M, subtracts 10M, adds two PublicOpinion and ten KidRelation, then clears the local gang similarly. Insufficient gold prints refusal without the corresponding debit or closure. Choice 6 credits 2M gold then clears the local gang. Choice 3 also closes it without these aid transfers. All are source-specific social outcomes, not universal YAIRPG ethics or prices.

**Authorship/save:** compiled choice/effect branches plus row-pool speech and child/guard portrait settings. Identity/count/location are indices 1341..1345; KidRelation 1608; PublicOpinion and treasury are separate saved facts. The helper closes the current encounter but does not prove that the wider children system is permanently exhausted. Spawn/return/reset and who reads KidRelation remain UNREAD.

**PROPOSAL mapping:** K6/K7/K8/K12; P18/P19/P12; dialogue, life sim and society. Display per-person and total aid from the actual transaction; preserve local closure separately from future repeat eligibility.

## S12: neighborhood events and quiet draw mass

**Payoff:** the same city can have region-specific events without treating every visit as a major quest.

**Model, SHOWN:** `CityExploreEvent`, entry `0x140ac9695`, dispatches on CityEvent (top range below 7). Neighborhood branches set MarketPart for art and read local laws, stocks, hidden-market discovery and treasury. Event rules are compiled rather than a single external event table.

**Rules, bounded SHOWN:** CityEvent=1 draws `rand()%40`, but its inner switch accepts only values<15. Thus residues 15..39 skip that neighborhood switch, at least 25/40 direct quiet slots at this layer. Selected case 0 requires gold>49, draws `rand()%20+5` and removes that 5..24 gold. It has no consent choice. Another selected purchase branch checks gold against the quoted Randomiser2 before subtracting and has a separate `%11==0` opinion gain. Do not infer a commodity supply chain, a general theft AI or a 15/40 realized event rate across every neighborhood.

**Authorship/save:** native conditions and effects reuse black-market graphics, name/face pools and saved local state. CityEvent/MarketPart are control context; durable effects include YourGold, PublicOpinion and discovered-market flags. Their exact save references remain private. Caller cadence, every law-specific branch, event reset and all six neighborhood matrices remain UNREAD.

**PROPOSAL mapping:** K5/K7/K8/K12/K14; P10/P12/P21; world-kit KW3/FK2 and characters. Separate attempted candidate weight, actual eligibility and quiet outcome.

## S13: tutoring is selectable explanation depth

**Payoff:** let a reader ask for more or less detail without hiding the actual action.

**Model and rules, SHOWN:** `Tutoricroll`, entry `0x140b9f584`, initializes three local controls: explanation depth=0, topic=0, mode=1. Initial choice 1/2/3 sets depth 0/1/2 and advances mode to 2; choice 0 exits. Topic loops have their own next/back/choose-depth routes. They render sample kingdom menus and read KingdomLoadout to alter presentation. The body supplies detailed, standard and simple explanatory text through compiled branches.

**Connections/authorship:** it reuses the diplomat's portrait and the same console choice routines. The inspected body has no durable learning grant, skill-XP transfer, research experiment, recipe unlock or tech dependency graph. Calling it a technology progression system would be unsupported. Its sample-year display is authored illustration, not a world-clock advance.

**Save:** depth/topic/mode are locals and are initialized on entry; these controls are not demonstrated persistent player settings or pending-dialogue state. The shown globals are mostly presentation controls. This closes what the tutor helper does while leaving unrelated knowledge/technology systems unproved. Full text is retained privately; no source paragraphs are copied here.

**PROPOSAL mapping:** K11/K14; P01/P03/P11/P21. Technology round 13 FT5 already points at actor knowledge evidence; tutor presentation should extend its reader without creating a new knowledge store or pretending reading text grants competence.

## S14: initial faction budgets and procedural clan names

**Payoff:** initial world variety can conserve a finite allocation and derive usable troops from it.

**Model/rules, SHOWN:** `GoblinGenerator`, entry `0x1409285bd`, starts five TribeLand values at one, distributes ten additional units via ten `%5` draws, then sets ordinary men=100*land and warlords=10*land. INFERRED arithmetic invariant: total land=15, ordinary men=1,500 and warlords=150 immediately after those assignments, absent integer overflow/other callers. TGn is multiplied by land*300, so this helper is not shown to initialize treasury from a clean constant. Its input initialization matters.

`BanditGenerator`, entry `0x14092b410`, also starts five land values at one. Loadout 2..7 sets allocation budget 5/10/15/20/35/50. The distribution loop additionally requires loadout!=2: loadout 2 therefore leaves five starting land, not ten. For active other budgets it spends each unit into one random faction. Troops per faction = land*(40+rand()%250); warlords = land*(4+rand()%30). It then generates five faction names and leader name/score/portrait/type records.

`GoblinClan`, entry `0x1408f7835`, assembles lexical fragments with `%31`, `%10`, `%40` draws. Its last switch has 27 explicit cases and no assignment for other residues. It is not a genealogy or clan-politics simulator. Do not multiply draw ranges into a valid unique-name total; untouched scratch values and duplicate fragments matter.

**Authorship/save:** compiled budget allocation and role-specific naming reuse; source land/men/leader fields are main-save globals. TribeLand1..5 are 309..313 and BanditLand1..5 are 46..50. Ongoing growth, reproduction, leaders' inheritance and full treasury initialization remain UNREAD. **PROPOSAL:** K4/K6/K7/K8; P15/P06/P16; world kit and genetics round 13. A clan label is not evidence for bodies or lineage.

## S15: battle aftermath and renewable availability

**Payoff:** world memory can record the cost of an outcome while recurring opportunities reopen on an explicit clock.

**Political rule, SHOWN:** `PostBattleOpinionLoss`, entry `0x140c872d1`, does nothing when AttackerIsYou!=1. When attacking with YourFighters>0, it adds opinion: +1 if initial player total exceeds enemy total, +4 if lower, +2 if equal. With no surviving fighters it subtracts a base 3/1/2 for those same larger/smaller/equal cases, plus a size term: 0 below 1,000; 1 at 1,000..2,499; 2 at 2,500..4,999; 3 at 5,000..9,999; 4 at 10,000..24,999; 5 at >=25,000. Assembly confirms the signed thresholds. This is a deterministic social consequence reader, not the whole battle win/loss model or a rumor simulation. Caller guards remain open.

**Refresh rules, SHOWN in retained assembly:** `RefreshPhase 0x140a11f60..74` clears all three monster feeding flags; `0x140a15265` clears SmallHavenRecruit, with neighboring local recruitment/challenge clears. `0x140a11fa7` onward decrements a positive VassalCooldown1 by one, with analogous selected slots. This upgrades prior unknown SmallHaven repeat cadence on paths that run refresh: the local transfer is renewable, not a permanent once-only reward. At `0x140a13d2c..67`, WagonMan==1 and WagonMen<=150 add one WagonMen; TravM==1 adds another within that admitted branch. That is a merchant-state consumer, not a shown TravM expiry/reset.

**Authorship/save:** native aftermath and phase order; PublicOpinion, troop totals' owning state, cooldowns and recruitment flags use the main save. Viewing a report is not itself shown to run a refresh. The previously traced annual path calls refresh before Year++, but all entry paths, away time and aging remain UNREAD. No offline catch-up inferred.

**PROPOSAL mapping:** K8/K10/K12/K16/K18; P10/P12/P13; characters and offline-clock owner. Keep outcome memory, opportunity reset and elapsed-time policy distinct.

## Boundaries on the requested themes

**F1 SHOWN within this read:** bodies have part-derived abilities, growth, local fight health and armor. No inherited genome, parent-child lineage or sex/gender inheritance model was recovered. Names, a clan label and a year-like roster value cannot fill that gap.

**F2 SHOWN within this read:** tutoring presents explanations; generated groups and local settlements have persistent facts. A research experiment, technology tree or multi-step material production chain was not established. The existing technology and chain palettes are destinations for proposals, not evidence that Warsim implements them.

**F3 INFERRED:** the strongest transferable result is the join among a generated fact, a real activity and durable local aftermath. The fifteen sections intentionally keep full-lifecycle gaps visible instead of converting helper names into claimed simulation depth. See [CHECKPOINT](CHECKPOINT.md) for every inherited gap and [FAMILY_MAP](FAMILY_MAP.json) for every inventory row.

## EXTRAS: cheap closure of the static reference files

**SHOWN:** all 38 prior Extras text entries, 1,623 physical lines, were read as static text and retained privately with file/line locators. They include art/concept material, old portrait parts, a 116-line cheat/debug reference and a retired race-row example. This closes their prior metadata-only retention gap, not their native feature consumers.

**STATED by the installed notes:** the retired race example describes manual table insertion; old portrait notes describe replacing a specific part category; concept notes describe fragment layers and naming constraints. These are shipped author notes, not proof of a current validation API, live mod loader or supported compatibility contract. No replacement or code entry was performed. The cheat list separately describes ordinary cheats, tests, start loadouts and debug starts; none of those effects were executed or certified.

**INFERRED:** keep historical example, current definition and supported extension contract separate. YAIRPG mappings: K1/K4/K14/K18, P14/P16/P22, ENGINE_AUTHORING and the starts/ending palette. The old classic executable and runtime asset rendering stay UNREAD. Private inputs: `extract/extras/Extras/` and `extract/extras-index.json` in this lane.
