# Settlements, work and faction consequences, second pass

Research only, 2026-10-08. The useful Kenshi pattern is a place that changes who can reach you and what they want. A workshop is both a production facility and a political address; removing a ruler changes local services and the people encountered on the road.

## Evidence boundary

Private source root: `~/.codex/research/kenshi/`. Database locators below name the original input file, record ID and decoded record-start byte offset. The reviewed exports are separate file layers, not a reconstructed final runtime database. Flags observed here include base `2147483650`, patches `17`/`19`, and new records `16`; their values are retained as provenance, without asserting that every reference-list replacement, inheritance order or deletion rule was reproduced. See the first-pass [decoder boundary](../FINDINGS.md#recovery-evidence-and-limits).

`inputs/fcs.def` is the editor's authoring schema. Its descriptions and decompiled enums establish intended field meanings, not native execution. No gameplay run, native executor, final map-instance resolution, raid scheduler, town-override precedence or save reload was exercised. Every runtime consequence below is an authored chain with that limit. Paraphrases only; no raw dialogue or copyrighted descriptions are reproduced.

## S-F1: A basic building can establish a political address

Base `4092-TwoStorey.mod`, offset **459649**, Small Shack, sets `creates player town=true`, `build materials=5`, `build speed mult=3`, and references doors/interior/parts. `Newwworld.mod` offset **10560** patches its destroyed boundary; `rebirth.mod` offset **33162** patches `max slope=10`, ambience and power. Schema **478** says construction creates a player town if none exists there. By contrast the Small Table patch `3471-otto.mod`, rebirth offset **922**, explicitly sets `creates player town=false`. The distinction connects construction choice → town identity → eligibility for faction base visits, rather than declaring every placed object a settlement.

The shack's material count is the base field, not a computed final construction transaction. Founding radius, naming, purchase inside an existing NPC town, ownership and completion threshold remain native-unread.

## S-F2: Extraction makes the next building possible, while work affects the worker

Base Stone Mine `1509-gamedata.base` at **3179274** links functionality `1517-gamedata.base` and an upgrade. Rebirth **255246** sets its `output rate≈0.8`, `max operators=3`. Functionality base **2155838** produces Raw Stone `1515-gamedata.base`; rebirth **171488** sets `world resource mining=2`, `hunger rate≈1.2`. Decompiled `MiningResource.cs` maps 2 to STONE; `StatsEnumerated.cs` maps `stat used=3` to LABOURING. Schema **537** ties local ground resources to mine production. Thus geology and worker capacity connect to production, and the labor itself has an authored body cost.

Manual Stone Processor `1863-gamedata.base`, base **4263708**, links `1516-gamedata.base`. Rebirth **346055** changes it to no power draw, three operators, and construction Iron Plates `42159-gamedata.base` quantity 6. Stone-processing functionality base **2515645** consumes stone and produces Building Materials `580-gamedata.base`. Material item base **1526862** has stone ingredient value 200; rebirth **114829** retains that ingredient and changes value to 150. Chain: bring initial metal → make workshop → local stone → construction material → expand the place. No exact yield is inferred from overlapping item ingredients and functionality consumption values: schema **530–532** distinguishes override ingredients, output-per-day and production multipliers, and this processor does not declare an ingredient override.

## S-F3: Mechanization changes labor, infrastructure and bootstrap requirements

Rebirth Manual Iron Refinery `47237-rebirth.mod`, **1401216**, has `power output=0`, `max operators=3`, `output rate=.75`, and construction reference to 6 Iron Plates. Iron Refinery `42167-gamedata.base`, **887435**, has `power output=-10`, two operators, output rate about .9, construction reference to 10 Iron Plates and an upgrade to `42168-gamedata.base`. Both link functionality `42170-gamedata.base`, **775524**, with `stat used=3`, raw-iron consumption `1866-gamedata.base` and Iron Plates output. Iron Plates item `42159-gamedata.base`, **991059**, independently names raw iron in its ingredients. Schema **449** explicitly defines negative power output as drain.

This is a connected choice: hand work can bootstrap metal infrastructure without electricity; the powered version spends infrastructure for different capacity and output settings; its product also builds the machines. Actual speed with skill, power shortage penalties, operator scaling and upgrade resource settlement were not read. The data supports a project tradeoff, not a universal claim that every upgrade removes a worker.

## S-F4: Farming is a local ecology and work window, not one universal crop timer

Hemp Farm `2021-gamedata.base`, base **367566**, links farm type `40567-small_changes_otto.mod` and farming functionality `2022-gamedata.base`, with `creates player town=true`. Functionality base **3029015** consumes Water `1914-gamedata.base`, produces Hemp `1965-gamedata.base` and uses stat 12, FARMING. Farm type base **1138215** has green suitability 1, arid/swamp 0, growth time 5, harvest time 10. Rebirth **84700** changes arid to about .4, swamp to 1, growth to 18, harvest time to 48, fertility effect to about .15 and drought multiplier to 0. These named layer differences matter: a base-only read would describe a different ecology.

Chain: location/crop choice → growth suitability → water and labor → harvest opportunity → town supplies. The growth/harvest numbers remain authored values, not a measured number of hours or proven crop failure probability. Drought multiplier zero is recorded without inferring the executor's zero handling. This extends first-pass bread with upstream ecology rather than repeating its recipe.

## S-F5: Tax collection is a faction-backed repeat relationship with escalation

United Cities faction `defaultEmpireFactionSID`, rebirth **139005**, explicitly lists campaign `61061-Dialogue.mod`. The campaign's Dialogue layer **9438793** has territory triggers, base targeting and four AND world gates: Anti-Slaver ally false (`59927-Dialogue.mod`, **9121589**), UC enemy false (`61004-Dialogue.mod`, **9422331**), UC ally false (`59744-Dialogue.mod`, **9064703**) and Tengu alive true (`59583-Dialogue.mod`, **9019935**). All predicate records here are Dialogue.mod. Rebirth campaign **610640** patches chance/day to .5, near/far distances 2200/3500, minimum forces 3 and bodyguard inheritance `61857-rebirth.mod`, rebirth **2268368**, which names squad `61858-rebirth.mod`.

The same rebirth patch routes loss to enforcement `61063-Dialogue.mod` with tuple `[24,72,100]` and victory to repeat visit `61062-Dialogue.mod` `[96,120,100]`. The repeat visit rebirth **611021** repeats itself on victory and uses `[12,48,100]` for loss. Enforcement rebirth **611379** changes minimum forces to 30 and inherits weak empire forces `61376-rebirth.mod`, **2267800**, naming patrol/bodyguard squads. Chain: faction reach + ruler + player diplomacy → visit → authored campaign outcome → return visit or stronger enforcement.

Schema **1092/1109** defines trigger tuple timing bounds and percent chance, but exact units and victory/loss resolution are not established in this read. Dialogue payment/refusal branches were not traversed, so no tax amount or claim that every refusal causes loss is made. `is hostile` is message presentation per schema **1090**, not proof of combat behavior. Here the rebirth first visit explicitly patches it false.

## S-F6: Tribute has different eligibility and an actual food-taking behavior target

Shek Kingdom faction `11624-Dialogue (10).mod`, Dialogue **193507**, lists `59668-Dialogue.mod`. Tribute campaign Dialogue **9044798** requires population at least 5; rebirth **596663** patches chance/day .15, far distance 1500, repeat limit 9999 days, minimum forces 5 and `target tech level >=1`. **Crucial interpretation:** schema **1118** says that last field means **town size level**, explicitly no longer technology. Schema **1116** says repeat limit is a territorial frequency limit in days, not a lifetime visit count.

The Dialogue campaign combines Shek ally false, Bugmaster/Phoenix alive true, Bayan-not-alive false, Seto-not-alive false, player-involved Esata-not-alive false, and Shek enemy false. Locators: predicates `59685` **9052965**, `58299` **8706767**, `58592` **8759320**, `58591` **8759137**, `59784` **9078690**, `59782` **9077676**, all `-Dialogue.mod`; the last has rebirth involvement patch **598705**. These are conjunctions and involvement-sensitive conditions, not simply a relation score.

Campaign inheritance names `62172-Dialogue.mod`: Dialogue **9743047**, rebirth **621224**, whose arrival/victory AI target is `64228-rebirth.mod` at **2442477**. That package contains food-looting task `2590-gamedata.base` (base **2698825**, enum 131), protect-allies, nonurgent medic and home-return tasks. The task's full native resolution and priority remain unread; the authored connection is a tribute visit with food-taking behavior, not a generic gold tax. Rebirth campaign loss links Shek assault `59673-Dialogue.mod` after `[6,12,100]`; its Dialogue record **9048091** retains several ruler/relationship gates.

## S-F7: Ritual attendance is another settlement obligation, with a different armed aftermath

Holy Nation faction `1083-gamedata.base`, Dialogue **190462**, lists Prayer visit `98999-Dialogue.mod`, Dialogue **11506083**. That campaign is territorial, base-targeting, chance/day .5, near/far 1500/2000, and lists priest squad `99003-Dialogue.mod`, **11507746**, whose leader is `17086-Dialogue.mod`. Its conjunction requires Phoenix alive true (`57392-rebirth.mod`, rebirth **2216417**), Holy Nation enemy false (`60964-Dialogue.mod`, Dialogue **9415795**) and Flotsam ally false (`59817-Dialogue.mod`, Dialogue **9088912**). Rebirth **659793** adds Shek ally false through `59685-Dialogue.mod`.

Loss links prayer-day assault `1531991-Dialogue.mod`, Dialogue **11580789**, with tuple `[24,72,100]`. That assault references attack/capture inheritance and still gates Phoenix alive. Chain: who rules + whom you support + a settlement in reach → ritual visit → campaign outcome → armed response. Attendance, sex/race checks and possession of religious items require dialogue traversal outside this finding; no dialogue-name-only inference is made. Preserve a difference between periodic civic ritual and the money/food demands above.

## S-F8: Relations belong to a network, while coexistence is a separate restraint

Rebirth UC faction **139005** sets relations to Holy Nation `1083-gamedata.base` -100, Slave Traders `1084-gamedata.base` +60, Traders Guild `1088-gamedata.base` +100. Slave Traders rebirth **259990** has Anti-Slavers `58229-Dialogue.mod` -100 and Rebel Farmers `54297-rebirth.mod` -100; Traders Guild rebirth **161296** links UC +100. Holy Nation rebirth **313431** links UC and Shek -100. Shek rebirth **324552** separately lists UC and Traders Guild in `coexistence`, while its relation list links Holy Nation -100.

Schema **1077–1078** gives relation range -100 to +100 and default fallback. Schema **1014** describes coexistence as a tendency to avoid provoked-neutral destruction while still allowing fighting. Together with S-F5's explicit player-alliance gates, these records distinguish faction-to-faction ties, player stance and restraint policy. Native combat thresholds, symmetry, relation propagation and dynamic reputation changes were not recovered. No universal rule that befriending one faction automatically changes every ally's player relation is claimed.

## S-F9: Removing two local power holders can repopulate a coerced workplace as a service town

Rebirth Slave Farm South `1533495-__world reactions Slavers.mod`, **3627633**, is owned by Slave Traders and lists two overrides. The destroyed override `1533524-__world reactions Slavers.mod`, **3625881**, has `residents override=true`, type 4, resident `96455-rebirth.mod`, and Grace-alive predicate false. It also points onward to farm-town override `1533692-__world reactions Slavers.mod`, **3626635**. The latter has `residents override=true`, type 2, Free Traders faction `1229-gamedata.base` and **both** Grace-alive false and Slave-Market-Master-alive false.

Predicates are rebirth `1533506-__world reactions Slavers.mod` **3710189** and `1533501-__world reactions Slavers.mod` **3709054**; both are `player involvement=false` and check unique NPC alive status 1. Their characters are Grace `1533497-__world reactions Slavers.mod` **3594038**, and Master `1533500-__world reactions Slavers.mod` **3587893**, both unique. The farm-town residents actually include fish shop `1533585-__world reactions Slavers.mod`, **3664368**, with vendor `50340-rebirth.mod`, leader `56144-rebirth.mod`, daytime public access and vendor money 1000, plus peasant barracks `1533586-__world reactions Slavers.mod`, **3663386**, with squad `1206-gamedata.base`, peasant AI and supplies.

Chain: named custodians' status → conjunction → replacement faction/residents → changed shop and labor population. Schema **1746/1749/1755** supports repopulation, replacing faction-default residents and AND gates. Defeating Grace alone does not prove a recovered market. Both destroyed and recovered candidates can qualify when both predicates are false; precedence and nested override choice are native-unread. Alive=false is not asserted to be identical to dead, imprisoned or killed by the player.

## S-F10: Leader status changes who walks the roads, not only the town sign

Rebirth biome The Hook `51654-rebirth.mod`, **1703162**, lists two `homeless spawns`: `1533740-__world reactios swamp.mod` with tuple `[200,0,0]` and `1533741-__world reactios swamp.mod` `[250,0,0]`. The ordinary rebel-farmer squad at **3775228** requires Merin-alive true, has Rebel Farmers faction `54297-rebirth.mod`, malnourishment true, several AI packages and farmer soldiers. The heavy variant **3776471** requires the same state false, has faction `1532900-__world reactions NE.mod`, leader `1532901-__world reactions NE.mod`, different squads and AI `2672-gamedata.base`, with malnourishment still true.

State `1533705-__world reactions Slavers.mod`, **3732505**, checks unique Lady Merin `1533702-__world reactions Slavers.mod`, **3721282**, alive and does not require player involvement. Schema **1672** gates squad spawning with AND world states. Chain: person status anywhere → eligible regional spawn roster → changed encounter faction/composition/behavior, with an existing hardship flag preserved. The spawn tuple numbers are authored weights/settings, not encounter percentages, and no claim is made that already-spawned squads transform instantly.

## S-F11: A ruler's removal can stop ordinary collection while inviting pursuit of the character

Tengu is unique in Dialogue `51751-Dialogue.mod`, **6967386**. Dialogue states explicitly distinguish player-involved death `60659-Dialogue.mod` **9332403**, imprisonment `60660-Dialogue.mod` **9332577**, and not-alive `60098-Dialogue.mod` **9166786**. The normal collection campaign S-F5 requires Tengu alive; pursuit campaign `60456-Dialogue.mod`, Dialogue **9268457**, instead requires player-involved Tengu-not-alive true, player-involved Eyegore-not-alive false (`60413-Dialogue.mod`, **9257116**) and all-nobles-not-alive false (`1533311-Dialogue.mod`, rebirth **663406**). It names unique Eyegore `56576-Dialogue.mod` as special leader and uses `target characters=true`, `ignores nogo zones=true`. UC Dialogue faction **81762** lists the pursuit campaign.

Rebirth pursuit patch **602573** changes minimum forces to 80, near/far to 99999 and chance/day to **2**, while still inheriting force definition `61909-rebirth.mod`. Do not turn 2 into a claim of “200% probability”: schema **1112** documents 0–1, so scheduler clamping, repetition or special handling is unknown. Schema **1100/1103** says special leaders must be available and character targeting can operate without a player base. The alternate Dialogue campaign `95996-Dialogue.mod`, **10953356**, consumes Eyegore-not-alive true and names different forces; its faction attachment was not verified here.

Chain: ruler status + responsibility + surviving command structure → ordinary levy becomes ineligible → differently gated retaliation can pursue the player beyond a base. A demolished or abandoned workshop is therefore not demonstrated to erase consequences. Captivity is separately authored; native alive/not-alive semantics are not inferred from the designers' shorthand names.

## Small touches for vanilla YAIR, proposals only

The mapping starts from native professions, crafting stations, equipment and location actions, not a forced survival redesign. `src/crafting_recipes.js` directly supports materials, station levels, relevant skills and quality; world-state/faction behavior would require new scoped content and consumers.

| Code | Small touch | Existing surface to extend | Evidence |
| --- | --- | --- | --- |
| S-T1 | A furnished room stays a room; an exterior workshop earns a settlement name. | Location description and center actions | S-F1 |
| S-T2 | A worker leaves a note that the site's stone seam is poor. | Mining action result text | S-F2 |
| S-T3 | Finished construction material visibly advances one named roof or wall. | Crafting result plus location description | S-F2 |
| S-T4 | The manual furnace is usable during an infrastructure outage. | Smelting station availability | S-F3 |
| S-T5 | A powered upgrade frees one work assignment but needs a functioning supply. | Crafting station and profession availability | S-F3; numbers would be original |
| S-T6 | A crop has a local suitability note before committing the field. | Gathering/location action description | S-F4 |
| S-T7 | A harvest-ready notice differs from a growth-ready notice. | Event feed and center action | S-F4 |
| S-T8 | A collector announces the next visit window after an outcome. | Dialogue and event feed | S-F5 |
| S-T9 | An alliance explains why a collector stops coming. | Location/event message with explicit cause | S-F5 |
| S-T10 | Tribute targets stored provisions; a tax targets currency. | Shop/inventory transaction and dialogue | S-F5–6; transaction design original |
| S-T11 | A growing hamlet crosses an openly named civic size threshold. | Location description and action unlock | S-F6 |
| S-T12 | A local ritual invites attendance without converting all civic visits into combat. | Existing dialogue and center actions | S-F7 |
| S-T13 | Neutral coexistence leaves two rival uniforms in the same market. | Location description and merchant dialogue | S-F8 |
| S-T14 | The former prison farm reopens a daytime fish stall after two custodians fall. | Existing merchant/location roster | S-F9 |
| S-T15 | A road encounter keeps its hunger hardship after gaining an armed leader. | Encounter description and composition | S-F10 |
| S-T16 | A ruler's capture and death produce different remembered facts. | NPC/life record and faction dialogue | S-F11 |
| S-T17 | Leaving a workshop does not erase a named pursuer's reason to look for you. | Travel actions and explicit encounter eligibility | S-F11 |

## Checkpoint

Owned output: this file only. Read the dispatch assignment, first-pass findings, live PROJECT and GM/north-star owners. Queried all four parsed database layers and editor schema/enums; checked concrete faction attachments, town replacements and biome spawn consumers. Preserved the dirty shared checkout. No source/build/save/commit edits, reinstall, native execution or raw-data copy into the repository. Remaining research limits are explicitly attached above; these findings are ready for the coordinating GM's synthesis, not accepted gameplay decisions.
