# Gu and Hogwarts rule derivation, 2026-11-11

Research findings and proposed tests under AD38, AD49 and AD51, using the evidence distinctions in SKR1, SKR17 and SKR21. Start with a wide Gu discovery catalogue, then derive from small sets of book-checked cases. A catalogue entry can be valuable even when it gives us too little to model the ability. Use books to check what a rule predicts and use adaptations to compare how a player might try it.

## Gu catalogue first

The first inventory is in the [private candidate file](novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-candidates.json). It records the captured index hash, archive hash, card URLs, revision IDs and tentative joins. It contains source metadata and names. The live [Saga of Gu catalogue](https://sagaofgu.com/gu/) supplied 1,048 cards. The [saved Fandom index](power-systems/wiki-digests/full-dumps/reverend-insanity_SOURCES.json) supplied 1,158 nonredirect candidate pages by Gu infobox or Gu/rank category. A unique normalized name on both sides paired 704, leaving 344 Saga cards and 454 Fandom pages unmatched by that rule. Pairs still need identity checks. Unmatched rows can be aliases, variants, omissions, or errors. The [Fandom Gu list](https://reverend-insanity.fandom.com/wiki/Page_List/Gu) is another discovery route for mentions that lack a useful individual page.

| Record to keep | How to use it |
|---|---|
| Named, demonstrated Gu | Attach observations for rank, path, function, activation, fuel, upkeep and custody where each is sourced. A concrete scene can support one field while others remain open. |
| Named or mentioned Gu with missing fields | Retain the name, aliases, any role or holder, and the mention locator. The Saga snapshot leaves rank unrecorded on 644 cards and path unrecorded on 863 cards. These counts measure metadata gaps in that snapshot. For example, Fandom lists Beauty with unknown rank and path and a recipe-material clue. The clue is a lead for checking ch. 2238. |
| Unnamed but attested Gu | Use a provisional identity tied to scene, holder and observed behavior. Saga lists [Hei Lou Lan's unnamed movement Gu](https://sagaofgu.com/gu/hei-lou-lans-movement-gu/). Merge sightings only after their identity is supported. |
| Unspecified participants in a move or recipe | Record the known group, role, count or rank band on the move. For example, the supplementary Gu in ch. 961 have an aggregate count. Only create a separate Gu identity where the text gives one. |
| Original or generated Gu | Build from verified function families once there are useful examples and counterexamples. Carry the generator revision and seed for generated content. Keep canon mentions and generated Gu independently searchable. |

The [review index](novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json) combines the held snapshot and [chapter-checked identity evidence](gu-identity-evidence.json). Its 1,466 rows include 78 chapter-checked records, 655 tentative normalized-name pairs, 26 tentative pairs that differ by a trailing “Gu”, 704 unchecked single-source rows and three reference pages. All 2,206 captured catalogue rows are accounted for exactly once. Chapter 275 supplies Red Fire directly, with no individual catalogue row in the held snapshot. It also supplies the roles of Duplicate, Enlarge, Fire Source and Fire Discharge. Their exact ranks and quantitative effects are open. Chapter 326 supplies Seven Fragrances and Nine Eyes, including their different parents, additives and essence ranks. Chapter 345 gives Charging Crash as a rank-four consumer whose extra draw Fang Yuan can afford with Nine Eyes and the lotus. Chapter 1191 reports a rank-eight Liquor Worm as an in-world legend. The exact procedure, conversion ratio and existence of a living specimen remain open. Stealth Rock and Fish Scale form the Stealth Scales branch in chapters 121, 123 and 127. Chapter 123 also identifies Fish Scale as a route to rank-two Scale Armor. The reviewed chapters leave its own rank open despite a rank-one wiki label, and give no complete armor recipe. Stealth Scales and Lightning Eye are checked against ordinary sight, cloaking and physical cover in chapters 127 and 167. Earth Communication Ear Grass is checked in chapters 129 and 169. The hearing and sight channels contribute different route information in smoke. Chapters 64 and 150 establish White Jade’s rank and distinguish outer shield failure, residual lightning and landing impact. The Water Shield rank and repair time remain open. Thunder Shield is checked in chapter 167. The rank and the identity of the separate blue attack Gu remain open. Thunderwings Gu and Lightning Wings Gu are joined by the Chapter 150 wolf and Chapter 159 rank-three flight observations. Chapters 1561, 1570 and 1571 distinguish Myriad Self the move, the realized rank-seven Gu and the Giant Hand move that uses it with mortal Group Strength supports. Chapter 777 anchors the Immortal Self Strength identity. Fixed Immortal Travel's six and seven observations share one kind. The Beast Enslavement and Slavery Gu observations remain distinct. [Chapter 275](https://roliascan.com/read/reverend-insanity/ch275-97662/), [chapter 326](https://asurascans.com/novels/reverend-insanity/chapter/326), [chapter 345](https://asurascans.com/novels/reverend-insanity/chapter/345), [chapter 1191](https://roliascan.com/read/reverend-insanity/ch1191-98668/)

Chapter 16 supplies a checked Photo-audio case for recorded imagery and sound. The chapter leaves the rank, path and activation cost open, and does not demonstrate a replayed attack affecting its surroundings. [Chapter 16](https://asurascans.com/novels/reverend-insanity/chapter/16)

The Year Gu and After evidence adds the expenditure of internal years, same-rank replenishment, rank regression, and a produced gatherer cohort on which its parent depends. Years Flow Like Water adds a production route constrained by the Immortal Year Gu claim. The checked chapters disagree on green-grape activation and on the inherited Year Gu’s stated rank versus year count. [Chapter 1129](https://asurascans.com/novels/reverend-insanity/chapter/1129) · [Chapter 1130](https://asurascans.com/novels/reverend-insanity/chapter/1130) · [Chapter 1401](https://asurascans.com/novels/reverend-insanity/chapter/1401)

The [runtime catalogue](../../src/gu_catalogue.js) uses the checked kind IDs to bind a reviewed ability, move, trait table, conversion or recipe to an existing resolver. Each binding gives its chapters, observed behavior, authored tuning and executable value. Authoring a new binding starts with the checked evidence row and the resolver it will feed. The catalogue test checks that the chapters belong to the cited identity and that open fields and the rank-eight legend have supplied no playable defaults. [Catalogue test](../../tests/gu_catalogue.test.js)

Rebuild the private index from the repository root.

```sh
gu_index_dir=docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11
python3 -I scripts/index_gu_sources.py "$gu_index_dir/gu-candidates.json" \
  docs/research/gu-identity-evidence.json "$gu_index_dir/gu-identities.json" \
  --saga-moves "$gu_index_dir/saga-moves.html" \
  --fandom-index docs/research/power-systems/wiki-digests/full-dumps/reverend-insanity_SOURCES.json
```

### Coverage of the held review index

Of 1,463 non-reference records, 78 have chapter evidence for at least one field and 48 have at least one chapter-backed rank. Both columns can count a kind at several ranks. Chapter-backed ranks include explicitly described ranks as well as observed specimens. The wiki column combines Saga rank and Fandom rank categories. It includes tentative pairs and may conflate variants.

| Rank | Chapter-backed kind records | Kind records with a wiki rank label |
| --- | ---: | ---: |
| 1 | 6 | 80 |
| 2 | 9 | 102 |
| 3 | 8 | 178 |
| 4 | 3 | 153 |
| 5 | 6 | 166 |
| 6 | 7 | 124 |
| 7 | 8 | 99 |
| 8 | 6 | 57 |
| 9 | 5 | 20 |

686 records have no captured wiki rank label and 31 have a rank review flag. 185 records carry a Saga path label across 27 labels, including 18 records with some chapter evidence. The current chapter observation structure has no dedicated path field, so those 18 labels measure overlap and supply leads. By earliest *checked locator* on each reviewed record, chapters 1–500 account for 41 records, 501–1000 for 17, 1001–1500 for 8, 1501–2000 for 8 and 2001–2334 for 4. These are review counts. The number of distinct Gu attested by the novel and their first appearances remain open.

The new observations add the three Iceblade Storm ingredients with rank open, Earth Overlord and Borrow Strength at rank five, and the Wind Overlord and Tyrant Strength substitution with ranks open in the checked passage. Chapter 1452 anchors a mortal rank-five Year Gu and four production routes for one market. Use these as mechanism samples. [Ch. 167](https://asurascans.com/novels/reverend-insanity/chapter/167) · [Ch. 543](https://asurascans.com/novels/reverend-insanity/chapter/543) · [Ch. 560](https://www.pyg-kit.com/en/books/reverend-insanity/chapters/78514) · [Ch. 1452](https://asurascans.com/novels/reverend-insanity/chapter/1452)

The late-book comparison adds Imperial Lotus, Heavenly Secret and Light Gu. Resolving the Heavenly Secret alias combines two formerly single-source rows. The Lotus catalogue pages span the wider family, so their rank metadata still needs review against the checked rank-eight and rank-nine observations. [Late advancement and interference matrix](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#late-immortal-advancement-and-interference)

Love Gu adds a chapter-checked distinction between acknowledgement and command. The Light Gu observation now reaches the later seizure of its still-nurturing host. [Control and custody matrix](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#late-immortal-advancement-and-interference)

Self-reliance and All-out Effort add checked mortal input evidence for Myriad Self. The All-out Effort ranks count the stated batch range. Exact quantities and the presence of every rank in the batch stay open. The observed first activation of Myriad Self follows both living emergence and the later control step. [Refinement trace](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#from-a-known-move-to-a-new-gu-and-back-into-a-move)

The ascension pass adds Man, River, Mountain and Landscape as Before, plus a provisional chapter-only sighting of an unnamed Immortal Gu in a yaksha octopus king. Landscape as Before joins two catalogue rows. The separate Saga Man as Before Immortal Gu page remains a variant reference to review, and the octopus sighting contributes no inferred rank or ability. [Emergence and advancement comparison](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#ascension-spontaneous-fusion-and-hosted-emergence)

The loan comparison adds Responsive Luck and Reputation Restriction and extends Attitude with a negotiated term, a retained will and the deadline loss of use. The community claim about automatic destruction at expiry remains unverified. [Loan comparison](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#lending-a-gu-feeding-it-and-gaining-control)

### Killer move source records

The review index now carries 23 move or variant records across 17 families, alongside 78 chapter-checked Gu records. Each move has a stable ID, family, evidence status, chapter and source locator, known roles, an observation or proposal, and open fields. A role with a Gu identity must share at least one checked chapter with that Gu. An unnamed role can describe what is known about it and leaves its identity and runtime value open.

| Comparison | Records and evidence |
| --- | --- |
| Attack and delivery | Iceblade Storm is demonstrated. Xiao Yan's fire set is described, and Fire Discharge remains a separate movement contribution in that scene. |
| Timing and failure | Three Heads Six Arms is described with three operators and eighteen synchronized Gu. Soaring Fighting Spirit shows paid failure and later successful use. |
| Arrival and allegiance | Ordinary Year Beast Summoning is described. The army version and Submission Song are demonstrated in the same encounter. |
| Revised and speculative procedures | The old Giant Hand is described, its replacement is demonstrated, and the soul-catching variant is proposed by the character. |
| Sites, projections and observers | Tai Qiu separates setup Gu, site materials, installed formations and an unnamed travel key. Future Self lists a projected output separately from the anchor that makes it available. Familiar Face records two support designs for the observer-facing core. |
| Carrying capacity and substitution | Chapter 1769 records two Fixed Immortal Travel workings for a rank-eight operator. One uses specific rank-seven space-path Immortal Gu. Jade Flow Pearl combines available space-path Gu, mostly rank six, with refinement supports that remove the burden from his refinement marks. [Chapter 1769](https://asurascans.com/novels/reverend-insanity/chapter/1769) |
| Continued use after creation | Self Cleansing proposes overwriting a setup Gu’s retained method. Obscured Heavenly Secret shows a recovering effect produced by the redesigned cast. |

The build script checks unique move and role IDs, required locators and evidence state, and named Gu references. Search and runtime definitions remain separately authored. Use the same family to compare outcomes, and add a separate checked record where an actual core, input path, operator or outcome changes. [Evidence JSON](gu-identity-evidence.json) · [Index builder](../../scripts/index_gu_sources.py)

Focused tests now read the Red Fire roles, the Three Heads Six Arms count and rank requirements, and the revised Giant Hand roles from these checked records. The test adapters still supply local costs, availability and effects. [Source-to-fixture comparisons](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#which-parts-of-a-source-move-can-be-checked-today)

### Broad move discovery queue

The private index now includes 753 candidate records made from 949 captured source rows. A unique normalized name on both sides pairs 196, leaving 438 Saga-only and 119 Fandom-only records. The Saga source is the single saved catalogue page with all 634 advertised cards. The live Fandom list was restricted. The held Fandom revision index supplies 315 nonredirect main-namespace pages with a killer move, formation or Gu House infobox, or a selected general move category. The filter leaves list and character subpages outside this pass. Some candidates describe a formation, variant, technique topic or editorial convention. Check the underlying scene before joining them to a checked move or splitting an apparent alias. [Saga move catalogue](https://sagaofgu.com/moves/) · [Held Fandom revision index](power-systems/wiki-digests/full-dumps/reverend-insanity_SOURCES.json)

The rebuild stores the two input hashes, the Fandom archive hash, candidate URLs and revision IDs where present. Saga's snapshot offers a chapter hint on every card, but leaves path unrecorded on 559 and tier unrecorded on 124. Those metadata gaps stay open. The 23 checked move records are separate because a single wiki title can describe several working variants, and a checked passage may still leave most of a procedure unknown.

The first sample from this queue added the observed Air Lock and shortened Omni-directional Travel, the proposed and demonstrated Blood Light Spirit Suppression designs, and the land spirit’s description of Immortal Tribulation Tempering Aperture. [Chapter-backed comparisons](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#countering-travel-and-acting-on-a-place-spirit) [Air Lock](https://sagaofgu.com/moves/air-lock/) · [Blood Light Spirit Suppression](https://sagaofgu.com/moves/blood-light-spirit-suppression/) · [Immortal Tribulation Tempering Aperture](https://sagaofgu.com/moves/immortal-tribulation-tempering-aperture/)

## Gu rules

RI locators below use the English novel chapter numbering. Early paragraph locators come from the [held-edition source comparisons](SAGA_OF_GU_SCOUT_2026-10-24.md). Later chapters use selected public novel passages.

| ID | Source case | Rule supported or suggested | Test before prototyping |
|---|---|---|---|
| GD1 | Ch. 70, p41–48 and [ch. 106](https://www.webnovel.com/book/32605619408374705/87585817844827688). Joint activation spends essence in both Gu. One Little Light doubles moonblade attack power and a second gives the same power boost. Refinement produces Moonglow at triple base attack power. | **Shown/stated.** Track support use and permanent refinement separately. The Little Light power effect saturates for this combination. | Normalize base attack power to 1. Compare Moonlight alone, with one support, with two, and refined Moonglow: 1, 2, 2, 3. The two-support row rejects a generic additive power rule. Check cost and range independently. |
| GD2 | Ch. 266 p63 and ch. 275 p21–25. Wei Yang describes Light Source reducing the essence needed by light-type Gu, enabling longer use of an expensive movement technique. | **Stated.** A supporting Gu may change the supported operation's cost instead of its attack power. Its own activation cost remains a separate field. | Apply the reported halving to the supported operation. Keep the net cost unknown until the support's own expenditure is found. Compare a same-path power support and cost support to test whether path alone predicts the result. |
| GD3 | [Ch. 536](https://www.webnovel.com/ru/book/32605619408374705/88009497980759107) gives Three Heads Six Arms three cooperating operators and eighteen overlapping Gu. [Ch. 961](https://www.webnovel.com/ru/book/32605619408374705/88346267440173125) names three cores in a different move. | **Stated.** Operator roles, actual instances, overlap and number of cores belong to the particular method. A single core or single operator can describe a simple move. | A paper representation must express three actors on one method and three cores on another. Try the ch. 536 recipe with one participant absent and identify the unsatisfied role. The scene supplies no automatic backlash for merely missing a participant. |
| GD4 | [Ch. 1396](https://www.webnovel.com/book/reverend-insanity(english)_32605619408374705/chapter-1396-soaring-fighting-spirit_88548328471576903). Soaring Fighting Spirit activates mortal supports before feeding its core immortal essence. Failure after that step destroys many mortal Gu and injures the caster, especially soul and mind. | **Shown.** Some moves have ordered activation and consequences before the intended effect resolves. Backlash has a type and can change holdings. | Compare the observed failure after core activation with a hypothetical abort before it. The observed case carries spent essence and destroyed supports. Leave the hypothetical losses and any risk curve open until another scene or original tuning supplies them. |
| GD5 | [Ch. 974](https://asurascans.com/novels/reverend-insanity/chapter/974) describes rank-eight Attitude Gu as using mental energy without immortal essence. Ch. 230 p26–55/p64–80 and ch. 245 p53–54 describe a particular Bone Flesh Unity transfer, conversion loss and capacity pressure. | **Stated/shown.** Rank, activation fuel, fuel origin and recipient capacity are separate facts. A working conversion can still overload the recipient. | Reject a rank-only fuel rule against Attitude Gu. For the documented middle-quality transfer, carry three fifths through conversion and compare available headroom before and after moving stored Gu. Leave generalized transfer rates open. |
| GD6 | Ch. 105 p19–27/p35–39 and [ch. 106](https://www.webnovel.com/book/32605619408374705/87585817844827688). A failed fusion destroys one Little Light Gu and leaves survivors injured. Successful advancement branches can change power, range or trajectory. | **Shown/stated.** Failed refinement can change the next attempt's actual holdings and readiness. Rank increases can change different properties. | Reconcile the same starting components through failed and successful outcomes, then check what remains available for a repeat. Compare Moonglow and Moon Scar so a single scalar upgrade cannot silently replace attack power and reach. |

GD1 already distinguishes a saturating support from additive stacking. GD3 rules out the single-core shape as a general rule. GD5 rules out universal same-grade essence as an activation condition. These qualify the earlier GKM1, GKM5 and GKM8 proposals. The first playable candidate remains the early Moonlight comparison. Later high-rank cases check whether the representation can grow.

## Hogwarts spell rules

Locators use B1–B7 and PDF pages from the held English seven-novel collection, hash prefix `9db33901964c`. The public official references are supplementary.

| ID | Source case | Rule supported or suggested | Test before prototyping |
|---|---|---|---|
| HD1 | B1 pp137–138, first Charms lesson. Flitwick teaches wrist motion and precise speech. Hermione succeeds. Other students struggle, and Seamus sets his feather alight after prodding it. [Official Levitation Charm entry](https://www.harrypotter.com/fact-file/spells/the-levitation-charm) | **Taught/shown.** Motion and pronunciation are inputs to the ordinary taught technique. Observations do not isolate a numerical weight for either. | Hold caster and feather steady and vary one of pronunciation and motion at a time in the proposed trial. Treat those isolated outcomes as original tuning. Preserve stillness and unintended effects as different outcomes where the means support them. |
| HD2 | B1 p142, troll scene. Ron uses the same charm on a club and it falls onto the troll. The narration does not specify his full motion. | **Shown.** The learned charm has a use beyond the practice object. An omitted motion stays unrecorded. | Use the club as a check on the classroom model. Reject a feather-only target list. Treat the scene as an example of lifting and releasing a heavy object, with maximum mass and precise motion open. |
| HD3 | B6 p3132. Harry mentally casts Levicorpus with an upward flick, suspending Ron by an ankle. He then mentally uses Liberacorpus, which releases him. [Official discussion of the pair](https://www.harrypotter.com/features/a-handy-guide-to-the-lesser-known-spells-in-the-wizarding-world) | **Shown.** Audible speech is unnecessary in this instance. The counter-jinx resolves the state created by its paired jinx. An upward flick is documented for one cast. | Compare recorded gesture and verbal mode field by field. Test an active suspension against a normal target. Compare the lift-related word root and motion with HD1 while keeping its particular ankle effect attached to this spell. |
| HD4 | B3 pp885–887. Lupin teaches the happy-memory condition and Harry initially produces a silver wisp. B4 p1461 shows Accio calling a named broom from out of sight. | **Taught/shown.** Focus and targeting can carry distinct spell-specific inputs. A cast can have a partial observable result. | Check that a motion-and-words model has room for a memory-dependent effect. Use Accio as a check on a universal line-of-sight assumption, with targeting and distance for other spells still open. |
| HD5 | The [official etymology survey](https://www.harrypotter.com/features/the-etymology-of-harry-potter-spells) explains recognizable roots in multiple spells. The [305-entry phonology study](https://www.degruyterbrill.com/document/doi/10.1515/opli-2021-0025/html) uses wiki pronunciations and describes variation between adaptations. | **Inference to test.** A root may help predict an effect family. Sound patterns and recorded gestures can be evaluated independently. Current examples leave a full generative syntax open. | Label effects before looking at roots. Hold out whole spell families or books, compare root predictions to a common-family baseline, and count failures and unknowns. Compare gestures only when the medium explicitly shows them. |

## Hogwarts potion rules

| ID | Source case | Rule supported or suggested | Test before prototyping |
|---|---|---|---|
| PD1 | B6 pp3071–3073, Draught of Living Death. Crushing the bean releases juice and the brew turns lilac before the revised stir. Harry then adds one clockwise stir after seven counterclockwise stirs and sees pale pink. [Official account](https://www.harrypotter.com/features/8-times-the-half-blood-prince-reveals-the-real-snape) | **Shown.** Preparation changes the input extracted, and stirring changes a subsequent state. We have intermediate observations for both steps. Final outcomes for crushing alone and revised stirring alone remain open. | Tabletop the four combinations of textbook or crushed bean and textbook or revised stirring. Anchor the intermediate states and Harry's combined result. Any isolated final yield or quality is proposed tuning. |
| PD2 | B1 p112, Cure for Boils. Snape diagnoses adding porcupine quills before removing the cauldron from the fire. The spill gives Neville boils. [Official excerpt](https://www.harrypotter.com/features/eerie-similarities-between-harry-potter-and-neville-longbottom) | **Shown failure, teacher diagnosis.** Order and heat can change the resulting hazard. Contact is consequential for the observed spill. | Put the same quills in with heat on and after removing heat. Replay the observed failure branch and distinguish spoiled batch, spill exposure and what the player can observe. Leave exact temperature and exposure thresholds open. |
| PD3 | B2 pp432–433 and pp496–498, Polyjuice. The recipe calls for full-moon fluxweed and twenty-one-day stewed lacewings. Different human samples determine different disguises. Hermione's cat hair produces a harmful partial transformation. [Rowling's supplemental account](https://www.harrypotter.com/writing-by-jk-rowling/polyjuice-potion) | **Taught/shown.** Preparation and provenance attach to the base brew. A late sample supplies identity, and wrong-species use can cause a distinct harmful outcome. | Compare prepared versus unverified lots, then compare two human samples and the attested cat case. Verify that the same prepared base can support separately personalized doses and that the cat case gives neither a normal disguise nor a harmless fizzle. |
| PD4 | B6 p3434, Elixir to Induce Euphoria. Slughorn expects peppermint to counterbalance particular side effects. B6 ch. 18 shows a bezoar treating Ron's poisoning. [Official account of both](https://www.harrypotter.com/features/8-times-the-half-blood-prince-reveals-the-real-snape) | **Expert expectation / shown treatment.** A recipe variation may target side effects. A separately administered ingredient can treat a specific poisoning. | Keep intended euphoria and unwanted effects separately observable. The peppermint scene supports a test hypothesis with an unmeasured magnitude. The bezoar trial compares the observed poisoning with an unsourced poison, whose response stays open. |

## Collections to ingest for variety

| Collection | What to ingest next |
|---|---|
| Gu candidate inventory plus held novel | Use the catalogue crosswalk, [Saga of Gu's editorial fields](https://sagaofgu.com/editorial/) and the held English EPUB to locate chapter evidence. Sample early activation, attack/cost supports, multi-operator and multi-core moves, interruptions, failed refinements, and underdescribed or unnamed Gu. Search translated aliases and Chinese names when available. Recheck disagreements in the actual passage. |
| Hogwarts seven-novel search index and Fandom snapshot | The local index contains 4,353 novel passages and separately 88 rehearsal-script passages. The Fandom revision inventory has 24,708 pages, including 777 pages with a spell infobox, 292 with a potion infobox and 384 in the potion-ingredients category. These are overlapping discovery counts across media. Seed a book-only scene table from the search index and add revision-qualified links from the wiki. Include successful, failed, silent, and unreported casts, plus incomplete and alternate recipes. |
| Hogwarts supplementary and fan collections | Use the [Official Fact Files](https://www.harrypotter.com/fact-file) and [HP Lexicon](https://www.hp-lexicon.org/about-the-lexicon/) for scene and alias leads, and the [phonology study](https://www.degruyterbrill.com/document/doi/10.1515/opli-2021-0025/html) and [trilingual corpus study](https://www.bdm.unb.br/handle/10483/27010) for linguistic features. The phonology method is inspectable; an independently reusable 305-row file was not established here. Fan curricula, Gu World and other games in the [reference scout](../CROSS_WORLD_SYSTEMS_TRANSFER.md#round-3-playable-precedents-and-layers-to-share-2026-11-11-proposal) supply comparison cases for teaching and play. |

Record each observation with a source ID, medium, edition or revision, locator, participants, inputs, step, outcome and field-level evidence. Unknown, unobserved, conflicting, and absent describe different states. Keep source snapshots private and tracked findings paraphrased.

The pre-prototype sequence is GD1–GD6 on paper first, HD1–HD5 against independent spell examples, and PD1–PD4 through a procedure table. Use only the detail each comparison needs. An authored outcome from any later prototype tests playability. A new source case tests the derivation.

Verification scope: a public Gu index capture, two saved wiki metadata inventories, 2,113 conservatively counted words from selected local Hogwarts windows including locator labels, selected public novel excerpts, and previously checked Gu passage receipts. This is a sample, with no complete novel reading, full wiki ingestion, or gameplay trial.

## From source rules to procedural methods

The goal is a world engine that computes outcomes from reusable laws. An authored canon method supplies a known setup and a calibration case for those laws. The same resolver runs variations on that setup and evaluates combinations with no authored recipe. The player can submit a method directly. A search for methods that achieve a goal calls the same resolver.

| What the engine must explain | Gu example |
|---|---|
| Reproduce a known result | Resolve Moonlight with Little Light from its support rule and recover the documented power increase. Resolve Moonglow through the refinement procedure and check the changed Gu and its output separately. |
| Resolve a variation | Run Moonlight with zero, one or two supports. Resolve the unchanged attack boost from the stacking rule while accounting for actual participants and any costs each incurs. Change one input at a time so its contribution can be inspected. |
| Evaluate an unlisted combination | Try Moonlight with Little Light and Light Source. If Light Source applies to the bound operation and the steps can coexist, one support affects power and the other affects the applicable operating cost. The combined result is a proposed extrapolation. The resulting total cost depends on the support costs and the scope of the discount. |

Extend coverage by adding a part, a reusable interaction, or a more specific rule when a source case calls for it. For each addition, check an old recipe, a new variation, and a combination whose outcome was not used to fit the rule. Compare canon against a held-out source case where one exists. An invented interaction should make a concrete prediction a player can test. Track gaps at the level of a property or step so an uncertain cost can coexist with a supported prediction about attack power.

### ACT NOW

Use the source cases to constrain the rules that evaluate a method. A procedural search can then propose new methods and pass them through those same rules. The known cases give three useful checks on the design now:

| Case | Paper result | Consequence for the implementation |
|---|---|---|
| GD1 and GD2, Gu support | One and two Little Light supports have the same sourced attack-power result. Light Source's sourced change acts on another Gu's operating cost. Its own cost remains unknown. | A support names the operation and property it changes. Repeated instances, repeated effects and repeated costs are distinct. Model stacking on the affected property. |
| GD3 through GD6, Gu composition | A single operator cannot reproduce the sourced three-person move. A different move has three cores. The observed late failure spends fuel and destroys some held Gu. Rank-eight Attitude Gu uses mental energy. | Describe the parts and operators required by the particular method. Bind costs to the operations that incur them and account for what already happened at a failure. Rank can inform a local rule while each activation names its actual fuel. |
| HD2 through HD4 and PD1 through PD3, Hogwarts | Levitation acts on a feather and a club. The paired jinx can be cast mentally. A potion can retain an intermediate state, take a later sample or leave a hazardous spill. | Give effects real targets and outcomes. Words, motion, preparation, conditions and sample identity each belong where the particular method reads them. |

### ACCOUNT FOR NOW

| Code | Abstraction | Existing owner and proposed responsibility |
|---|---|---|
| DR1 | **Method and role matching** | Describe a goal, the parts or conditions it needs, the steps and the intended outcome. Match against concrete Gu, operators, wands or lots through the existing holdings, actors and recipe readers. A method can be known while its current means are unavailable. A binding must account for the actual instance and any overlapping commitment. |
| DR2 | **World rules for composition** | Keep target, modified property, compatibility and stacking explicit. For Gu, compare power, reach, cost and effect separately. For spells, bind a practiced technique and target to a typed effect while incantation roots remain a research hypothesis. For potions, let preparation, heat, order and reactions change batch properties through `craft_resolver.js` where it fits. |
| DR3 | **Execution and state changes** | Submit casts through the existing ability commands. Use the existing timed procedure path for suitable work. The current `power_grammar.js` composes distinct functions and prices axes, so it needs a Gu binding before it can represent two held supports with the same effect. The timed procedure helper charges command costs at the first step and refunds the current failed job. A method with staged expenditure and irreversible backlash needs explicit settlement through existing owners. Record holds, spend, transfers, releases and harm at the actual step. Revalidate a stale plan before applying it. |
| DR4 | **Evidence and character knowledge** | Keep source confidence on authoring rows and observations in existing knowledge or trial records. A missing catalogue field leaves the forecast uncertain. The character can learn from an attempted method and its observed result. Preserve the resolved method and step state for a saved attempt. Reopening the journal or reloading a job should retain the same resolved effects and actual inputs. |
| DR5 | **Candidate generation** | Start from an intended effect and the character's available or discoverable means. Assemble compatible operations or vary an existing method. Evaluate each candidate with the same world rules used for a method assembled by the player, then rank by the selected goal and tradeoffs. Use stable candidate identity and a seed when sampling matters. Limit search work to an explicit per-query budget and report partial coverage. The same candidate evaluation can serve the player, NPCs and author tools. |

First Gu paper walk: with Moonlight and two separately held Little Light Gu, look for more moonblade force. The available evidence supports the one-support gain and shows that another identical boost adds no attack power. Keep the second Gu's potential cost or other contributions visible only where known. Looking for greater reach leads to a different route through refinement. If a Gu is removed between planning and use, the plan needs a new binding. In a ch. 1396 replay, already spent fuel and destroyed supports remain accounted for after the move fails.

Prefer the existing ability, making, job and knowledge owners. A separate generator can propose candidates and use their evaluators. A common execution layer becomes useful where different worlds need the same binding or settlement behavior. The proposed shared shape is a method, its real means, the steps that take effect and the observations that follow.

### LATER / DELEGATE

| Follow-up | Effort and done check |
|---|---|
| Gu activation and support evaluation | Runtime designer, medium. On an ordinary early Gu practice route, apply the base and supported move through the same command path. Verify the existing held instances, a missing or changed binding, the duplicate support result, and an actual use beyond the practice target. |
| Hogwarts as the second check | Source and runtime designer, medium. Use one cast with an alternate technique and one recipe with a meaningful preparation change. Check whether binding and observation can be shared while effects and costs remain specific to each world. |
| Procedural invention after the evaluator can explain authored cases | Runtime designer, medium. Recover a known move from an early loadout, then produce a distinct useful proposal by substituting one supported part. Reserve one independent source case to check the rules. Confirm stable candidates for the same inputs and an explanation for a failed or uncertain match. |

## Derivation trials for a world engine

### ACT NOW

These paper trials identify an operation each system can reuse and a source case that constrains it. Each proposed variation makes a prediction a player could check.

| Case | Source and inferred rule | New method and predicted result |
|---|---|---|
| **DT1. Hogwarts spellcraft** | B1 pp137–142 shows Wingardium Leviosa lifting a feather and a club. Independent check, B7 p3716: Harry lifts a falling sidecar and briefly keeps it airborne. It remains unsteerable. Represent lift, sustained support and steering as distinct effects. B4 p1461 gives Accio a different operation, bringing the Firebolt to Harry. [Levitation](https://www.harrypotter.com/fact-file/spells/the-levitation-charm), [Summoning](https://www.harrypotter.com/fact-file/spells/the-summoning-charm) | Fetch a jar with Accio, then hold it above a work surface with the learned lift. The sequence requires the same reachable jar in both steps, and its usefulness comes from the two effects. A proposed single spell that also holds the jar in place after summoning needs an actual hold operation and a supported way to combine the techniques. Predict no free steering from lift alone. |
| **DT2. Gu composition** | GD1 gives the Moonlight power comparison. Ch. 275 p21–25 supplies a different family: Wei Yang describes Gu that duplicate fire, enlarge it, lower cost or provide movement. The checked Light Source case discounts expenditure for a light-type operation. Keep a support attached to the operation it changes. [Held-edition comparisons C18–C20](SAGA_OF_GU_SCOUT_2026-10-24.md) | Combine Moonlight, Little Light and Light Source where the operator can sustain them and the discount matches the bound operation. In a normalized paper trace, attack power is 2. If base Moonlight cost is M and Light Source qualifies it, that operation costs M/2. Track both support costs and any additional eligible operations separately. A second Little Light adds no sourced power benefit. Compatibility, the eligible operations and total expenditure remain open. |
| **DT3. Hogwarts potioncraft** | B6 pp3071–3073 shows processing steps changing the Draught's intermediate state. Independent check, B6 pp3307–3309: Slughorn teaches that a blended poison needs more than the individual antidotes. The class identifies ingredients with a revelatory spell and seeks an added component that transforms the antidotes together. This is a stated interaction rule for the class of blended poisons. The passage leaves the selection rule for the extra component open. | For a new two-ingredient blended poison, assay the ingredients, propose their individual antidotes and look for an ingredient whose evidenced function lets them work as a blend. Predict that ingredient-by-ingredient coverage alone leaves an unresolved blend requirement. The player can test a proposed extra component and observe the result. This gives spellcraft an immediate consumer in potion research. |
| **DT4. LOTM rituals** | Old Neil's demonstration binds candles to the addressee and practitioner. He explains that a sanctified silver dagger or Holy Night Powder can form the enclosing barrier in different circumstances. The prayer and the requested effect play separate roles from the barrier. [English novel ch. 51](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/the-grounded-ritualistic-magic_31623410509473622) | Use an appropriate powder route to provide the barrier when the dagger route is unavailable. The role-level prediction is an enclosed working space. Check that the addressee, offering and request still have their own means. A functioning barrier leaves the response of the addressee open. |

### ACCOUNT FOR NOW

Start with operations that have something concrete to read and change. A charm reads a target and changes its position or state. A Gu support reads another activation and changes a named property. A brewing step reads the batch and changes its preparation or reactions. A ritual can read the workspace, identity and obligations of participants. A new outcome can come from one operation changing the inputs another sees. A new interaction can enter as a world rule when the sources or an explicitly original experiment give it a reason.

Check the rules at three levels. A known case should replay from the same rules as an original proposal. A nearby variation should show which change produced the difference. A separate source case should be able to contradict a rule and improve it, as the sidecar does for any model that gives steering for free. Keep a trace of applicable rules and unresolved properties so the player can see what they can try next.

### LATER / DELEGATE

| Trial | Effort and done check |
|---|---|
| Teach and use a composed spell sequence | Runtime designer, medium. Fetch and hold an actual target in ordinary play. Show what happens when it leaves reach or the lift ends. Keep a proposed combined cast identifiable as original. |
| Check a new Gu combination | Source and runtime designer, medium. Find a sourced candidate for discount eligibility and record individual costs. Resolve power, cost and remaining holdings through the same evaluator as the known combination. |
| Connect assay to an antidote trial | Making designer, medium. A cast exposes a fact that the recipe search can use. Compare individual antidotes with an authored combination that addresses the blend and leave an observable result. |
| Try ritual substitution through an existing rite | Ritual designer, medium. Compare the known method and one alternate means. Show which requirement each meets and what the action actually changes in play. |

Additional source inspection for this round includes 679 conservatively counted local Hogwarts words and locator labels from B6 and B7, the official spell and ritual references above, and reuse of the held Gu comparison. These are design checks on paper.

## Research chats opened November 11

Weibao asked for separate chats on spell vocabulary, potion ingredients and chemistry, and replacements with similar traits or different ways of reaching an effect. A fourth chat surveys other systems worth proceduralizing. The four chats were confirmed active in the local YAIR project at dispatch. Each owns its own proposed report and uses this source record as shared input.

| Chat | Local thread ID | Report owner |
|---|---|---|
| Hogwarts spell vocabulary and spellcraft | `01a1c950-35b6-7b82-aa2e-b795cd3bac1e` | `docs/research/HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md` |
| Potioncraft and chemistry-inspired reactions | `01a1c950-377c-7250-a646-e33577035811` | `docs/research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md` |
| Trait substitution and alternate methods | `01a1c950-39b5-7232-8d75-c56c476465c4` | `docs/research/TRAIT_SUBSTITUTION_AND_ALTERNATE_METHODS_PROPOSAL_2026-11-11.md` |
| Other YAIR systems to proceduralize | `01a1c950-3ba7-7cf1-a0ae-89eba7c575f4` | `docs/research/OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md` |

## Standalone workshop checkpoint

The goal includes Hogwarts spellcraft, Gu acquisition through use, Hogwarts potioncraft and crafting, and trait substitutions and alternate methods. JJK, LOTM brewing and rituals, relationships, and other YAIR systems need a fit assessment. Preserve 64,500 Codex credits and check the live balance between bounded work units.

The first usable unit is Hogwarts potioncraft. Run `node scripts/procedural_workshop.mjs --help` for named cases and editable JSON inputs. The [potion workshop](../../src/hogwarts_potion_workshop.js) uses the existing craft resolver for ingredient reactions and a directional stirring history for the Draught. The companion [chemistry proposal](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) owns the source windows and original numerical examples. The Draught currently starts with a prepared base and records colour, material balance and retained solids. Antidotes consume reagents and apply the remaining burden to a standalone assay. Final sleeping potency, staged lot admission across arbitrary operations, and world hookup remain open.

Verification uses `node --test tests/hogwarts_potion_workshop.test.js tests/craft_engine.test.js` and eight workshop CLI requests on the current checkout. The checks cover the two Draught colours, early reversal, mass accounting, the unlisted blended antidote, binder degradation and excess binder competing with free remedies. Evidence covers the standalone entry point.

The [Gu workshop](../../src/gu_workshop.js) is runnable through the same command. Try `gu-keeper`, `gu-variation` or `gu-experiment`. Use `--case gu-keeper` to get the editable request. Buy actual Gu instances, plant moon orchids, wait, harvest petals, feed the Gu, and use them against a practice target. The original mixed-support case applies a scoped operating-cost discount. A failed core activation preserves what was spent on earlier supports. Refinement consumes selected Gu and returns Moonglow for use through the same cast action. Prices, feed for supports, farming cadence, success and eligibility are workshop settings. Wild acquisition, Gu farming itself, injured-Gu care, failed refinement and complex moves remain open.

Combined focused check `node --test tests/gu_workshop.test.js tests/hogwarts_potion_workshop.test.js tests/craft_engine.test.js` passed 30 tests. The workshop CLI accepted the exported mixed-support request back through standard input and reported attack power 2, two paid supports, and a discounted Moonlight activation.

The [spell workshop](../../src/hogwarts_spell_workshop.js) now binds words, movement, focus, wand and target to a learned lift, a fetch-then-lift sequence and an original single-cast experiment. The jar's position carries between operations and release ends support. A blocked approach interrupts the compound before lifting. The [spell vocabulary proposal](HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md) owns the source cases. Five CLI scenarios passed, and `node --test tests/spell_cast_lowering.test.js tests/hp_charm_bridge.test.js` passed 11. A general lexical grammar and native action lowering remain open.

The [substitution workshop](../../src/substitution_workshop.js) now executes the native HP acquisition, preparation, brew and dose treatment sequence on an isolated fixture. Fine horn, two Bonemeal portions, coarse horn, and a coarse-horn blend produce conditions 900, 900, 800 and 900. The alternate LOTM barrier routes resolve through the same workspace closure check and retain the tool or spend powder. A partial powder circuit consumes the portion without enabling a petition. Nine CLI requests passed. The [substitution proposal](TRAIT_SUBSTITUTION_AND_ALTERNATE_METHODS_PROPOSAL_2026-11-11.md) owns the mechanism comparison. The combined HP brewing, ingredient substitution, ritual, Seer brewing, ties and memory focused checks passed 62 tests. A broad diff check encountered existing whitespace in the modified bundle, so the workshop verification is scoped to its own files.

### Further systems and shared ownership

| Candidate | Play scenario and existing owner | Fit and next check |
|---|---|---|
| Jujutsu Kaisen techniques | Apply the same Ratio Technique strike before and after Nanami's shift ends. Give both strikes the same target and weak-point selection. The separate [vow rules](../../src/vow_rules.js) are the starting owner for the time-bound change. [Revision-qualified JJK digest](power-systems/wiki-digests/DIGEST_jujutsu-kaisen.md), [VIZ chapter index](https://www.viz.com/shonenjump/chapters/jujutsu-kaisen) | The action, time-bound restriction and enforcement have distinct jobs. An initial build is justified if a sourced timed benefit can change the existing action without changing its targeting law. Confirm the source chapter before tuning a magnitude. |
| LOTM brewing and rituals | Vary the amount of a crucial Seer ingredient and compare the potion and residual hazard through [the Seer brew owner](../../src/lotm_seer_brew.js). Separately, prepare one barrier and compare a complete circuit with an interrupted circuit using [ritual conditions](../../src/ritual_conditions.js). [Seer chapter](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/potion_31326301566593179), [ritual chapter](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/the-grounded-ritualistic-magic_31623410509473622) | Keep chemical quantities and roles in the batch. Ritual conditions read practitioner, addressee, boundaries and timing through the existing condition owner. A second build should connect a resolved result to a consumption or petition step, including an interrupted attempt. |
| Relationships | Offer the same promised aid to two people, one with a history of fulfilled commitments and one with an unresolved breach. Then try an acknowledgement followed by actual restitution. [People and ties owners](../AREA_GUIDE.md#people-and-ties) | Use person memory for the history and the existing relationship edge for distinct kinds of regard. Let the local promise or boundary decide what can be repaired by an apology and what requires restitution. A build should change a concrete response such as access, cooperation or the terms of a loan. The 62-test check covers existing owner behavior. This combined scenario remains a proposed design. |
| Other systems | [Consultation evidence, perishable supply, and local armor wear](OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md) | Prioritize Gu supply where it directly reaches the standalone keeper route. Consultation evidence can reuse observations without adding a second knowledge store. Armor needs a hit location and a damaged surface before a wear rule has a meaningful consumer. |

Cross-world reuse already has practical evidence in the batch resolver and native substitution planner. Spell and Gu still have distinct small workshop executors. Extract a common operation only once it has the same inputs and state effects in two usable routes.

### Standalone completion checks

From the repository root, run `node scripts/procedural_workshop.mjs --help`. Use
`--case <name>` to print an editable request and pass the edited JSON to the
same command via standard input using `-`. The workshop uses deterministic,
isolated fixtures. Each output shows the basis, effects or state changes,
costs, and action or reaction trace. The present scope is the standalone route.

| System | Known case, variation, and new combination | Later integration |
|---|---|---|
| Hogwarts spellcraft | `spell-lift` lifts and releases the jar. `spell-sequence` carries the jar from a fetch into a separate lift. `spell-experiment` composes both forms as one original cast. A blocked approach stops its next operation. A missing focus or tool prevents an activation. | Lower a resolved technique into the existing ability command and spend path. Target movement, support and release need a world object or scene owner that can consume them. Wider vocabulary and confirmed compound gestures need further lore. |
| Gu | `gu-keeper` shows buy, grow feed, harvest, feed and cast. `gu-variation` pays two supports with the same power as one. `gu-experiment` combines power and cost supports. `gu-recovery` shows failed fusion, care, and reuse of surviving Gu. `gu-cultivation` uses a held vitality grass Gu to grow and sell a leaf. `gu-wild`, `gu-emergence` and `gu-escaped-moonlight` exercise different origins. Petals expire after five days. | [Comprehensive Gu checkpoint](../GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#comprehensive-gu-engine-checkpoint) owns the next game slice and source gaps. |
| Hogwarts potioncraft and crafting | `draught` reproduces the colour checkpoints. `draught-variation` changes extraction. The original blended antidote is an unlisted combination whose binding competes with other uses of the reagents. `catalysed-antidote` keeps its catalyst and clears a residual burden in cool conditions. Open and sealed storage change the original Draught extraction trial. `polyjuice-sourcing` and `polyjuice-variation` exercise the existing sourcing, provenance and preparation rules, including bench storage and retrieval of a brewed portion. | Draught and antidote use `craft_resolver.js` for reactions. Polyjuice already reaches the existing Hogwarts domain through `commit` and `settle`. Use the same lot and reaction model for ordinary abrasives. Broad event-time ingredient admission and a Draught consumption effect are future integrations. |
| Substitutions and alternate methods | `substitution-reference` and `substitution-equivalent` consume different materials for equivalent cleaning. `substitution-tradeoff` buys cheaper, weaker cleaning. An editable request using fine horn with two Bonemeal portions gives strength 133 and leaves condition 833 through the native dose treatment. Both enclosure methods reach the same petition prerequisite with different costs and retained items. | The Hogwarts adapter already invokes the real substitution and treatment owners. The enclosure preview can later publish a workspace condition for a real ritual step. Keep the powder charge, the reusable dagger, and the actual route on the execution record. |

The relationship comparison exercised `derivedBond`, `silenceVerdict` and
the obligations ledger. With the same offer of aid, different remembered
histories carried different trust into the next choice. A promise changed
the keeper's chance of respecting a confidence with the same roll address.
Making amends improved regard while the duty remained due. Settling the
obligation removed it. The tested figures belong to an original assessment
fixture. A playable follow-up can use the shared memory, ties and obligations
owners for a named offer.

The companion proposals, collected source cases and earlier reference scout
remain the evidence for lore and ideacrafting. Spell vocabulary, Gu kind and
habitat coverage, and cross-world ritual adapters can grow through those
owners. The next action after the standalone goal is to choose a world and
connect its first workshop case to a live action, resource and consequence.

The 14 focused test files covering the workshop, crafting, Hogwarts casts and
brewing, LOTM rites and Seer brewing, and relationships passed 117 tests.
`npm run check:arch` passed with zero growth in the three composition files.
