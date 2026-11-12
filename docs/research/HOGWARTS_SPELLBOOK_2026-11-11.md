# Hogwarts spellbook

**2026-11-11 · First catalogue edition · Research and play design.** This is the start of the full spellbook. It collects 117 research records across six families, accounts for all 124 labels in the previous book concordance, cross-references all 41 entries in the captured official spell category, and carries the pinned wiki candidate inventory forward. A research ID can refer to a known spell, unnamed event, command, category or attempted form. Counts are records, with those distinctions retained.

- **Novels.** Held English omnibus SHA-256 prefix `9db33901964c`, 4,353 indexed novel pages. Locators are omnibus PDF pages. A scene window supports the stated observations. A catalogue hit remains a reading lead. No rehearsal script was used. [Concordance and earlier scene checks](HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md)
- **Official index.** Parsed the English category page's published page data, `props.pageProps.factFilesData`, filtering `category == spells`. There were 429 records across all categories and 41 spell entries. Capture SHA-256 `888d24738069f3182c3b75b75dbe69e23c94a52db4f748e448bed837fa51beb3`. Index matches supply titles and links. Detail pages were checked for the source conflicts called out below. [Official spell index](https://www.harrypotter.com/fact-file/spells)
- **Wiki.** The live list was inaccessible through the public reader. The [local pinned revision inventory](power-systems/wiki-digests/full-dumps/harrypotter_SOURCES.json) supplies 777 distinct spell-infobox titles and their revision IDs, from archive SHA-256 prefix `34b0eeec50d8`. All were queried against the seven books. There were 137 literal title hits, 640 without a literal hit, and 62 seed forms with exact normalized wiki-title links. The [list revision](https://harrypotter.fandom.com/wiki/List_of_spells?oldid=2026505) is a provenance pointer. The archived full-text cache remains unavailable here, so wiki rows below are discovery metadata.

The catalogue distinguishes the effect shown, the formula or name given by that source, and the operation YAIR would implement. A titled entry without a quoted form still counts as magic in the book. Each family has usable next tests in the design section. The full corpus still needs scene-level review, especially for unnamed actions, adaptation variants and older claims about spell origins.

## Book families

### Move, stop and position

| ID | Forms and names | Operation or lead | Book evidence |
| --- | --- | --- | --- |
| `levitation` | Wingardium Leviosa · Levitation Charm · Winguardium Leviosa | Lift and support an object. The sidecar comparison leaves steering separate. | B1 pp137–138, B7 p3716 |
| `hover` | Hover Charm | Dobby floats a pudding. Technique and equivalence to learned levitation remain open. | B2 p274, B6 p3297 |
| `summoning` | Accio · Summoning Charm | Bring a bound target toward the caster. A protected or obstructed route may fail. | B4 p1461, B7 p4162 |
| `banishing` | Banishing Charm | Practice moving an object away to a destination. | B4 p1584 |
| `locomotion` | Locomotor | Carry the named luggage along a route. | B5 pp1903 and 2519 |
| `mobilicorpus` | Mobilicorpus | Raise and carry an unconscious person with support at several points. | B3 p1039 |
| `mobiliarbus` | Mobiliarbus | Raise and move a Christmas tree. | B3 p847 |
| `dangling` | Levicorpus | Suspend a person by an ankle. Spoken and mental routes have scene evidence. | B6 p3132, B7 p4163 |
| `dangling-release` | Liberacorpus · Liberatocorpus | End an active ankle suspension. Falling resumes. | B6 p3132, B7 p4163 |
| `descend` | Descendo | Bring down or open a target in the shown geometry. A stack of junk collapses. | B7 p4245 |
| `project` | Waddiwasi | Send a wad of gum toward a target. | B3 p769 |
| `brake` | Braking Charm | A wand action slows Harry's fall. The official entry supplies the name and formula. | B3 p825 |
| `impediment` | Impedimenta | Impede movement. Bind the moving target and the impediment's actual effect. | B4 p1731 |
| `freezing` | Freezing Charm | Immobilize pixies. The connection to alarm suppression warrants a separate scene check. | B2 p364, B6 p2919 |
| `leg-lock` | Locomotor Mortis · Leg-Locker Curse | Hold the legs together. | B1 pp175 and 178 |
| `body-bind` | Petrificus Totalus · Full Body-Bind · Full Body-Bind Curse | Rigidify the body. A person can fall while bound. | B1 p219 |
| `apparition` | Apparition / Apparate | Self-transport with destination and possible partial completion. | B6 pp3321–3324 |
| `portkey` | Portus | Make an object a transport carrier. | B5 p2773 |

### Defend, interrupt and end

| ID | Forms and names | Operation or lead | Book evidence |
| --- | --- | --- | --- |
| `shield` | Protego · Shield Charm | Interpose a barrier. Delivery, size and what it intercepts have separate checks. | B6 pp3058–3059, B7 p4018 |
| `perimeter` | Protego Totalum | Perimeter working in a group of wards. Individual contribution open. | B7 pp3916 and 4058 |
| `salvio` | Salvio Hexia | Ward utterance in a group. Isolated effect open. | B7 pp3916 and 4058 |
| `cave` | Cave Inimicum | Ward utterance in a group. Isolated effect open. | B7 p4058 |
| `muggle-repelling` | Repello Muggletum · Muggle-Repelling Charm | A repelling ward applied among several effects. How an individual reacts needs its own evidence. | B7 pp3916 and 3936 |
| `disillusion` | Disillusionment Charm | Concealment applied as part of a camp setup. | B7 p3936 |
| `bedazzling` | Bedazzling Hex | A cloak treatment lead from discussion. | B7 p4046 |
| `counter-spell` | Finite Incantatem · Finite | End eligible workings. Compare interrupting the duelling effects and steadying a rampart. | B2 p461, B7 p4245 |
| `unjinx-weather` | Meteolojinx Recanto | Suggested response to an atmospheric jinx, with prior success reported by a speaker. | B7 pp3889 and 3899 |
| `relash` | Relashio | Open or release bindings. Cuffs are broken in one scene. | B7 p4165 |
| `disarm` | Expelliarmus · Disarming Charm | Separate a held implement from its holder. Resolve path and custody after contact. | B2 p459, B7 p3987 |
| `anti-apparition` | Anti-Disapparation Jinx | Transport restriction lead. Keep place, carrier and legal use separate. | Concordance lead at B5:PDF-p2772 |
| `flame-freezing` | Flame-Freezing Charm | Textbook account of changing how flames affect a witch or wizard. | B3 p630 |

### Make, change and repair

| ID | Forms and names | Operation or lead | Book evidence |
| --- | --- | --- | --- |
| `water` | Aguamenti | Produce water. Hot conditions can defeat its use after production. | B7 p4247 |
| `fire` | Incendio | Produce fire. An attempt against darkness fails to give useful visibility. | B6 p3615 |
| `fiendfyre` | Fiendfyre | Destructive propagating fire. Starting it and controlling it differ. | B7 pp4246–4251 |
| `light` | Lumos | Produce light on the bound wand. A nearby unheld wand works once. | B5 p1862 |
| `extinguish` | Nox | Extinguish active wandlight. | B3 p995 |
| `mend` | Reparo | Repair a damaged object. Two repair attempts on the broken wand differ. | B7 pp3987 and 4354 |
| `sever` | Diffindo · Severing Charm | Sever a target material, including ice in a witnessed use. | B7 p4008 |
| `glisseo` | Glisseo | Reshape stairs into a chute. Existing momentum and footing then matter. | B7 p4258 |
| `duro` | Duro | Harden the tapestry, changing what colliding pursuers meet. | B7 p4258 |
| `defodio` | Defodio | Remove material to enlarge a passage. | B7 p4166 |
| `deprimo` | Deprimo | Open a hole in a floor by force. | B7 p4057 |
| `reducto` | Reducto · Reductor Curse | Break through an obstacle. Preserve debris and what it exposes. | Concordance lead at B5:PDF-p2736 |
| `blasting` | Confringo · Blasting Curse | Explode a struck object or surface. Check surroundings. | B7 p3981 |
| `expulso` | Expulso | Blast a table in the café encounter. | B7 p3816 |
| `erecto` | Erecto | Set up tent canvas as a usable tent. | B7 p3917 |
| `vanish` | Evanesce · Vanishing Spell | Vanish material. Teaching treats more complex creatures as more difficult. | B5 pp2106 and 2203 |
| `duplicate` | Geminio | Produce a duplicate. Do not infer inheritance of hidden properties from resemblance. | B7 p3907 |
| `engorge` | Engorgio · Engorgement Charm | Enlarge a target, with an initially weak result in one trial. | B7 p4029 |
| `reduce` | Reducio | Shrink a target. Observe independently whether it undoes the previous result. | B4 p1320, B7 p4029 |
| `clean` | Scourgify · Scouring Charm | Clean a bound target. In one application soap appears in a person's mouth. | B5 p2576 |
| `wipe` | Tergeo | Remove dust from photographs in a witnessed use. | B7 p3976 |
| `obliterate-trace` | Obliteration Charm | Remove the trail left by passing through snow. | B5 p2341 |
| `waterproof` | Impervius | Repel water on glasses. Hot treasure and other materials remain separate use trials. | B3 p820, B7 p4163 |
| `extension` | Undetectable Extension Charm · Extension Charm | Alter usable interior capacity. Exact scope depends on the carrier. | B7 p3813 |
| `sticking` | Permanent Sticking Charm | An enduring attachment is described. Release method open. | B5 p1933 |

### See, know, signal and conceal

| ID | Forms and names | Operation or lead | Book evidence |
| --- | --- | --- | --- |
| `person-reveal` | Homenum Revelio | Detect human presence. Compare a confirmed presence and a cast with no visible change. | B7 pp3822 and 4056 |
| `properties-reveal` | Specialis Revelio · Scarpin's Revelaspell | Inspect an object or potion. Treat the link between the classroom procedure name and phrase as a hypothesis. | B6 pp3075 and 3307–3309 |
| `aparecium` | Aparecium | Try to reveal something on the diary. This cast yields no observed result. | B2 p506 |
| `wand-history` | Prior Incantato | Read a prior wand effect from the bound wand. | B4 p1243 |
| `twin-wand` | Priori Incantatem | Related wand phenomenon. Keep it distinct from deliberately querying a wand. | B4 p1801 |
| `history-release` | Deletrius | Dismiss the observed echo of a spell. | B4 p1243 |
| `point` | Point Me · Four-Point Spell | Orient the wand as a navigation aid. | B4 pp1715 and 1736 |
| `mark` | Flagrate | Draw a visible mark with a wand. | B5 p2719 |
| `dark-mark` | Morsmordre · Dark Mark | Conjure the sky sign. The cast does not identify every other use of the name Dark Mark. | B4 p1235 |
| `amplify` | Sonorus | Amplify a voice. | B4 p1726 |
| `quiet` | Quietus | Counter the amplification. | B4 p1223 |
| `silence` | Silencio · Silencing Charm | Suppress voice while leaving other means of action available. | B5 p2742 |
| `muffle` | Muffliato | Interfere with what nearby hearers can discern. | B6 p3131 |
| `blind` | Obscura | Put a blindfold over a portrait subject's eyes. | B7 p3943 |
| `fidelius` | Fidelius Charm | Conceal a secret through a keeper. Make disclosure a separate operation. | B3 pp880–881 |
| `alarm` | Caterwauling Charm | An alarm responds to outdoor movement after dark according to Aberforth. | B7 pp4180–4182 |
| `taboo` | Taboo | Saying a particular name produces detection and ward consequences in one scene. | B7 p4077 |
| `trace` | Trace | Detection and attribution are separate. Keep enforcement data as reports with a source. | B6 p3297 |

### Change a creature, mind or ongoing condition

| ID | Forms and names | Operation or lead | Book evidence |
| --- | --- | --- | --- |
| `patronus` | Expecto Patronum · Patronus Charm | Manifest a guardian with focus and partial output. Message use has a distinct operation. | B3 pp884–887, B7 p3815 |
| `boggart` | Riddikulus · Boggart-Banishing Spell | Change a Boggart into a chosen amusing shape. Laughter can finish the encounter. | B3 pp772–778 |
| `bird` | Avis | Conjure birds from a tested wand. | B4 p1416 |
| `flowers` | Orchideous | Conjure flowers during a wand test. | B4 p1415 |
| `serpent` | Serpensortia | Conjure a snake. Control over it is a separate question. | B2 p462 |
| `oppugno` | Oppugno | Direct already-present birds to attack. | B6 p3213 |
| `animate` | Piertotum Locomator | Animate statues and armor. McGonagall then speaks orders. | B7 pp4220–4221 |
| `stun` | Stupefy · Stunning Spell | Impair a target with a hit. Several separate casts can combine in an encounter. | B4 p1433 |
| `revive` | Rennervate · Ennervate | Restore a responsive state in some cases. Spell form and applicability need edition and target evidence. | B4 p1788, B6 p3561 |
| `episkey` | Episkey | Mend a local injury in a witnessed use. | B6 p3192 |
| `ferula` | Ferula | Create and apply bandages or splinting to a leg. | B3 p1039 |
| `anapneo` | Anapneo | Clear a choking person's airway. | B6 p3018 |
| `sectum` | Sectumsempra | Inflict actual cutting injury. The injury survives the cast. | B6 pp3494–3495 |
| `wound-countercurse` | Snape's unnamed wound countercurse | Ease bleeding and knit wounds over multiple passes. Words unreported. | B6 p3495 |
| `pain` | Crucio · Cruciatus Curse | Cause intense pain. Expressed intent matters in the source comparisons. | B5 p2764, B7 p4212 |
| `control` | Imperio · Imperius Curse | Impose commands on a person. Commands and resistance are distinct. | B4 p1318, B7 p4213 |
| `kill` | Avada Kedavra · Killing Curse | Lethal curse. Interaction with obstacles and exceptional protection needs scene-specific evidence. | B4 p1321 |
| `memory` | Obliviate · Memory Charm | Change memory. A damaged wand can redirect the cast. | B2 p584, B4 p1184 |
| `confuse` | Confundo · Confundus Charm | Confuse the affected person to alter behavior. | B7 p4153 |
| `legilimency` | Legilimens · Legilimency | Access mental content. The role name and formula both appear. | Concordance lead at B5:PDF-p2448 |
| `occlumency` | Occlumency | Defensive mental discipline. Its name does not supply a cast formula. | Concordance lead at B5:PDF-p2428 |
| `tickle` | Rictusempra · Tickling Charm | Trigger a tickling response that can be countered. | B2 pp460–461 |
| `dance` | Tarantallegra | Force the legs to dance. | B2 p461, B5 p2754 |
| `teeth` | Densaugeo | Cause rapid tooth growth. | B4 p1404 |
| `boils` | Funnunculus · Furnunculus · Furnunculus Curse | Create boils. The two written forms need edition checking. | B4 pp1404 and 1835 |
| `tongue-lock` | Langlock | Bind the tongue to the roof of the mouth. | B6 p3367 |
| `rope` | Incarcerous | Bind with conjured restraints. | B6 p3562 |
| `cheer` | Cheering Charm | Change mood with after-effects that wear off. | B3 p949 |
| `bat-bogey` | Bat-Bogey Hex | Reported use by Ginny. The description is a witness account, with wording unreported. | B5 p2705, B6 p3020 |
| `jelly-legs` | Jelly-Legs Jinx | Jinx in the nonverbal shield exercise. Delivery and block can be observed separately. | B6 p3058 |
| `bubble-head` | Bubble-Head Charm | Provide breathing support underwater. | B4 p1611 |
| `dolohov` | Dolohov's unnamed curse | A wordless wand strike causes injury with reduced effect according to the later account. | B5 pp2742 and 2805 |
| `marge` | Aunt Marge's inflation | Unintended magic. The outcome does not give a known formula. | B3 pp659 and 672 |

### Access, agreements and named attempts

| ID | Forms and names | Operation or lead | Book evidence |
| --- | --- | --- | --- |
| `unlock` | Alohomora | Open a compatible lock. Some closed doors resist it. | B1 pp128 and 225 |
| `lock` | Colloportus | Seal a door, changing whether pursuers can get through. | B5 p2737 |
| `statue-passage` | Dissendium | Open the statue's passage using the keyed target and technique. | B3 p840 |
| `map-close` | Mischief managed | Artefact command for the Marauder's Map. | B6 p3330 |
| `parseltongue-open` | Parseltongue opening request | A language key for particular receivers. Ron imitates a phrase with several tries. | B2 p580, B7 p4240 |
| `protean` | Protean Charm | Link derived coin markings to a changed source coin. | B5 p2292 |
| `vow` | Unbreakable Vow | Bind accepted clauses with a third participant. Preserve who assents to each clause. | B6 pp2879–2881 |
| `pixie-attempt` | Peskipiksi Pesternomi | Lockhart attempts this on pixies with no observed effect. | B2 p364 |
| `rat-attempt` | Ron's yellow-rat rhyme | Attempted color change with no observed result. | B1 p84 |
| `unforgivable` | Unforgivable Curses | Legal category that links Imperio, Crucio and Avada Kedavra. The category itself has no operation. | B4 p1323 |

## Official index cross-reference

| Official entry | Spellbook ID or evidence status |
| --- | --- |
| [Fiendfyre](https://www.harrypotter.com/fact-file/spells/fiendfyre) | `fiendfyre` |
| [Priori Incantatem](https://www.harrypotter.com/fact-file/spells/priori-incantatem) | `twin-wand` |
| [The Animation Charm (Piertotum locomotor)](https://www.harrypotter.com/fact-file/spells/the-animation-charm) | `animate`. Novel extract has Piertotum Locomator at B7 p4220. Official index uses locomotor and the detail page also has Piertotem in its incantation field. Keep the variants attached to their sources. |
| [The Ascension Charm (Ascendio)](https://www.harrypotter.com/fact-file/spells/the-ascension-charm) | Separate source lead. Official lead. No literal novel hit for Ascendio in the held index. |
| [The Bat-Bogey Hex](https://www.harrypotter.com/fact-file/spells/the-bat-bogey-hex) | `bat-bogey` |
| [The Bird-Conjuring Charm (Avis)](https://www.harrypotter.com/fact-file/spells/the-bird-conjuring-charm) | `bird` |
| [The Blasting Curse (Confringo)](https://www.harrypotter.com/fact-file/spells/the-blasting-curse) | `blasting` |
| [The Boggart-Banishing Charm (Riddikulus)](https://www.harrypotter.com/fact-file/spells/the-boggart-banishing-charm) | `boggart` |
| [The Bombardment Spell (Bombarda)](https://www.harrypotter.com/fact-file/spells/the-bombardment-spell) | Separate source lead. Official lead. No literal novel hit for Bombarda in the held index. |
| [The Braking Charm (Arresto Momentum)](https://www.harrypotter.com/fact-file/spells/the-braking-charm) | `brake`. Book report describes the effect at B3 p825 without quoted words. Official field supplies Arresto Momentum. |
| [The Bubble-Head Charm](https://www.harrypotter.com/fact-file/spells/the-bubble-head-charm) | `bubble-head` |
| [The Confundus Charm (Confundo)](https://www.harrypotter.com/fact-file/spells/the-confundus-charm) | `confuse` |
| [The Cruciatus Curse (Crucio)](https://www.harrypotter.com/fact-file/spells/the-cruciatus-curse) | `pain` |
| [The Disarming Charm (Expelliarmus)](https://www.harrypotter.com/fact-file/spells/the-disarming-charm) | `disarm` |
| [The Duplication Charm](https://www.harrypotter.com/fact-file/spells/the-duplication-charm) | `duplicate` |
| [The Engorgement Charm (Engorgio)](https://www.harrypotter.com/fact-file/spells/the-engorgement-charm) | `engorge` |
| [The Fidelius Charm](https://www.harrypotter.com/fact-file/spells/the-fidelius-charm) | `fidelius` |
| [The Freezing Charm (Immobulus)](https://www.harrypotter.com/fact-file/spells/the-freezing-charm) | `freezing`. B2 p364 has the pixie effect and classroom name. Official field supplies Immobulus. |
| [The Full-Body Bind (Petrificus Totalus)](https://www.harrypotter.com/fact-file/spells/the-full-body-bind) | `body-bind` |
| [The General Counter-Spell](https://www.harrypotter.com/fact-file/spells/the-general-counter-spell) | `counter-spell` |
| [The Impediment Jinx (Impedimenta)](https://www.harrypotter.com/fact-file/spells/the-impediment-jinx) | `impediment` |
| [The Imperius Curse (Imperio)](https://www.harrypotter.com/fact-file/spells/the-imperius-curse) | `control` |
| [The Killing Curse (Avada Kedavra)](https://www.harrypotter.com/fact-file/spells/the-killing-curse) | `kill` |
| [The Levitation Charm (Wingardium Leviosa)](https://www.harrypotter.com/fact-file/spells/the-levitation-charm) | `levitation` |
| [The Locking Charm](https://www.harrypotter.com/fact-file/spells/the-locking-charm) | `lock` |
| [The Locomotion Charm](https://www.harrypotter.com/fact-file/spells/the-locomotion-charm) | `locomotion` |
| [The Memory Charm (Obliviate)](https://www.harrypotter.com/fact-file/spells/the-memory-charm) | `memory` |
| [The Mending Charm (Reparo)](https://www.harrypotter.com/fact-file/spells/the-mending-charm) | `mend` |
| [The Patronus Charm (Expecto Patronum)](https://www.harrypotter.com/fact-file/spells/the-patronus-charm) | `patronus` |
| [The Reductor Curse (Reducto)](https://www.harrypotter.com/fact-file/spells/the-reductor-curse) | `reducto` |
| [The Severing Charm (Diffindo)](https://www.harrypotter.com/fact-file/spells/the-severing-charm) | `sever` |
| [The Shield Charm (Protego)](https://www.harrypotter.com/fact-file/spells/the-shield-charm) | `shield` |
| [The Sliding Spell](https://www.harrypotter.com/fact-file/spells/the-sliding-spell) | `glisseo` |
| [The Spider-Banishing Charm](https://www.harrypotter.com/fact-file/spells/the-spider-banishing-charm) | Separate source lead. Official entry explicitly points to a film scene. Keep Arania Exumai outside the novel-incantation evidence. |
| [The Summoning Charm (Accio)](https://www.harrypotter.com/fact-file/spells/the-summoning-charm) | `summoning` |
| [The Undetectable Extention Charm](https://www.harrypotter.com/fact-file/spells/the-undetectable-extention-charm) | `extension` |
| [The Unforgivable Curses](https://www.harrypotter.com/fact-file/spells/the-unforgivable-curses) | `unforgivable`. Category containing three methods. |
| [The Unlocking Charm (Alohomora)](https://www.harrypotter.com/fact-file/spells/the-unlocking-charm) | `unlock` |
| [The Wand-extinguishing Charm (Nox)](https://www.harrypotter.com/fact-file/spells/the-wand-extinguishing-charm) | `extinguish` |
| [The Wand-lighting Charm (Lumos)](https://www.harrypotter.com/fact-file/spells/the-wand-lighting-charm) | `light` |
| [The Water-Conjuring Charm (Aguamenti)](https://www.harrypotter.com/fact-file/spells/the-water-conjuring-charm) | `water` |

## Wiki candidates with a literal novel title hit

<details>
<summary>137 revision-linked candidates and their first literal matches</summary>

A match gives an entry to check. Ordinary words, folklore, category labels, adaptation-supplied names and variant spellings can all appear in this queue. Match counts are pages. The exact seed form column is a string match. Confirming identity still requires source evidence.

| Pinned wiki title | Pages | First literal hit | Exact normalized seed form |
| --- | ---: | --- | --- |
| [Age Line](https://harrypotter.fandom.com/wiki/Age_Line?oldid=1962296) | 6 | B4:PDF-p1362 | Open |
| [Anapneo](https://harrypotter.fandom.com/wiki/Anapneo?oldid=1919357) | 1 | B6:PDF-p3018 | anapneo |
| [Anti-jinx](https://harrypotter.fandom.com/wiki/Anti-jinx?oldid=1811558) | 3 | B3:PDF-p880 | Open |
| [Apparition](https://harrypotter.fandom.com/wiki/Apparition?oldid=2024926) | 30 | B3:PDF-p936 | Open |
| [Atmospheric Charm](https://harrypotter.fandom.com/wiki/Atmospheric_Charm?oldid=2006166) | 1 | B7:PDF-p3889 | Open |
| [Babbling Curse](https://harrypotter.fandom.com/wiki/Babbling_Curse?oldid=1962771) | 1 | B2:PDF-p428 | Open |
| [Backfiring Jinx](https://harrypotter.fandom.com/wiki/Backfiring_Jinx?oldid=1839779) | 1 | B6:PDF-p2943 | Open |
| [Badgering](https://harrypotter.fandom.com/wiki/Badgering?oldid=1811568) | 2 | B3:PDF-p894 | Open |
| [Banishing Charm](https://harrypotter.fandom.com/wiki/Banishing_Charm?oldid=2023084) | 1 | B4:PDF-p1584 | banishing |
| [Bat-Bogey Hex](https://harrypotter.fandom.com/wiki/Bat-Bogey_Hex?oldid=2018922) | 3 | B5:PDF-p2705 | bat-bogey |
| [Bedazzling Hex](https://harrypotter.fandom.com/wiki/Bedazzling_Hex?oldid=1987723) | 1 | B7:PDF-p4046 | bedazzling |
| [Blasting Curse](https://harrypotter.fandom.com/wiki/Blasting_Curse?oldid=2018941) | 1 | B7:PDF-p3987 | blasting |
| [Bluebell Flames](https://harrypotter.fandom.com/wiki/Bluebell_Flames?oldid=1927597) | 2 | B1:PDF-p224 | Open |
| [Boggart-Banishing Spell](https://harrypotter.fandom.com/wiki/Boggart-Banishing_Spell?oldid=1993712) | 1 | B5:PDF-p2654 | boggart |
| [Bubble-Head Charm](https://harrypotter.fandom.com/wiki/Bubble-Head_Charm?oldid=2004020) | 1 | B4:PDF-p1611 | bubble-head |
| [Caterwauling Charm](https://harrypotter.fandom.com/wiki/Caterwauling_Charm?oldid=2019024) | 2 | B7:PDF-p4180 | alarm |
| [Caught!](https://harrypotter.fandom.com/wiki/Caught%21?oldid=1799403) | 310 | B1:PDF-p4 | Open |
| [Cave inimicum](https://harrypotter.fandom.com/wiki/Cave_inimicum?oldid=2026232) | 2 | B7:PDF-p3917 | cave |
| [Charm](https://harrypotter.fandom.com/wiki/Charm?oldid=2022910) | 158 | B1:PDF-p65 | Open |
| [Charm to Cure Reluctant Reversers](https://harrypotter.fandom.com/wiki/Charm_to_Cure_Reluctant_Reversers?oldid=1844557) | 1 | B3:PDF-p658 | Open |
| [Cheering Charm](https://harrypotter.fandom.com/wiki/Cheering_Charm?oldid=2019036) | 1 | B3:PDF-p949 | cheer |
| [Confundus Charm](https://harrypotter.fandom.com/wiki/Confundus_Charm?oldid=2019063) | 3 | B3:PDF-p1050 | confuse |
| [Conjuring Spells](https://harrypotter.fandom.com/wiki/Conjuring_Spells?oldid=2019065) | 1 | B5:PDF-p2132 | Open |
| [Counter-charm](https://harrypotter.fandom.com/wiki/Counter-charm?oldid=1985511) | 2 | B5:PDF-p2140 | Open |
| [Counter-charm for hiccoughs](https://harrypotter.fandom.com/wiki/Counter-charm_for_hiccoughs?oldid=1922093) | 1 | B5:PDF-p2651 | Open |
| [Counter-curse](https://harrypotter.fandom.com/wiki/Counter-curse?oldid=1999918) | 2 | B5:PDF-p2469 | Open |
| [Counter-jinx](https://harrypotter.fandom.com/wiki/Counter-jinx?oldid=1866890) | 4 | B4:PDF-p1715 | Open |
| [Counter-spell](https://harrypotter.fandom.com/wiki/Counter-spell?oldid=1867523) | 1 | B5:PDF-p2764 | Open |
| [Cross-Species Switches](https://harrypotter.fandom.com/wiki/Cross-Species_Switches?oldid=2023308) | 1 | B4:PDF-p1492 | Open |
| [Cruciatus Curse](https://harrypotter.fandom.com/wiki/Cruciatus_Curse?oldid=2023195) | 20 | B4:PDF-p1319 | pain |
| [Curse](https://harrypotter.fandom.com/wiki/Curse?oldid=2022935) | 190 | B1:PDF-p44 | Open |
| [Curse of the Bogies](https://harrypotter.fandom.com/wiki/Curse_of_the_Bogies?oldid=1994853) | 1 | B1:PDF-p126 | Open |
| [Cursed barrier](https://harrypotter.fandom.com/wiki/Cursed_barrier?oldid=2026235) | 1 | B6:PDF-p3618 | Open |
| [Cushioning Charm](https://harrypotter.fandom.com/wiki/Cushioning_Charm?oldid=2019115) | 1 | B7:PDF-p4158 | Open |
| [Defensive jinx](https://harrypotter.fandom.com/wiki/Defensive_jinx?oldid=1840611) | 1 | B6:PDF-p3517 | Open |
| [Densaugeo](https://harrypotter.fandom.com/wiki/Densaugeo?oldid=1987202) | 1 | B4:PDF-p1404 | teeth |
| [Disarming Charm](https://harrypotter.fandom.com/wiki/Disarming_Charm?oldid=2024989) | 3 | B2:PDF-p459 | disarm |
| [Disillusionment Charm](https://harrypotter.fandom.com/wiki/Disillusionment_Charm?oldid=2022940) | 6 | B5:PDF-p1904 | disillusion |
| [Drought Charm](https://harrypotter.fandom.com/wiki/Drought_Charm?oldid=1840742) | 1 | B4:PDF-p1590 | Open |
| [Engorgement Charm](https://harrypotter.fandom.com/wiki/Engorgement_Charm?oldid=2022523) | 3 | B2:PDF-p381 | engorge |
| [Enlargement Charm](https://harrypotter.fandom.com/wiki/Enlargement_Charm?oldid=1757403) | 1 | B5:PDF-p2504 | Open |
| [Entrail-Expelling Curse](https://harrypotter.fandom.com/wiki/Entrail-Expelling_Curse?oldid=1955855) | 1 | B5:PDF-p2394 | Open |
| [Entrancing Enchantments](https://harrypotter.fandom.com/wiki/Entrancing_Enchantments?oldid=1970562) | 1 | B2:PDF-p509 | Open |
| [Episkey](https://harrypotter.fandom.com/wiki/Episkey?oldid=2019283) | 2 | B6:PDF-p3034 | episkey |
| [Erecto](https://harrypotter.fandom.com/wiki/Erecto?oldid=2025550) | 1 | B7:PDF-p3917 | erecto |
| [Evanesce](https://harrypotter.fandom.com/wiki/Evanesce?oldid=1860895) | 2 | B5:PDF-p1934 | vanish |
| [Expellimellius](https://harrypotter.fandom.com/wiki/Expellimellius?oldid=1968361) | 1 | B5:PDF-p2287 | Open |
| [Extension Charm](https://harrypotter.fandom.com/wiki/Extension_Charm?oldid=1990222) | 1 | B7:PDF-p3813 | extension |
| [Fidelius Charm](https://harrypotter.fandom.com/wiki/Fidelius_Charm?oldid=1933855) | 8 | B3:PDF-p851 | fidelius |
| [Fiendfyre](https://harrypotter.fandom.com/wiki/Fiendfyre?oldid=2012149) | 1 | B7:PDF-p4251 | fiendfyre |
| [Firestorm](https://harrypotter.fandom.com/wiki/Firestorm?oldid=1982211) | 1 | B7:PDF-p4249 | Open |
| [Flagrate](https://harrypotter.fandom.com/wiki/Flagrate?oldid=2026230) | 1 | B5:PDF-p2719 | mark |
| [Flame-Freezing Charm](https://harrypotter.fandom.com/wiki/Flame-Freezing_Charm?oldid=2019851) | 1 | B3:PDF-p630 | flame-freezing |
| [Flying charm](https://harrypotter.fandom.com/wiki/Flying_charm?oldid=1841108) | 1 | B5:PDF-p2169 | Open |
| [Force Spell](https://harrypotter.fandom.com/wiki/Force_Spell?oldid=1846514) | 1 | B1:PDF-p198 | Open |
| [Fountain of wine](https://harrypotter.fandom.com/wiki/Fountain_of_wine?oldid=1774823) | 1 | B4:PDF-p1417 | Open |
| [Four-Point Spell](https://harrypotter.fandom.com/wiki/Four-Point_Spell?oldid=1866819) | 4 | B4:PDF-p1715 | point |
| [Freeze!](https://harrypotter.fandom.com/wiki/Freeze%21?oldid=1931039) | 6 | B1:PDF-p206 | Open |
| [Freezing Charm](https://harrypotter.fandom.com/wiki/Freezing_Charm?oldid=1925305) | 4 | B2:PDF-p364 | freezing |
| [Full Body-Bind Curse](https://harrypotter.fandom.com/wiki/Full_Body-Bind_Curse?oldid=2025908) | 2 | B6:PDF-p3604 | body-bind |
| [Green Sparks](https://harrypotter.fandom.com/wiki/Green_Sparks?oldid=1934123) | 3 | B1:PDF-p201 | Open |
| [Gubraithian Fire](https://harrypotter.fandom.com/wiki/Gubraithian_Fire?oldid=1992924) | 1 | B5:PDF-p2327 | Open |
| [Hair-Thickening Charm](https://harrypotter.fandom.com/wiki/Hair-Thickening_Charm?oldid=1841431) | 1 | B5:PDF-p2294 | Open |
| [Hex](https://harrypotter.fandom.com/wiki/Hex?oldid=2012409) | 31 | B2:PDF-p295 | Open |
| [Hex-deflection](https://harrypotter.fandom.com/wiki/Hex-deflection?oldid=1768385) | 1 | B4:PDF-p1650 | Open |
| [Hocus Pocus](https://harrypotter.fandom.com/wiki/Hocus_Pocus?oldid=1923901) | 3 | B1:PDF-p182 | Open |
| [Homorphus Charm](https://harrypotter.fandom.com/wiki/Homorphus_Charm?oldid=1980897) | 1 | B2:PDF-p428 | Open |
| [Hover Charm](https://harrypotter.fandom.com/wiki/Hover_Charm?oldid=1985973) | 6 | B2:PDF-p275 | hover |
| [Hurling Hex](https://harrypotter.fandom.com/wiki/Hurling_Hex?oldid=1841677) | 1 | B3:PDF-p894 | Open |
| [Impediment Jinx](https://harrypotter.fandom.com/wiki/Impediment_Jinx?oldid=1939208) | 6 | B5:PDF-p2291 | Open |
| [Imperius Curse](https://harrypotter.fandom.com/wiki/Imperius_Curse?oldid=2023941) | 36 | B4:PDF-p1318 | control |
| [Imperturbable Charm](https://harrypotter.fandom.com/wiki/Imperturbable_Charm?oldid=2025672) | 1 | B5:PDF-p1921 | Open |
| [Impervius Charm](https://harrypotter.fandom.com/wiki/Impervius_Charm?oldid=1989386) | 1 | B5:PDF-p2270 | Open |
| [Inanimatus Conjurus Spell](https://harrypotter.fandom.com/wiki/Inanimatus_Conjurus_Spell?oldid=1841710) | 1 | B5:PDF-p2175 | Open |
| [Intruder Charm](https://harrypotter.fandom.com/wiki/Intruder_Charm?oldid=1841755) | 1 | B6:PDF-p2917 | Open |
| [Invisibility Spell](https://harrypotter.fandom.com/wiki/Invisibility_Spell?oldid=1841766) | 1 | B5:PDF-p2456 | Open |
| [Jiggery Pokery](https://harrypotter.fandom.com/wiki/Jiggery_Pokery?oldid=1866919) | 1 | B2:PDF-p264 | Open |
| [Jinx](https://harrypotter.fandom.com/wiki/Jinx?oldid=2022905) | 59 | B1:PDF-p155 | Open |
| [Killing Curse](https://harrypotter.fandom.com/wiki/Killing_Curse?oldid=2026178) | 14 | B4:PDF-p1321 | kill |
| [Langlock](https://harrypotter.fandom.com/wiki/Langlock?oldid=1973433) | 1 | B6:PDF-p3367 | tongue-lock |
| [Leg-Locker Curse](https://harrypotter.fandom.com/wiki/Leg-Locker_Curse?oldid=1993876) | 3 | B1:PDF-p175 | leg-lock |
| [Leviosa](https://harrypotter.fandom.com/wiki/Leviosa?oldid=1797174) | 5 | B1:PDF-p137 | Open |
| [Levitation Charm](https://harrypotter.fandom.com/wiki/Levitation_Charm?oldid=2024410) | 1 | B5:PDF-p2653 | levitation |
| [Liberacorpus](https://harrypotter.fandom.com/wiki/Liberacorpus?oldid=1996188) | 1 | B6:PDF-p3132 | dangling-release |
| [Memory Charm](https://harrypotter.fandom.com/wiki/Memory_Charm?oldid=2023001) | 9 | B2:PDF-p577 | memory |
| [Meteolojinx recanto](https://harrypotter.fandom.com/wiki/Meteolojinx_recanto?oldid=2020097) | 1 | B7:PDF-p3899 | unjinx-weather |
| [Mobiliarbus](https://harrypotter.fandom.com/wiki/Mobiliarbus?oldid=2020108) | 1 | B3:PDF-p847 | mobiliarbus |
| [Mobilicorpus](https://harrypotter.fandom.com/wiki/Mobilicorpus?oldid=2023275) | 1 | B3:PDF-p1039 | mobilicorpus |
| [Morsmordre](https://harrypotter.fandom.com/wiki/Morsmordre?oldid=2027812) | 1 | B4:PDF-p1235 | dark-mark |
| [Muffliato Charm](https://harrypotter.fandom.com/wiki/Muffliato_Charm?oldid=1961304) | 3 | B7:PDF-p3893 | Open |
| [Obliteration Charm](https://harrypotter.fandom.com/wiki/Obliteration_Charm?oldid=1461041) | 1 | B5:PDF-p2341 | obliterate-trace |
| [Partial Vanishment](https://harrypotter.fandom.com/wiki/Partial_Vanishment?oldid=1842992) | 1 | B5:PDF-p2503 | Open |
| [Patronus Charm](https://harrypotter.fandom.com/wiki/Patronus_Charm?oldid=2022830) | 5 | B3:PDF-p884 | patronus |
| [Pepper Breath](https://harrypotter.fandom.com/wiki/Pepper_Breath?oldid=1934735) | 1 | B4:PDF-p1445 | Open |
| [Permanent Sticking Charm](https://harrypotter.fandom.com/wiki/Permanent_Sticking_Charm?oldid=2005289) | 4 | B5:PDF-p1933 | sticking |
| [Peskipiksi Pesternomi](https://harrypotter.fandom.com/wiki/Peskipiksi_Pesternomi?oldid=1968362) | 1 | B2:PDF-p364 | pixie-attempt |
| [Possession](https://harrypotter.fandom.com/wiki/Possession?oldid=2011972) | 36 | B1:PDF-p149 | Open |
| [Protean Charm](https://harrypotter.fandom.com/wiki/Protean_Charm?oldid=1924622) | 1 | B5:PDF-p2292 | protean |
| [Protego totalum](https://harrypotter.fandom.com/wiki/Protego_totalum?oldid=1952091) | 2 | B7:PDF-p3916 | perimeter |
| [Purple Firecrackers](https://harrypotter.fandom.com/wiki/Purple_Firecrackers?oldid=1730290) | 1 | B1:PDF-p138 | Open |
| [Red Sparks](https://harrypotter.fandom.com/wiki/Red_Sparks?oldid=2022926) | 11 | B1:PDF-p201 | Open |
| [Reductor Curse](https://harrypotter.fandom.com/wiki/Reductor_Curse?oldid=2023033) | 4 | B4:PDF-p1715 | reducto |
| [Revulsion Jinx](https://harrypotter.fandom.com/wiki/Revulsion_Jinx?oldid=2022562) | 1 | B7:PDF-p3915 | Open |
| [Salvio hexia](https://harrypotter.fandom.com/wiki/Salvio_hexia?oldid=1993055) | 2 | B7:PDF-p3916 | salvio |
| [Scarpin's Revelaspell](https://harrypotter.fandom.com/wiki/Scarpin%27s_Revelaspell?oldid=1722285) | 1 | B6:PDF-p3307 | properties-reveal |
| [Scouring Charm](https://harrypotter.fandom.com/wiki/Scouring_Charm?oldid=2020332) | 1 | B4:PDF-p1315 | clean |
| [Severing Charm](https://harrypotter.fandom.com/wiki/Severing_Charm?oldid=2020348) | 2 | B4:PDF-p1518 | sever |
| [Shield Charm](https://harrypotter.fandom.com/wiki/Shield_Charm?oldid=2023834) | 15 | B4:PDF-p1715 | shield |
| [Silencing Charm](https://harrypotter.fandom.com/wiki/Silencing_Charm?oldid=2020355) | 2 | B5:PDF-p2265 | silence |
| [Slug-vomiting Charm](https://harrypotter.fandom.com/wiki/Slug-vomiting_Charm?oldid=2026530) | 1 | B5:PDF-p2296 | Open |
| [Specialis Revelio](https://harrypotter.fandom.com/wiki/Specialis_Revelio?oldid=2020466) | 2 | B6:PDF-p3075 | properties-reveal |
| [Spell](https://harrypotter.fandom.com/wiki/Spell?oldid=2027335) | 163 | B1:PDF-p43 | Open |
| [Squiggly wiggly](https://harrypotter.fandom.com/wiki/Squiggly_wiggly?oldid=1867228) | 1 | B2:PDF-p264 | Open |
| [Sticking Charm](https://harrypotter.fandom.com/wiki/Sticking_Charm?oldid=1843719) | 4 | B5:PDF-p1933 | Open |
| [Stinging Jinx](https://harrypotter.fandom.com/wiki/Stinging_Jinx?oldid=2000025) | 1 | B7:PDF-p4089 | Open |
| [Stunning Spell](https://harrypotter.fandom.com/wiki/Stunning_Spell?oldid=2022605) | 15 | B4:PDF-p1441 | stun |
| [Substantive Charm](https://harrypotter.fandom.com/wiki/Substantive_Charm?oldid=1844156) | 1 | B5:PDF-p2648 | Open |
| [Summoning Charm](https://harrypotter.fandom.com/wiki/Summoning_Charm?oldid=2020188) | 15 | B4:PDF-p1175 | summoning |
| [Sunshine, daisies, butter mellow, turn this stupid, fat rat yellow](https://harrypotter.fandom.com/wiki/Sunshine%2C_daisies%2C_butter_mellow%2C_turn_this_stupid%2C_fat_rat_yellow?oldid=1890533) | 1 | B1:PDF-p84 | Open |
| [Supersensory Charm](https://harrypotter.fandom.com/wiki/Supersensory_Charm?oldid=1987835) | 1 | B7:PDF-p4357 | Open |
| [Switching Spell](https://harrypotter.fandom.com/wiki/Switching_Spell?oldid=2016367) | 2 | B4:PDF-p1342 | Open |
| [Taboo](https://harrypotter.fandom.com/wiki/Taboo?oldid=2027186) | 3 | B7:PDF-p4026 | taboo |
| [Talking spell](https://harrypotter.fandom.com/wiki/Talking_spell?oldid=1972584) | 1 | B5:PDF-p2504 | Open |
| [Thief's Downfall](https://harrypotter.fandom.com/wiki/Thief%27s_Downfall?oldid=2020436) | 2 | B7:PDF-p4158 | Open |
| [Tickling Charm](https://harrypotter.fandom.com/wiki/Tickling_Charm?oldid=2022993) | 1 | B2:PDF-p460 | tickle |
| [Time](https://harrypotter.fandom.com/wiki/Time?oldid=2019357) | 1341 | B1:PDF-p2 | Open |
| [Trace](https://harrypotter.fandom.com/wiki/Trace?oldid=2027176) | 45 | B2:PDF-p470 | trace |
| [Trans-Species Transformation](https://harrypotter.fandom.com/wiki/Trans-Species_Transformation?oldid=2000888) | 1 | B7:PDF-p3994 | Open |
| [Transfiguration](https://harrypotter.fandom.com/wiki/Transfiguration?oldid=2022917) | 73 | B1:PDF-p52 | Open |
| [Transforming Spells](https://harrypotter.fandom.com/wiki/Transforming_Spells?oldid=2020570) | 1 | B4:PDF-p1492 | Open |
| [Transmogrifian Torture](https://harrypotter.fandom.com/wiki/Transmogrifian_Torture?oldid=1842349) | 1 | B2:PDF-p406 | Open |
| [Trip Jinx](https://harrypotter.fandom.com/wiki/Trip_Jinx?oldid=2019245) | 1 | B5:PDF-p2532 | Open |
| [Unbreakable Charm](https://harrypotter.fandom.com/wiki/Unbreakable_Charm?oldid=1843811) | 1 | B4:PDF-p1833 | Open |
| [Unbreakable Vow](https://harrypotter.fandom.com/wiki/Unbreakable_Vow?oldid=1991314) | 6 | B6:PDF-p2834 | vow |
| [Unforgivable Curses](https://harrypotter.fandom.com/wiki/Unforgivable_Curses?oldid=2023004) | 7 | B4:PDF-p1108 | unforgivable |
| [Vanishing Spell](https://harrypotter.fandom.com/wiki/Vanishing_Spell?oldid=2022556) | 3 | B2:PDF-p359 | vanish |
| [Whirlwind](https://harrypotter.fandom.com/wiki/Whirlwind?oldid=1922253) | 1 | B5:PDF-p2774 | Open |

</details>

## From spell families to playable rules

### ACT NOW

The book comparisons below separate a shared operation from the particular method that delivers it. The proposed fixture checks use the same state readers for the familiar spell and any variant.

| Family | Book comparison | Proposed rule and observable check |
| --- | --- | --- |
| **Movement** | Accio brings the Firebolt to Harry (B4 p1461). Banishing class sends cushions away toward chosen destinations (B4 p1584). Wingardium Leviosa keeps the sidecar airborne without steering (B7 p3716). | Bind a target and direction or destination where the method requires them. Represent support and steering independently. Lift a blocked board, summon the exposed item, then release the board. Check that moving the board opens an actual route and that release closes it. |
| **Defense and endings** | Finite Incantatem ends two effects at the Dueling Club (B2 p461). Harry's Finite steadies a rampart (B7 p4245). Nox extinguishes light (B3 p995). | Give an ending something concrete to read. Compare releasing an active light with ending a force or preventing an incoming effect. Track the aftermath. Ending a restraint can resume falling, while a closed wound needs its own operation. The rampart scene leaves the exact underlying effect open. |
| **Material change** | Glisseo reshapes stairs into a chute. Duro hardens a tapestry in the same chase (B7 p4258). | Change the actual surface or material and let movement and collision read it. On the same route compare a soft curtain and a hardened one. A route with a slope should affect traversal while the conditions that made the surface persist remain local. |
| **Observation and signals** | Homenum Revelio yields a usable presence report in one scene and no visible change in another (B7 pp3822 and 4056). Prior Incantato produces a visible echo from the targeted wand (B4 p1243). | Bind a query, what it reads, the scope and who receives its output. An empty result can mean no matching target, insufficient access or unreadable output. Show what the character actually learned. An invented query for a prior cast on a wand can reuse the history operation with a time constraint, if the available trace and a workable form support it. |
| **Living targets and directed agents** | Avis produces birds (B4 p1416). Oppugno directs already-present birds (B6 p3213). McGonagall animates the castle's defenders, then speaks orders (B7 pp4220–4221). | Distinguish making, animating and directing. A produced or animated agent gets a stable identity if it can later be ordered, harmed or interrupted. Test a working that moves an inert practice figure against one that gives it the means to follow an order. The second needs that operation and a suitable target. |
| **Access and commitments** | A Parseltongue request opens the Chamber and fails on the Snitch (B2 p580, B7 p4067). The Unbreakable Vow proceeds clause by clause with replies and a third participant (B6 pp2879–2881). | Keep the receiver and what it checks separate from the words. A repeating ritual can compress its presentation while preserving each participant's response and the precise clause. Change one response in a fixture and check which commitments have settled. |

### ACCOUNT FOR NOW

**V8a. Go from the result back through the expression.** Use the smallest layer that changes a prediction. Keep the deeper layers available for a tradition where they matter.

| Layer | What to record | Hogwarts example |
| --- | --- | --- |
| **World change and conditions** | What state changes, what can read the change, and whether the operation persists. Track paths, resistance, control and termination when they change the result. | The club lifts, can fall, and may strike something. The same movement rules can apply to a player-designed method. |
| **Meaning and roles** | Distinguish an operation, target kind, actual referent, direction or scope, and the conditions for a useful result. A word may name a binding or tell the caster which technique to perform. | Firebolt in Accio Firebolt plausibly selects an object. Mobilicorpus and Mobiliarbus suggest different target kinds. A typed body role gives no ankle anchor by itself. |
| **Construction and morphemes** | Keep the whole attested construction with candidate segments. A morpheme is a smallest unit with a meaning or grammatical function. Mark each proposed segment as a root, stem, affix, free word or unknown. Preserve competing cuts where evidence is weak. | The repeated `-corpus` gives a body clue. `mobili-` predicts a movement family across the body and tree cases. A plausible ending in Wingardium can remain an etymological lead without being a magical modifier. |
| **Pronunciation and prosody** | Keep attested syllables, stress, duration and pauses on the form where they affect delivery. A phoneme is a sound distinction that can distinguish forms in a language. Individual phonemes ordinarily carry no independent lexical meaning. A sound pattern can suggest a family or cue rhythm. Record phonetic detail only where it is known or changes how the player practises. | Hermione explicitly lengthens the *gar* syllable and separates the beats of Leviosa (B1 p137). That is local teaching evidence. Cho's stumbles and the fire in the room (B5 p2287) occur while she is nervous. The cause of the fire remains unresolved at the level of a single sound change. |
| **Medium and embodiment** | Preserve spelling, pronunciation source, hand or wand motion, focus, silent technique and any other means. A written form, a performed pronunciation and an inner rendering can have different evidence. | A student can recognize a phrase on paper, say it under instruction, or learn a mental form. An account that omits words gives no pronunciation. A game can let the player choose or practise a cadence with text controls. |

Going a layer deeper can explain why a form is recognizable or reproducible. It can also expose a false comparison. Allen and Greenough's Latin grammar documents `-ōsus` as a derivational ending. Its resemblance to `-osa` gives a hypothesis for *Leviosa*. The book still supplies the lift and the taught performance. It leaves the ending's independent function unresolved. Real-world etymology can help the designer name a spell. In-world productivity earns separate evidence through demonstrations or deliberately varied casts. [Latin adjective derivation](https://dcc.dickinson.edu/grammar/latin/derivation-adjectives) · [Official spell etymologies](https://www.harrypotter.com/features/the-etymology-of-harry-potter-spells)

Gakuji Kumagai's spell sound-symbolism study drew 305 wiki entries, of which 174 had pronunciation guides. It analyzed 171 after excluding three with variant pronunciations. Its pronunciations and imagery are useful comparisons for authoring. The source spans media and the paper has no direct in-world power scale. Keep syllable length and features such as voicing or stressed vowels as descriptive data and optional design cues. A pronunciation variant can be trained or compared in its own tradition. Preserve source and medium before using any phonetic transcription. [Sound-symbolism study, §2](https://www.degruyterbrill.com/document/doi/10.1515/opli-2021-0025/html)

**V8b. Use family predictions that can fail.** The following are qualitative tests against the book and official cross-reference. A match earns only the specific field it predicts.

| Hypothesis | Challenge and result |
| --- | --- |
| `-corpus` narrows the target to a body. | Levicorpus and Mobilicorpus affect bodies with different anchors, and Liberacorpus reads a support already on one. The target clue survives. A proposed rule of “one ankle and inversion” fails on transport. |
| Movement vocabulary supplies a general “make this move” operation. | Locomotor carries named cargo. The Leg-Locker constrains legs. The castle spell animates a cohort and is followed by explicit orders. A broad movement association survives and the proposed single operation fails. The official and extracted spellings for the castle spell also differ. |
| A shared qualifier fixes effect geometry. | Totalus and Totalum suggest breadth. A whole-body restraint and a perimeter working give different geometries. Broad scope is a usable clue, with extent and binding supplied by the working. |
| A closer spelling or changed sound predicts an effect change. | The held extract's Piertotum Locomator, the official index's Piertotum locomotor and the detail page's incantation field describe the same animation evidence. These are source variants. The classroom correction to Wingardium is actual within-scene performance evidence. Treat the two kinds of variation differently. [Official Animation Charm](https://www.harrypotter.com/fact-file/spells/the-animation-charm) |
| Saying a familiar short counter word undoes whatever is happening. | Finite ends the duelling effects in a witnessed setting. In the Room of Requirement it steadies the rampart. Nox reads a wandlight. The evidence supports matching what a method can end, with lasting consequences settled by their own causes. |

**V8c. Let lore and play meet in an experiment.** An original Hogwarts caster can infer that a movable prop might be carried by a variation on the mobility forms. Start from the two methods they actually know and an inert practice figure with a defined route. Propose a form that binds the target and supplies transport, including support and ending. The player might use a written phrase, a taught stroke or a new combination of the two. A useful prediction is that the figure reaches the mark and stays inert. If it obeys a command after being moved, inspect what supplied animation. Compare against the separately learned lift and transport sequence, a blocked route, and an attempt where the target name changes but refers to the same figure. This tests whether the changed word really supplies a target binding and whether the proposed form actually executes the operation. Keep a newly invented form, a borrowed word, a learner's spelling, and a regional pronunciation as distinct records with a discoverable provenance.

For a fully original vocabulary-based world, a productive root system is a legitimate local law. Give each productive part a scope, expected type and demonstrated contrast, then offer teachable alternate forms. A tradition could distinguish cast forms with vowel length while another relies on the same verbal root and a different stroke. Implement pronunciation-sensitive performance where it creates a choice or meaningful observation. Leave other spelling and accent variation as data. Use the same evaluator for proposed forms and working classroom methods so a novel can teach the player what to infer without making every sound sequence executable. An unusual variant worth testing is a wordless school that treats stroke boundaries and rhythm as the compositional units. It can share typed operations and research evidence with the spoken school while having its own expression rules.

**Runtime fit.** [The existing dictionary](../../src/spell_dictionary.js) already records expression parts, grammar slots, morphology and evidence on Wingardium Leviosa. Accio has a target-reference slot. [The working compiler](../../src/spell_working.js) takes known method IDs and revisions, binds typed targets and lowers supported operations. This provides a place to compare book families without putting text heuristics in the cast executor. The first catalogue is research data. A player-facing entry can project the character's known form and trials through the existing spell and knowledge owners. Use the [procedural engine evidence](PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md) to distinguish the currently playable school bench from operations and linguistic features still proposed.

### LATER / DELEGATE

| Trial | Effort and observable result |
| --- | --- |
| **T12. Cross-family operation check.** | Runtime designer, medium. Keep the school movement lesson and add a second family with an actual consumer, such as light and targeted release. Start with two active lights, end the one the caster can bind, and verify what remains observable. Compare the existing source spell with one newly parameterized use. |
| **T13. Morphology and delivery check.** | Source and runtime designer, medium. Freeze predictions for target class, operation and scope before checking unseen families. Compare whole-form lookup, the most common family and segmented form. Score correct fields, wrong fields and abstentions separately. In play, vary one cadence or form part with caster, gesture and target held steady. Verify that a known alternate pronunciation can work if supported, with the actual in-game rule recorded. |
| **T14. Complete the catalogue.** | Source designer, large. Classify each unjoined wiki candidate by medium and identity. For book magic, follow casts, failures, reports and aftermath in the seven novels. Keep aliases and failed phrases linked without doubling spell counts. Add field-level support for the target, speech, gesture, focus, ending and known variation. Track coverage by source and family. |

**Verification.** This edition checks all 124 prior concordance labels for representation, 41 official index entries for linkage, and all 777 pinned wiki title queries against the novel index. The new family and language tests are source comparisons and proposed fixtures. Implementation and the complete chapter-by-chapter spell census remain open.
