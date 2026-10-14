# One grammar, several kinds of extension

KoLmafia is a third-party client. SHOWN here means its representation and checks, not Asymmetric's server implementation. The architectural explanation is INFERRED from that model and STATED wiki rules. Source pin: [`d6747f7af98605b14eaeb2c63e11daa9532e1152`](https://github.com/kolmafia/kolmafia/tree/d6747f7af98605b14eaeb2c63e11daa9532e1152).

## G1: identity stays stable while uses expand

`src/main/resources/data/items.txt` defines identifier, name, description identifier, image, primary/secondary uses, trade/discard/quest flags, autosell and plural. `equipment.txt`, `fullness.txt`, `inebriety.txt`, `spleenhit.txt`, `concoctions.txt`, `coinmasters.txt` and `modifiers.txt` supply other views. A weapon can also be a crafting ingredient; a consumable can also grant a familiar, effect or skill through its specific handler. Adding another item does not require copying its identity into every system.

`classskills.txt` separates identity, tags, MP cost, duration and attributes such as permanence. `statuseffects.txt` separates effect identity, quality, attributes and acquisition actions. Names are often presentation, but Bees, G-Lover and 11 Things deliberately make names part of the rules. Therefore “names are always cosmetic” would be an incorrect generalization.

## G2: common properties combine across different sources

`modifiers.txt` uses a source type, source key and property list. Parsed data contains 39 source types including Item, Effect, Skill, Outfit, Path, Mask, Robot and RobotCPU. The same modifier can therefore arise from several kinds of content. Numeric expressions read current path, class, location, environment, familiar, known skills, active effects and tracked preferences. `ModifierDatabase.java` loads this layer; `Modifiers.java` aggregates and applies it; `ModifierExpression.java` evaluates context.

A new source does not imply a new stat vocabulary. A robot part and an old potion can contribute to familiar weight, resistance or item drops through the same fields. Metadata such as Last Available also lives here, so the 258 lexical fields are not 258 stats or 258 mechanics.

The data-only parser ignores comments and version lines, splits tab fields, and splits modifier commas only outside quotes and square brackets. At both audited commits it finds:

| Client data | Actual records |
|---|---:|
| Items | 12,098 |
| Effects | 3,014 |
| Skills | 1,651 |
| Monsters | 2,389 |
| Adventures | 601 |
| Familiars | 324 |
| Outfits | 178 |
| Modifier source rows | 13,369 |
| Distinct modifier fields | 258 |
| Daily-limit rows | 439 |
| Leading-underscore preferences | 1,096 |
| Standard reward rows | 144 |

These are parsed client records, with possible historical/unused entries. They do not establish live usability or an exhaustive server content count. Exact food/booze yield averages were not recomputed.

## G3: change eligibility without duplicating content

`ItemDatabase.java#unusableInBeecore` and `#unusableInGLover` implement name-based restrictions with explicit item exceptions. G-Lover also permits certain cafe/drink-service offerings. A broad rule and its exceptions coexist in the same client. The archived Class Act page likewise distinguishes permed skills, bookshelf skills and skills learned during the run.

Standard's rolling date rule is stated in both archived indexes. `StandardRequest.java` consumes restricted-content lists; `TrendyRequest.java` handles the Trendy route. A Last Available field alone is not the whole legal-use rule and says nothing definitive about every possible later acquisition source.

Class capacity can override path capacity. `AscensionClass.java` gives Boris 20 stomach/4 liver, West classes 10/9/10, Plumber 20/0/5 and Grey Goo 0/0/0. `KoLCharacter.java` resolves capacities and modifiers. Path enum defaults of 15/14/15 are not effective values for these classes. Eligibility, capacity and special consumption behavior also need separate checks.

## G4: reinterpret properties while retaining identity

STATED: the archived Two Crazy Random Summer page says item changes are stable for a class/moon-sign combination. Equipment enchantments and many consumable properties change, while some hard-coded effects remain. SHOWN: `TCRSDatabase.java` stores name, size, quality and modifier overlays and contains the apply/reset machinery. This is reuse through alternate views of existing items, not an entirely new item inventory.

SHOWN: `Modifiers.java#applyPathModifiers` applies a name-count transform to item-origin potion duration in 11 Things. `monsters.txt` adds `BvR` team tags to old enemy definitions. INFERRED: existing records are extension points for new interpretations, provided the consumer implements them.

## G5: reuse acquisition and goals

SHOWN: `journeyman.txt` has 1,080 class/location/slot tuples. `JourneyManager.java` describes 30 locations, six skill slots per location and 180 skills per class map. Skills appear at four-turn intervals through the 24th visit turn. This makes optional places valuable without replacing the existing skills.

STATED: Community Service replaces Council quests with 11 services whose turn costs respond to existing stats. Low Key keeps Council quests but broadens the final door's key requirements. Sea replaces in-path Council progression with existing underwater content. INFERRED: varying the objective and acquisition route can reuse a large library more deeply than just raising enemy numbers.

## G6: admit real custom mechanics

SHOWN: `YouRobotManager.java` maintains body parts/CPU upgrades, adds ordinary modifiers and separately checks equipment, potion and familiar permissions. Having a bird-cage part is what permits a familiar. `GreyYouManager.java` maintains absorbed-monster and learned-skill sets plus goose reprocessing. `ResearchBenchRequest.java` reads 54 WereProfessor research records with cost and parent relations, checks professor form, learned/available research and available points. `BugbearManager.java` owns biodata and ship-area progression. `PokefamData.java` supplies path-specific familiar attributes/moves.

These are distinct state transitions and handlers. They reuse shared records without pretending all new gameplay is expressible as stat additions. Client tracking can also lag the game: one WereProfessor data annotation says Unimplemented. That is an annotation in this client, not proof that Asymmetric's game lacks the feature.

## G7: scope charges and exit conversions

`DailyLimitDatabase.java#getUses` uses the shared `tomeSummons` counter while the player cannot interact; in aftercore it reads each tome's own counter. Three uses in a shared pool and three per source are different policies. The file has six Tome records and 433 other daily-limit records. A tracking preference is not necessarily a charge or a content module.

STATED: archived path entries distinguish staying in-path, defeating the boss and breaking the prism. Shadows classes keep their class, robot organs become empty, Grey You resets stats and clamps carried adventures, and Tiny multiplies organ occupancy during the exit conversion. These exceptions prevent treating “ascended” as a single generic reset.

## G8: twenty years is reuse plus accumulated exceptions

Legacy explicitly offers replicas of old Mr. Store tools; the client store lists 61 rows. The archived index notes that some resulting skills/items can survive even when the replica itself is path-bound. Some modes revive the relevance of old locations, skills or item names. Others retire a toolkit temporarily through legality rules.

INFERRED: stability in identity and modifier syntax lowers authoring duplication and permits old/new combinations. It does not prove low learning cost, universal compatibility, equal balance, or why the commercial game survived. A few date-scoped snapshots and a current client cannot establish that the grammar was unchanged through every release since 2003. They do demonstrate old and recent content coexisting in the audited vocabulary.
