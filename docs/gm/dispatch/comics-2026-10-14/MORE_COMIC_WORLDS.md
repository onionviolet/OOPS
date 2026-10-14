# K2: more comic worlds

## CHECKPOINT

2026-10-14. Research complete at survey depth. Owner: Lane K2. Write scope:
this file and [K2_REPORT.md](K2_REPORT.md) only. Read COMMON first, then live
project direction, the earlier comics pilot, target tests and bounded-comparison
owner. Twenty-five reference worlds below cover all twenty-one requested titles
plus The Incal, Valerian & Laureline, The Wicked + The Divine and Chew.
Root reconciliation: CW4-CW8, CL2, CL5, CL14, CO10. No T1-T24 cards repeated.
Next use: root may absorb the corrections and K2I ideas from the report. Selected
worlds still need scene-level audits; there is no gameplay implementation or
acceptance claim. No source, bundle, save, private pack, commit or push work.

## Scope and evidence

This is a palette of references and authoring proposals, not a selected roster
or franchise pack. Direct adaptations belong in the private pack. Public source
names and brief paraphrases identify research references; no dialogue, images or
comic pages are copied into this repository.

Authority: [PROJECT](../../../../PROJECT.md),
[USER_VISION](../../../USER_VISION.md),
[target tests](../../../research/comics/PLAYTHROUGH_TARGETS.md#what-makes-a-good-target)
and [bounded comparisons](../../../worlds/LORE_AND_CONTINUITY.md#bounded-comic-comparisons).
The existing canon-first order and one-playable-slice milestone stay in force.
Ranking here orders possible K2 builds within that direction; it does not promote
this lane above Harry Potter, D&D or the accepted book/anime tier.

**SHOWN** means an inspected page, API field or transcript at the named location.
**STATED** means a publisher, creator or wiki makes the claim. A wiki's account
of a scene is still STATED canon, even when its text was SHOWN through the API.
**INFERRED** marks proposed gameplay, roles, scope, costs and evaluations.
**MEMORY** means unchecked recall. No MEMORY claim below is promoted to canon.
Official catalogue text establishes a premise or range, not every rule exception.

Counts are SHOWN MediaWiki `statistics.articles`, fetched 2026-10-14 through the
existing [pilot helper](../../../research/comics/fetch_wiki.py): one request at a
time, with its 0.4-second delay. Reproduce with
`api.php?action=query&meta=siteinfo&siprop=statistics&format=json` at each named
wiki; French Valerian uses `/fr/api.php`. Counts describe entire wikis, including
mixed media and later canon, not the number of useful pages in a snapshot.
Text pulls used `prop=revisions&rvprop=content&rvslots=main`, with named titles
and redirects. No bulk capture, comic scans or source downloads were made.
Failed routes were replaced with indexed official text or another source.

## Source desk

Sources were read as metadata, premise text and selected wiki rule pages, not as
complete comics. Each S code supplies the best next source and its limitations.
Links listed as a locator or next read were not scene-verified this session.

| Code | Reference | Wiki and SHOWN article count | Official source and inspected location |
|---|---|---|---|
| S01 | Asterix | [Asterix Wiki](https://asterix.fandom.com/wiki/Magic_Potion), **626**; Magic Potion and Obelix pages; mixed albums/adaptations | [Official album locator](https://www.asterix.com/en/the-collection/illustrated-albums/how-obelix/) is a next read, not a successful fetch. [Parc Astérix character text](https://www.parcasterix.fr/en/to-do-in-park/obelix) corroborates the childhood cauldron incident through indexed official text. |
| S02 | Thorgal | [Thorgal Wiki](https://thorgal.fandom.com/wiki/Thorgal_Aegirsson), **156**; character origins, incomplete later coverage | [Thorgal universe](https://www.thorgal.com/univers), [L'Enfant des étoiles](https://www.thorgal.com/albums/thorgal/enfant-des-etoiles) and [character](https://www.thorgal.com/personnages/thorgal-aegirsson): indexed official setting/album text; primary album reading remains open. |
| S03 | Judge Dredd | [Judge Dredd Wiki](https://judge-dredd.fandom.com/wiki/Mega-City_One), **487**; city and judicial authority | [2000 AD official primer](https://2000ad.com/wp-content/uploads/2019/11/40th_insert.pdf), indexed catalogue text only. [Judge Dredd overview](https://en.wikipedia.org/wiki/Judge_Dredd) STATED real-time calendar; exact physical-age exceptions require primary arcs. BARNEY fan index is a locator, not the publisher. |
| S04 | Saga | [Correct comic wiki](https://sagacomic.fandom.com/wiki/Saga), **99**; not `saga.fandom.com`, which the earlier pilot found covers the games | [Image series page](https://imagecomics.com/comics/series/saga), premise and collection list; a bounded arc is needed. |
| S05 | Locke & Key | [Keys](https://lockeandkey.fandom.com/wiki/Keys) and [Riffel Rule](https://lockeandkey.fandom.com/wiki/Riffel_Rule), **335**; separate Comic and Netflix headings | [IDW collection](https://idwpublishing.com/collections/locke-key), indexed collection list; original six arcs, not Netflix or later crossovers. Wiki rule cites Clockworks #4. |
| S06 | Paper Girls | [Series](https://paper-girls.fandom.com/wiki/Paper_Girls) and [Old-Timers](https://paper-girls.fandom.com/wiki/Old-Timers), **121**; the latter is a stub | [Image series](https://imagecomics.com/comics/series/paper-girls), premise and #30 listing; [complete collection](https://imagecomics.com/comics/releases/paper-girls-the-complete-story-tp) is a next-read locator. |
| S07 | Y: The Last Man | [DC Database series index](https://dc.fandom.com/wiki/Y%3A_The_Last_Man_Vol_1), **135,315 sitewide**, not a dedicated Y wiki; inspected premise and 60-issue field | [DC #60](https://www.dc.com/comics/y-the-last-man-2002/y-the-last-man-60), indexed official issue listing. Dedicated guessed wiki returned 404, so use the actual DC index. |
| S08 | Black Science | [Image Comics Database issue index](https://imagecomics.fandom.com/wiki/Black_Science_Vol_1), **11,372 sitewide**; dedicated guessed wiki returned 404 | [Image series](https://imagecomics.com/comics/series/black-science), stranded-worlds premise and #43 listing. Full machine timing rules remain a scene question. |
| S09 | The Sandman | [The Endless](https://sandman.fandom.com/wiki/The_Endless), **994**; mixes comic, screen and expanded books | [DC collected range](https://www.dc.com/graphic-novels/the-sandman-1989/the-sandman-morpheus-helm-masterpiece-edition), indexed official text names original #1-75 plus separate extras. Freeze #1-75; do not import every item in that box. |
| S10 | Fables | [Fable](https://fables.fandom.com/wiki/Fable), **1,358**; popularity-linked longevity, later #162 and spin-offs | [DC #162](https://www.dc.com/comics/fables-2002/fables-162), indexed official listing confirms continuation beyond #150. |
| S11 | Astro City | [City](https://astrocity.fandom.com/wiki/Astro_City), **100**, thin coverage | [Image series](https://imagecomics.com/comics/series/astro-city), civilians, reporter and small-time criminal in its premise text. |
| S12 | Order of the Stick | [New Edition](https://oots.fandom.com/wiki/New_Edition), [Order](https://oots.fandom.com/wiki/Order_of_the_Stick), [Snarl](https://oots.fandom.com/wiki/Snarl), **2,021** | [Creator's strip 1](https://www.giantitp.com/comics/oots0001.html), official frame/title checked; scene content checked through the wiki transcript, not image inspection. Strip 1 panels 6-10 locate the edition change and its mechanical consequences. |
| S13 | Erfworld | [Erfwiki](https://wiki.erfworld.com/) is restricted by the creator's notice; **size UNVERIFIED**, no guessed historical count | [Creator's 2019 notice](https://erfworld.com/landing) and [authorized archive](https://archives.erfworld.com/) checked. [Overview](https://en.wikipedia.org/wiki/Erfworld), plot section, STATED game-like physics and calculator advantage. Detailed turn/hex rules remain primary-archive questions. |
| S14 | Homestuck | [Sburb](https://mspaintadventures.fandom.com/wiki/Sburb), [Sylladex](https://mspaintadventures.fandom.com/wiki/Sylladex), [Scratch](https://mspaintadventures.fandom.com/wiki/Scratch), [Andrew Hussie](https://mspaintadventures.fandom.com/wiki/Andrew_Hussie), **1,382**; count is for this Fandom site, not every successor wiki | [Official original story](https://www.homestuck.com/story/1), reachable but no extracted body text. Wiki Homestuck page STATED original 8,129-page story and separate credits; page-level visual/media inspection remains open. |
| S15 | Girl Genius | [Spark](https://girlgenius.fandom.com/wiki/Spark), **2,042**; inventor trait, charisma and non-Spark engineers | [Creator cast/terms](https://www.girlgeniusonline.com/info/cast/everybody.php), indexed official Spark definition. Wiki cites Secret Blueprints vol. 1 p. 2 and dated comic locators. |
| S16 | Gunnerkrigg Court | [The Ether](https://gunnerkrigg.fandom.com/wiki/The_Ether), [Etheric Sciences](https://gunnerkrigg.fandom.com/wiki/Etheric_Sciences), [Court](https://gunnerkrigg.fandom.com/wiki/Gunnerkrigg_Court), **313**; belief claims include Coyote's theory, not settled omniscient truth | [Creator archive](https://www.gunnerkrigg.com/), chapter menu checked; early chapters are a small source edge. |
| S17 | Bone | [Original series](https://boneville.fandom.com/wiki/Bone_(original_series)), [Lord of the Locusts](https://boneville.fandom.com/wiki/Lord_of_the_Locusts), **197**; original 55 issues/nine books, dream threat | [Creator site](https://www.boneville.com/), official one-volume/nine-book context. Wiki Ghost Circles page is a next scene locator for dream effects. |
| S18 | Usagi Yojimbo | [Series](https://usagiyojimbo.fandom.com/wiki/Usagi_Yojimbo_(series)), **470**; old publisher history is stale, use it for indexing with care | [Creator site](https://www.stansakai.com/) and [publisher's Yokai](https://www.penguin.co.nz/books/usagi-yojimbo-yokai-9781621155485), About the Book: self-contained 64-page story, rescue and imminent spirit raid. |
| S19 | Calvin and Hobbes | [Calvinball](https://calvinandhobbes.fandom.com/wiki/Calvinball), **560**; changeable game rules | [Licensed strip locator](https://www.gocomics.com/calvinandhobbes/1991/06/13), indexed text only. [Museum's Watterson exhibition](https://cartoons.osu.edu/exhibits/exploring-calvin-and-hobbes), official archive context: 1985-1995 strip, six-year-old lead. |
| S20 | My Hero Academia | [Quirk](https://myheroacademia.fandom.com/wiki/Quirk), [Heroes](https://myheroacademia.fandom.com/wiki/Heroes), [Manga](https://myheroacademia.fandom.com/wiki/My_Hero_Academia_(Manga)), **3,300**; manga/anime fields separate | [VIZ series](https://www.viz.com/my-hero-academia), vol. 42 explicitly marked final. Freeze main manga through that volume, including its bonus chapter if that edition is selected; exclude Vigilantes, films and anime additions. |
| S21 | One-Punch Man | [Hero Association](https://onepunchman.fandom.com/wiki/Heroes/Hero_Association), [Limiter](https://onepunchman.fandom.com/wiki/Limiter), **1,835**; webcomic/manga/anime fields mixed | [VIZ manga](https://www.viz.com/one-punch-man), ONE/Murata attribution and anomalous lead strength. Webcomic and redraws are different source versions; the limiter account is a character's theory. |
| S22 | The Incal | [Overview](https://en.wikipedia.org/wiki/The_Incal), **wiki size UNVERIFIED**; no useful dedicated wiki found through the attempted API route | [Humanoids edition](https://www.humanoids.com/album/1110) and [official 2024 rights catalogue](https://www.humano.com/secure2/PageBlock/393/Right_catalog_Humanoids_2024_OK_compressed_57048_original.pdf), indexed six-volume core and artifact premise. Before/After/Final Incal are separate source sets. |
| S23 | Valerian & Laureline | [French Wiki Valerian](https://valerian.fandom.com/fr/wiki/Wiki_Valerian), **11**; very thin, official edition is better | [Cinebook via distributor](https://www.simonandschuster.biz/books/The-City-of-Shifting-Waters/Christin-Pierre/Valerian-Laureline/9781849180382), About the Book and edition length. |
| S24 | The Wicked + The Divine | [Recurrence](https://wicdiv.fandom.com/wiki/Recurrence), **198**; later account challenges the advertised cycle explanation | [Image series](https://imagecomics.com/comics/series/the-wicked-the-divine), advertised 90-year/12-god/two-year pattern and #45 listing. Treat the public pattern as a claim to investigate, not immutable law. |
| S25 | Chew | [Image issue index](https://imagecomics.fandom.com/wiki/Chew_Vol_1) and [Anthony Chu](https://imagecomics.fandom.com/wiki/Anthony_Chu_(Chew)), **11,372 sitewide** | [Image series](https://imagecomics.com/comics/series/chew), eating-derived impressions, investigation and state interest; #60 listing. Exclude later Chu and crossovers by default. |

## The four tests

Assessment is **INFERRED survey fitness**, not source-complete or runtime proof.
B = bounded source edge; N = consequential natural course; U = distinct rule;
R = room for an unchosen person. **P** = plausible at the named scope;
**C** = conditional on the listed audit/design work; **W** = weak as requested.
P does not mean that a complete canon run was read. The next section gives
each boundary, clock, rule and role rather than treating every title as a pass.

| World code | B | N | U | R | Main condition |
|---|---|---|---|---|---|
| K2W01 Asterix | P | P | P | P | Choose one album's potion-supply conflict, not a universal conquest timer. |
| K2W02 Thorgal | P | C | C | P | Album-specific curse/bargain and its terms need primary scenes. |
| K2W03 Dredd | P | P | P | P | Freeze one city era and case, not all 2000 AD properties. |
| K2W04 Saga | P | P | C | P | Strong war/social premise; no unique universal magic equation verified. |
| K2W05 Locke & Key | P | P | P | P | Audit comic keys and the age/knowledge rule, not Netflix substitutes. |
| K2W06 Paper Girls | P | P | P | P | Time enforcement is stated; exact rewrite/retention rules need scenes. |
| K2W07 Y | P | P | P | P | Start as an ordinary survivor; extra immunity is an explicit AU. |
| K2W08 Black Science | P | P | P | P | Audit jump trigger, horizon and return conditions. |
| K2W09 Sandman | P | P | P | P | Cosmic duties/constraints require selected scenes, not stat conversion. |
| K2W10 Fables | P | P | P | P | Popularity-linked survival is not a universal damage multiplier. |
| K2W11 Astro City | P | C | C | P | A specific case must supply both clock and special rule. |
| K2W12 OotS | P | P | P | P | Restrict represented rules; no automatic full D&D simulator. |
| K2W13 Erfworld | P | P | P | P | Book 1 boundary exists; detailed rules/access audit stays open. |
| K2W14 Homestuck | P | P | P | P | Session graph and version manifest are expensive, not absent. |
| K2W15 Girl Genius | P | P | P | P | A normal engineer does not acquire Spark by ordinary XP. |
| K2W16 Gunnerkrigg | P | C | P | P | Select an actual local crisis; belief theories stay attributed. |
| K2W17 Bone | P | P | P | P | Dream access is not automatically granted to all sleepers. |
| K2W18 Usagi | P | P | C | P | Yokai supplies a clock; folklore alone is not a unique mechanic. |
| K2W19 Calvin | P | W | P | P | No canon catastrophe clock. A local consequence is a lighter test. |
| K2W20 MHA | P | P | P | P | Licence, physiology and legacy exceptions must stay separate. |
| K2W21 OPM | P | P | P | P | Rank is institutional, not a ceiling on actual strength. |
| K2W22 Incal | P | P | C | P | Artifact authority needs exact scenes before a reusable rule. |
| K2W23 Valerian | P | P | P | P | Freeze one album's past/future relationship; no imported modern history. |
| K2W24 WicDiv | P | P | P | P | Reported cycle and its true causes are distinct knowledge layers. |
| K2W25 Chew | P | P | P | P | Observation needs a consumed sample and custody, not free omniscience. |

## World cards

The law paragraphs are STATED references unless marked otherwise. All entry
options, non-lead roles, representable power ranges and Default/Dial/Reasonably
choices are INFERRED proposals. A local range is the first represented slice,
not a nerf or permanent limit on the world's stronger beings. Natural-course
paragraphs distinguish sourced pressure from a proposed playable clock. A lead's
canonical intervention is part of that course unless the player's action changes
its causes; abstention does not automatically mean the villains win.

### K2W01: Asterix, S01

**Signature:** temporary super-strength depends on a druid's potion and protected
knowledge; an exceptional childhood exposure gives one person lasting strength.
The exception is not a recipe for universal permanent upgrades.

**Bound/entry:** one early album, preferably Asterix the Gaul, frozen to its own
rules. Enter before a druid is targeted, during a supply problem, or after the
album's resolution. Later aliens, films and potion variants need separate scope.

**Natural course:** Romans seek the recipe and threaten the source. Proposed
clock: capture/access and stock change locally; lead actions continue without
the visitor. A whole-series inevitable Roman victory would contradict the premise.

**Life/range:** herb supplier, messenger, smith, merchant or legionary; comic
village life and slapstick. Local ceiling: potion-strength feats, not cosmic power.
Default: temporary supply. Dial: stock, duration and protected knowledge.
Reasonably: confirm selected album's effects; avoid invented exact seconds.

### K2W02: Thorgal, S02

**Signature:** advanced ancestry and Norse divine realms coexist; inherited
capacity, artifacts and divine terms are different sources. Archery practice
does not confer an alien bloodline. Exact transferable gifts remain unaudited.

**Bound/entry:** core album L'Enfant des étoiles, or a named closed album cluster.
Enter as a coastal resident before its voyage, during it, or in its aftermath.
Youth, Louve, Kriss and Saga lines are separate dependencies, not automatic prequels.

**Natural course:** family and settlement are exposed to raiders and otherworldly
intervention. A specific curse/bargain deadline is C, pending the chosen album's
scenes; do not invent an apocalypse to strengthen the card.

**Life/range:** fisher, navigator, healer, craft worker or captive; harsh mythic
family adventure. Human survival locally, gods and exceptional kin much higher.
Default: one coastal adventure. Dial: lineage and divine jurisdiction.
Reasonably: preserve unequal means without granting the visitor the lead's origin.

### K2W03: Judge Dredd, S03

**Signature:** one institution combines policing, verdict and punishment; its
calendar broadly advances with publication years. Institutional authority can
overwhelm an individually stronger person. Calendar age and medical rejuvenation
must be tracked separately.

**Bound/entry:** one Complete Case Files era plus a named case/issue manifest.
Before a city crisis, during emergency rule, or reconstruction are different
starts. 2000 AD is an anthology, not a shared universe automatically imported here.

**Natural course:** crime, authoritarian enforcement and crisis actors proceed.
Proposed clock: warrants, raids, block access and supplies, supported by a selected
case. Legal power is not a claim that the judges' moral judgments are correct.

**Life/range:** medic, delivery worker, citizen organiser, investigator or cadet;
violent satire. Street weapons/vehicles locally, psychic and larger threats by
arc. Default: fixed historical era. Dial: case date and institutional reach.
Reasonably: no real-world elapsed-time ageing of a closed player save by implication.

### K2W04: Saga, S04

**Signature:** a cross-faction family becomes a political target in a continuing
war. Magic, technology and varied bodies coexist, but this pass verified no single
worldwide power formula. A supply-and-asylum law is a proposal, not discovered canon.

**Bound/entry:** original first collection, #1-6, or another named volume; not
the whole series described as finished. Start before the flight, on a transit
route, or in a later separately sourced refugee era.

**Natural course:** opposing authorities pursue the family and war continues.
Proposed clock: patrols, borders and safe passage, not automatic forced contact
with the leads. Failure to intervene can affect a local shelter while canon moves on.

**Life/range:** translator, medic, transport crew, refugee neighbour or fixer;
adult, violent and intimate. Ordinary bodies through military magic/technology;
top abilities need scenes. Default: transit district. Dial: persecution and body
differences. Reasonably: retain its social distinction; U remains conditional.

### K2W05: Locke & Key, S05

**Signature:** custody of discrete keys grants different transformations/access;
the comic's Riffel Rule obstructs adult perception of key magic. Owning a key,
knowing its function and remembering an event are separate states.

**Bound/entry:** six original arcs from Welcome to Lovecraft through Alpha &
Omega; a first slice can use Welcome to Lovecraft alone. Before the move, early
key discovery, or a later crisis. Screen keys and crossover rules stay outside.

**Natural course:** an adversary seeks access to dangerous keys and doors.
Proposed clock: custody changes, manipulation and entry attempts; no automatic
grant of every key. Uncertainty after later house events is not silently resolved.

**Life/range:** schoolmate, locksmith, neighbour, caregiver or investigator;
family horror. Human bodies with powerful object-specific effects; scope is key
dependent. Default: small set of actual keys. Dial: age, custody, recognition.
Reasonably: a status window cannot bypass memory loss unless it has that authority.

### K2W06: Paper Girls, S06

**Signature:** time travellers disagree over permitted changes; a faction repairs
altered timelines and cannot visit its own future according to the inspected stub.
These are asymmetric constraints, not a generic rewind button.

**Bound/entry:** original #1-30, exclude TV. November 1, 1988 delivery route,
time-war interruption, or a visited era; the era must belong to the selected arc.

**Natural course:** the time conflict displaces civilians and enforcers restore
changes. Proposed clock: a repair crew erases traces/access after a disturbance.
Who retains which memories needs scene verification before implementing that clock.

**Life/range:** delivery peer, shop worker, witness, field medic or repair crew;
teen adventure with frightening futures. Human vulnerability plus potent time
equipment. Default: one displacement chain. Dial: enforcement and retained
knowledge. Reasonably: retain source identities across dates without merging selves.

### K2W07: Y: The Last Man, S07

**Signature:** a sudden catastrophe removes almost all male mammals, including
the human population described by the source, leaving an enormous reproductive
and infrastructure shock. This is a population law, not a buff for one protagonist.

**Bound/entry:** original #1-60, exclude television. Immediately after the event,
a later rebuilding community, or a named research/transport phase. A pre-event
start requires a candid source-compatible survival or mortality decision.

**Natural course:** transport, services and institutions fail or reorganise,
while survivors pursue answers. Proposed clocks: named facility continuity and
research access, not an invented universal countdown to extinction.

**Life/range:** surviving electrician, farmer, logistics organiser, scientist or
political worker; adult social survival. Mostly human ceiling. Default: ordinary
survivor. Dial: date, institution and supply resilience. Reasonably: gender identity
and the source's biological event predicate need separate authoring; an additional
immune visitor changes the premise and must be labelled AU.

### K2W08: Black Science, S08

**Signature:** a damaged reality-travel project strands a group among worlds;
travel depends on machinery and conditions, not selecting a destination from a
safe menu. The exact jump countdown is not confirmed by the series synopsis.

**Bound/entry:** original #1-43, first slice #1-6. Before the accident, first
stranding, or a later named expedition stage, without importing later mechanisms.

**Natural course:** the team moves through hostile realities and attempts to get
home. Proposed clock: a source-confirmed departure window leaves unfinished local
projects and people behind. Exact trigger and return rules remain open.

**Life/range:** technician, medic, scout, local host or salvage worker; adult
body horror and desperate science adventure. Frail travellers versus vastly
stronger local threats. Default: one machine-linked route. Dial: destination
control, repair and return access. Reasonably: visited places retain consequences;
a departure does not prove those worlds cease to exist.

### K2W09: The Sandman, S09

**Signature:** cosmic beings embody functions and duties, not interchangeable
high-level combat builds; dream domains and their holders have distinct authority.
Exact obligations, hospitality and succession rules need original scenes.

**Bound/entry:** original #1-75; a first arc can freeze #1-8. Captivity-era waking
world, reconstruction of the Dreaming, or a named later arc. Overture, Lucifer,
television and other Sandman Universe lines are separate manifests.

**Natural course:** failures of a cosmic office have waking/dream consequences;
the holder and other actors seek to repair them. Proposed clock: local disturbance
and restitution, keeping the canonical holder's actions active if unimpeded.

**Life/range:** dreamer, librarian, caretaker, occult investigator or emissary;
literary horror and myth. Ordinary witnesses locally, conceptual/cosmic authority
at the top. Default: a human-facing case. Dial: domain access and obligations.
Reasonably: levelling a mortal does not automatically purchase an Endless office.

### K2W10: Fables, S10

**Signature:** folklore people live as refugees; their renown among ordinary
readers is linked to longevity/survival. Being known, being respected and being
physically strong are different axes. No exact linear popularity multiplier was read.

**Bound/entry:** first arc #1-5 for a slice; original #1-150 for a larger snapshot.
Later #151-162 and spin-offs exist, so #150 is not the edge of all Fables canon.
Entry: hidden enclave, threatened homeland or a separately sourced later settlement.

**Natural course:** exile, concealment and hostile expansion continue. Proposed
clock: exposure and faction preparations. An unknown person can sustain a household
or trade route without replacing the key folklore figures.

**Life/range:** clerk, farm resident, translator, courier or craftsman; adult noir
and fairy-tale violence. Everyday bodies through powerful legendary exceptions.
Default: local enclave. Dial: public familiarity and discovery. Reasonably:
separate audience memory from hero rankings and social reputation.

### K2W11: Astro City, S11

**Signature:** ordinary people's work and testimony matter amid heroes. This is
a perspective, not by itself a unique physics law. A specific case might make
identity knowledge, memory or an unusual city service the actual signature.

**Bound/entry:** original Life in the Big City collection and its issue manifest,
not all publisher runs. First day as a reporter, arrival in a neighbourhood, or
a named historical crisis are proposed entries, each requiring the proper story.

**Natural course:** heroes, criminals and employers pursue their lives. A named
case must supply the terrible outcome/clock; the checked synopsis does not establish
a universal catastrophe. Do not make the unchosen resident the secret saviour.

**Life/range:** reporter, concierge, transit worker, shopkeeper or neighbour;
humane super-city life, sometimes dark. Civilian means locally, broad superhero
ceiling outside. Default: local case. Dial: exposure and hero contact. Reasonably:
retain N/U as conditional rather than advertise a proven distinct world law.

### K2W12: Order of the Stick, S12, rules-aware

**Signature:** characters discuss and exploit D&D-derived rules as facts of
life. Strip 1's edition change alters abilities and equipment in front of them.
This is rule literacy plus patch consequences, not creator omnipotence.

**Bound/entry:** Dungeon Crawlin' Fools, strips #1-121, then explicit dependencies
for later gate-era threats. Early dungeon, threatened city in a later sourced arc,
or aftermath. The continuing series is not claimed complete.

**Natural course:** hostile actors pursue gates that contain a world-ending
threat; local enemies act independently. First-slice clock: dungeon access and
danger; the larger gate clock needs its later source manifest.

**Life/range:** hired adventurer, goblin resident, quartermaster, temple worker
or rules tutor; comedy capable of serious loss. Low-level play locally, epic and
divine exceptions above. Default: known local rulebook. Dial: literacy and rule
version. Reasonably: knowledge predicts legal outcomes; it does not waive costs.

### K2W13: Erfworld, S13, rules-aware

**Signature:** strategy-game-like physics is lived reality; an outsider's
calculation and unfamiliar questions become military advantages. Turn, movement,
upkeep and command mechanics are source questions for a deeper audit, not all
confirmed by the inspected overview.

**Bound/entry:** Book 1, The Battle for Gobwin Knob, including its final published
episode, not later books or a fabricated finale. Before the siege, under siege,
or its actual aftermath. Record exact episode manifest when selected.

**Natural course:** a coalition attacks the last defended city; the summoned
warlord is part of canon's course. Proposed clock: siege phases under audited
side-turn rules. Refusing to help does not automatically erase that warlord.

**Life/range:** unit, caster's assistant, scout, quartermaster or resident;
bright absurdity with ruthless war. Individual units through exceptional
artifacts/caster interactions. Default: one side and siege. Dial: lawful sight,
command and calculation. Reasonably: calculator advantage informs choices without
granting unlimited orders. Source cancellation is not the world's death.

### K2W14: Homestuck, S14, rules-aware

**Signature:** client/server software acts on real homes; inventory data
structures constrain object handling; a session can be scratched to change its
starting conditions. Not every person has the same interface or access radius.

**Bound/entry:** original 8,129-page story, excluding Epilogues and later works;
a first slice uses Act 1 with a recorded page manifest. Before entry, early
session, or a post-scratch session requires different identities and causal facts.

**Natural course:** game entry accompanies catastrophe and session obligations.
Proposed clock: entry preparation and later session hazards; both causes and
time-travel dependencies must be scene-audited, not a single linear doom timer.

**Life/range:** carapacian resident, exile, helper or client/server operator if
actually eligible; internet comedy, horror and cosmic tragedy. Ordinary objects
through universe-creation and narrative-scale exceptions. Default: one local
session subsystem. Dial: client/server permissions and temporal literacy.
Reasonably: foreground instructions, character powers and authorial power remain
different. See rules-aware matrix below.

### K2W15: Girl Genius, S15

**Signature:** Spark inventors make extraordinary intuitive leaps and inspire
followers, while ordinary engineers can be competent without that source.
Knowledge, workshop resources, invention and social influence interact.

**Bound/entry:** first numbered volume Agatha Heterodyne and the Beetleburg Clank,
with comic dates recorded before selection. Before local discovery, fleeing a
regime, or a later named workshop era needs that era's volumes, not the full archive.

**Natural course:** rival powers seek exceptional inventors and machines; their
projects proceed. Proposed clock: a local takeover/project deadline, verified
against selected scenes before gameplay.

**Life/range:** machinist, medic, courier, household worker or construct;
gaslamp adventure and dark comedy. Maintenance tools locally, major war machines
and exceptional Sparks above. Default: useful non-Spark workshop. Dial: born
source, materials, focus and influence. Reasonably: ordinary skill remains useful
without claiming it automatically generates Spark or a numeric status window.

### K2W16: Gunnerkrigg Court, S16

**Signature:** etheric abilities reveal and affect a layer that ordinary
instruments fail to explain. Belief-based creation is attributed in the inspected
wiki to a character's theory, with contrary memories also described.

**Bound/entry:** chapters 1-5 for a small school snapshot, with exact page IDs
to record; later Court/forest changes need later manifests. New pupil, laboratory
assistant or envoy-era arrival are different social entries.

**Natural course:** school and forest interests continue, and unresolved beings
and dead souls have needs. A selected chapter must supply an actual dangerous
course; general tension is not a verified countdown.

**Life/range:** student, technician, apprentice guide, groundskeeper or robot;
quiet mystery with danger and grief. Local perception/engineering, much greater
etheric beings above. Default: school case. Dial: sensitivity and information
source. Reasonably: preserve conflicting testimony instead of canonising a theory;
no claim that pupils read numerical character sheets.

### K2W17: Bone, S17

**Signature:** a formless nightmare threat reaches the physical world through
hosts and dreams; material combat and dream access are different means.
Dream effects need scene-level boundaries, not a free shared dream menu.

**Bound/entry:** original #1-55, nine books, excluding later prose/sequels.
Arrival in the Valley, early settlement life, or the late war/dream-crisis era.

**Natural course:** hostile forces and dream intrusion threaten the Valley.
Proposed clock: village access, evacuation and nightmare spread, with the core
cast still acting. Canon is a progressing epic, not a daily status-quo strip.

**Life/range:** farmhand, trader, inn worker, courier or displaced valley resident;
warm comedy widening into dark fantasy. Ordinary tools locally, dragons and
dream-scale forces above. Default: valley life. Dial: dream contact and war stage.
Reasonably: humour does not make deaths or consequences reversible.

### K2W18: Usagi Yojimbo, S18

**Signature:** itinerant swordsmanship meets local duties and folklore; in
Yokai, spirit threats call for knowledge and specialised help, not animal-species
stat bonuses. Exact spirit counters are still a scene question.

**Bound/entry:** self-contained Yokai, 64-page edition. Before the abduction,
during the forest search, or after the raid threat; broader travel/war eras need
their own books. A period setting is not proof that history or ages never move.

**Natural course:** a kidnapped child is endangered and spirits assemble to raid
the countryside, explicitly in publisher text. Proposed clocks: search and warning
routes, with Usagi and the demon queller still acting unless disturbed.

**Life/range:** innkeeper, farmer, ferryman, artisan or messenger; humane historical
adventure with deadly violence. Human-scale martial means and selected supernatural
exceptions. Default: local rescue. Dial: duties, folklore knowledge and travel.
Reasonably: U stays conditional until an actual counter/jurisdiction rule is audited.

### K2W19: Calvin and Hobbes, S19

**Signature:** imaginative experience and ordinary observers' experience coexist;
Calvinball changes its rules during play. The wiki's reported anti-repetition
rule belongs to that game, not a universal limit on player actions.

**Bound/entry:** a dated strip sequence or season from the 1985-1995 corpus,
not a chronological ageing campaign. Enter a school day, summer play or winter
outing. Choose exact dates before adapting particular imagined devices.

**Natural course:** homework, parents, weather and friends continue. There is no
verified canon apocalypse if the visitor does nothing. Lost play time or a broken
promise is a proposed local consequence and only a weak version of target test N.

**Life/range:** classmate, neighbour, babysitter or play partner; funny, reflective,
occasionally sad. Ordinary children in the outside layer; extravagant imagined
feats in the inside layer. Default: preserve ambiguity. Dial: imagination's causal
reach. Reasonably: material transformations require explicit AU rules rather than
silently declaring a cardboard box a genuine time machine.

### K2W20: My Hero Academia, S20

**Signature:** widespread personal Quirks have bodily conditions; lawful heroic
use is an institutional career. A transferable legacy or acquired extra power is
an exception with a source, not ordinary training progression.

**Bound/entry:** main manga through final volume 42; first school/rescue slice
uses early volumes only. Pre-enrolment, public-safety crisis or reconstruction,
each with its own roster and laws. Exclude spin-offs/films unless selected.

**Natural course:** villain organisations act and public confidence/institutions
change through the canon conflicts. Proposed clock: a particular rescue or civic
breakdown. Licence eligibility does not guarantee survival or the lead's power.

**Life/range:** support engineer, dispatcher, doctor, shopkeeper, student or
licensed rescuer; hopeful coming-of-age with severe violence later. Ordinary
Quirks locally, exceptional wide-scale powers above. Default: one body plus
training/support. Dial: origin, licence and legal use. Reasonably: power acquisition,
competence, popularity and authority need separate records.

### K2W21: One-Punch Man, S21

**Signature:** C/B/A/S membership and individual rank measure an organisation's
judgment; overwhelming actual strength can be badly recognised. The limiter
explanation is a named scientist's theory, not an audited universal growth recipe.

**Bound/entry:** choose ONE's webcomic or a dated Murata manga collected edition;
default first slice: manga volumes 1-3, freeze print version, exclude anime and
later redraw substitutions. Before registration, early hero work, or a later
monster crisis requires different source ranges.

**Natural course:** monster attacks continue while organisations and heroes
respond. Proposed clock: warning, evacuation and arrival, with the anomalous hero
still existing. He need not arrive at every local incident or become player power.

**Life/range:** low-ranked hero, evacuee organiser, mechanic, journalist or shelter
worker; absurd comedy and extreme destruction. Fragile locals through intentionally
overwhelming exceptions. Default: ordinary career. Dial: recognition and threat
distance. Reasonably: rank is not an enemy scaling value or an attainable damage cap.

### K2W22: The Incal, S22, added

**Signature:** custody of a mystical artifact makes a low-status detective central
to a cosmic struggle. That source-specific authority is distinct from wealth or
training, but its exact executable law remains C at synopsis depth.

**Bound/entry:** six original Moebius/Jodorowsky albums; exclude Before, unfinished
After and Final Incal. City life before discovery, the pursuit, or a named cosmic
journey stage. Do not merge incompatible sequel treatments.

**Natural course:** factions seek the artifact and a cosmic conflict unfolds.
Proposed clock: pursuit and custody at a local site; primary scenes must identify
the larger failure route rather than importing Final Incal's different threat.

**Life/range:** investigator, technician, transport worker, cult attendant or
city resident; adult surreal satire. Street-level people below cosmic artifact
effects. Default: one custody case. Dial: artifact authority and symbolism's
causal reach. Reasonably: not every symbol or spiritual experience is a usable spell.

### K2W23: Valerian & Laureline, S23, added

**Signature:** agents travel into a damaged past to preserve a future polity;
temporal intervention can concern the existence of their employer. This differs
from a personal checkpoint loop.

**Bound/entry:** The City of Shifting Waters, specify Cinebook 2010 48-page edition
or the longer collected version explicitly. 28th-century assignment, ruined 1986
New York, or its immediate aftermath. Later albums and film are separate.

**Natural course:** ocean encroachment and a rogue traveller threaten the future;
both are STATED by the publisher. Proposed clock: route loss and interception,
without treating this fictional 1986 as actual present-day history.

**Life/range:** displaced resident, technician, boat operator, archive worker or
agency support; satirical science-fiction adventure. Vulnerable bodies plus powerful
transport. Default: one past/future pair. Dial: intervention and future dependencies.
Reasonably: audit overwrite/branch law before using it; preservation premise alone
does not establish the exact time algorithm.

### K2W24: The Wicked + The Divine, S24, added

**Signature:** the public premise gives a ninety-year cycle of twelve human
incarnations facing a two-year death horizon. The inspected wiki reports later
revelations that challenge its supposed necessity and explanation. A proclaimed
law can organise society while its cause remains investigable.

**Bound/entry:** original #1-45; separate historical specials. Before the current
incarnations, during celebrity ascent, or near the advertised deadline.

**Natural course:** public attention, faction actions and deaths develop around
the cycle. Proposed clock: dated risks and investigations, not forced execution
of a known false explanation. State and belief must remain separate.

**Life/range:** journalist, sound engineer, fan organiser, stage worker or
investigator; adult pop glamour and violence. Ordinary people through explosive
incarnate powers. Default: mortal observer. Dial: publicity and claimed deadline.
Reasonably: a deadline lens shows its source/confidence and can be revised by evidence.

### K2W25: Chew, S25, added

**Signature:** consuming a sample yields impressions of its history. Information
has a physical acquisition route and unpleasant costs; a detached tooltip cannot
claim the same knowledge for free.

**Bound/entry:** original #1-60; first slice #1-5. Before government recruitment,
early investigations, or later crisis requires the right issues. Later Chu and
crossovers are outside the default manifest.

**Natural course:** criminals, institutions and other actors continue while clues
are concealed or lost. Proposed clock: a named case's evidence custody and next
victim. The publisher synopsis supports cases and state pressure, not every finale.

**Life/range:** evidence custodian, cook, agent, analyst or witness; adult grotesque
crime comedy. Human-scale work with diverse food-linked exceptions. Default: one
eating-based observer. Dial: sample access, amount and safe handling. Reasonably:
each observation records sample and time; old impressions do not track later events.

## Rules-aware worlds: literacy, sight and authority

**K2RA1:** knowing a rule, observing a value and being allowed to alter it are
three capabilities. A fourth-wall joke proves none of the other two. Fit these
proposals to [world-relative standing WR1-WR8](../../../CHEAT_LIBRARY.md#more-to-consider-what-counts-as-a-cheat-the-library-tab-and-more-types-2026-10-13)
and [truth/knowledge/display OV1-OV6](../../../CHEAT_LIBRARY.md#more-to-consider-cheats-that-show-things-the-overarching-model-and-implementation-2026-10-14).
No new universal observer engine is proposed before a second real user needs it.

| Code | Source-backed difference | How it changes decisions, INFERRED | Status-window fit, INFERRED | Fourth-wall fit, INFERRED |
|---|---|---|---|---|
| K2RA2 OotS | Strip 1's transcript has characters identify a rule edition and its effects; classes/skills are named in-world | A rules tutor can warn about prerequisites or an obsolete tactic. A rule-version change can invalidate an expectation while leaving a life history intact. | Known self rules can be baseline. Universal remote enemy sheets are not established. A concealed-build lens is beyond baseline if it supplies otherwise unavailable facts. Show version and observed/estimated values. | A caption can joke about an edition. Editing it does not change the edition unless an actual power says so. Rule-change receipts should identify real changed capabilities. |
| K2RA3 Erfworld | The overview distinguishes strategy literacy and an outsider calculator from local game-like physics | Knowing public mechanics helps timing and resource plans; superior calculation can change a choice without changing the rules. A lawful unit order still needs actual command. | Unit/commander inspection rights need primary scenes. Display observed movement/upkeep fields only after those rights are confirmed. Numbers do not confer ownership of the unit. Calculator output is a forecast with assumptions. | A turn indicator represents a real scheduler boundary; freezing its animation cannot stop the opponent's turn. Off-turn orders, view and attacks require separate permissions. |
| K2RA4 Homestuck | Sburb's server manipulates a client's surroundings within limits; Sylladex constrains retrieval; Scratch changes starting conditions; an author-avatar appears | A stronger friend may still be unable to retrieve an item or see beyond a server radius. Server support, local movement and timeline knowledge offer distinct roles. | Client, server, exile and other actors get different views. Sylladex is an operative inventory interface for holders, not a cheat for everyone. Remote editing must name target, authority, cost and causal result. | Commands, pesterlogs and author-avatar appearances can be presentation or real permissions, depending on the scene. An avatar's existence does not make every reader an omnipotent creator. Scratch is not ordinary reload. |

**K2RA5:** Girl Genius and Gunnerkrigg are system-rich, but no inspected source
establishes universal stat sheets or D&D-like self-awareness. Keep them separate
from the three above. A Spark blueprint or etheric observation can feed a lens;
that does not turn their whole society into a numerical system world.

**K2RA6:** desktop/laptop first if any of this is later built: a readable rule or
observation pane beside actions at 1366×768 is an illustrative target, not a UI
acceptance result. Quiet baseline; extraordinary screen effects only over actual
state changes, following [presentation authority](../../../PRESENTATION_AND_FOURTH_WALL.md#powers-that-touch-the-ui).
Mobile work remains deferred. No browser evidence is claimed by this docs lane.

## Root rows: confirmed, corrected and still unverified

| Root row | Result | Both sides of the evidence | Default + Dial + Reasonably, INFERRED |
|---|---|---|---|
| CW4 | **CONFIRMED, narrowed** | Asterix's potion and exception holder are STATED, S01. Thorgal combines myth/science origins, S02; Incal artifact and Valerian time travel add distinct references, S22-S23. Album tradition alone does not establish long elapsed in-world eras. | Default: one album/rule set. Dial: source edge and era. Reasonably: album numbers are publication order, not a reliable age clock. |
| CW5 | **CONFIRMED with limits** | Judicial monopoly is STATED by S03 wiki; real-time calendar is STATED by overview. Physical rejuvenation/health details are not audited. 2000 AD contains separate properties. | Default: historical case date. Dial: calendar ageing and medical means independently. Reasonably: no universal anthology calendar or offline ageing inference. |
| CW6 | **CORRECTED** | Paper Girls and selected original ranges have finite source edges. Saga's checked source supports an ongoing-world bounded arc, not a finished whole. Fables #162 shows continuation beyond #150. Sandman's original #1-75 is bounded, but expanded books exist. The row's ownership category is not verified for every listed property. | Default: named core run/arc. Dial: later continuation as a separate snapshot. Reasonably: a finite range is neither complete universe canon nor proof of creator ownership. |
| CW7 | **PARTLY CONFIRMED, CORRECTED** | OotS's rule talk, Erfworld's game-like world, Homestuck's actual interfaces are supported, S12-S14. Spark/ether rules are supported, S15-S16. Universal self-stat reading across all five is not. | Default: source-specific literacy/view. Dial: disclosure and edit authority separately. Reasonably: a game substrate is not a permission grant. |
| CW8 | **CORRECTED** | Calvin's fixed child age and imagination are supported, S19. Bone is a 55-issue progressing fantasy with a completed core; Usagi's ongoing travel and Yokai's threat are different shapes, S17-S18. Peanuts was not surveyed in this lane and stays **UNVERIFIED**. | Default: each world's own chronology. Dial: imaginary causal reach and ageing separately. Reasonably: child-friendly art does not imply stasis, weak danger or imaginary-only powers. |
| CL2 | **CONFIRMED distinction, narrowed** | Dredd's publication-linked date differs from Calvin's age stasis. Neither alone proves a sliding-history algorithm. | Default: frozen snapshot clock. Dial: fixed-age episodes, calendar ageing or an explicitly authored sliding-history mapping. Reasonably: keep local elapsed time and age distinct; no automatic history edits. |
| CL5 | **CONFIRMED example, narrowed** | Homestuck Scratch explicitly resets a session with changed starting conditions, S14. Paper Girls has temporal restoration, S06; that is not the same reset. A publisher's new printing/numbering is not evidence of an in-world crisis. | Default: no reset unless a sourced event permits it. Dial: trigger, identities, memories, objects and protected history. Reasonably: describe each carried fact, not a global keep/loss slider alone. |
| CL14 | **CONFIRMED publication event; fictional ending CORRECTED** | Creator explicitly discontinued Erfworld and restricted the wiki, S13. No source here says publication stopping destroys the represented world. After the Incal's incomplete publication is also stated by its publisher, but is separate from the original core. | Default: coverage ends at the last sourced scene. Dial: open-ended continuation, authored closure or explicit AU terminal event. Reasonably: label invented futures; keep completed core and abandoned sequel distinct. |
| CO10 | **CONFIRMED K2 examples, original examples UNVERIFIED here** | Homestuck's author-avatar is STATED by its wiki; Fables links ordinary readership to survival; WicDiv links public attention to celebrity life. These are different mechanisms. Animal Man, She-Hulk and One-Above-All were not checked in K2. | Default: local audience or sourced avatar role. Dial: awareness, causal influence and actual edit authority. Reasonably: creator-avatar presence, popularity and omnipotence do not imply each other. |

## Build order, not access order

All twenty-five stay reachable. This ranking is INFERRED for a **small causal
slice**, using present project concepts as possible seams, not proof of existing
runtime support. Cost includes source effort, state modelling and verification.
C1 = small existing-shaped slice; C2 = local new rule; C3 = several coupled
systems; C4 = clocks/identities/domain rules; C5 = temporal or cosmic composition.
D1-D5 rate distinction from a generic combat world, not literary quality.
Low-cost entries with conditional U/N stay conditional; rank does not erase that.

| Order | World | Cost | Distinction | First useful slice and the cost that remains |
|---|---|---|---|---|
| 1 | K2W01 Asterix | C2 | D4 | Temporary power supply, one custodian and ordinary work; exact potion limits. |
| 2 | K2W25 Chew | C2 | D5 | Sample custody and one history observation; physical acquisition and evidence limits. |
| 3 | K2W12 OotS | C2 | D5 | Rule literacy changes one action choice; only a bounded represented rules subset. |
| 4 | K2W15 Girl Genius | C3 | D4 | Non-Spark maintenance versus sourced invention; maker means and workshop state. |
| 5 | K2W20 MHA | C3 | D4 | One acquired/body-native Quirk and licence distinction; source/physiology exceptions. |
| 6 | K2W10 Fables | C3 | D5 | Renown-linked survival in one enclave; exact survival evidence, not generic popularity XP. |
| 7 | K2W03 Dredd | C3 | D4 | Civilian service under a warrant/raid clock; legal authority and dated city facts. |
| 8 | K2W05 Locke & Key | C3 | D5 | Two object powers plus remembered/forgotten knowledge; custody and age compatibility. |
| 9 | K2W11 Astro City | C2 | D2 | A civilian case; low build cost but missing case-specific law/clock audit. |
| 10 | K2W18 Usagi | C2 | D3 | Warning/rescue route during Yokai; audit a distinct spirit counter before selection. |
| 11 | K2W24 WicDiv | C3 | D5 | Public deadline claim versus investigation; true causal rule must remain discovery-bound. |
| 12 | K2W17 Bone | C3 | D4 | Valley service affected by dream threat; dual-layer access needs primary rules. |
| 13 | K2W07 Y | C3 | D4 | Keep one facility/route useful after population shock; institutions and ordinary survivors. |
| 14 | K2W04 Saga | C3 | D3 | Asylum/transit choices; distinct world law still needs a stronger source case. |
| 15 | K2W02 Thorgal | C3 | D3 | Local bargain/kin obligation; actual divine conditions remain unaudited. |
| 16 | K2W16 Gunnerkrigg | C4 | D5 | Instrument/ether observations disagree; attributed theories and a selected crisis. |
| 17 | K2W19 Calvin | C3 | D5 | One play scene with observer-dependent presentation; weak N and physical ambiguity. |
| 18 | K2W06 Paper Girls | C4 | D5 | One displacement/restoration case; dated identity and memory retention. |
| 19 | K2W23 Valerian | C4 | D4 | One past/future interception; exact causal time law and edition manifest. |
| 20 | K2W22 Incal | C4 | D4 | One artifact custody case; actual authority is still a source gap. |
| 21 | K2W08 Black Science | C4 | D5 | One stranded-world departure; persistent destination and device timing. |
| 22 | K2W09 Sandman | C5 | D5 | Human case under domain duty; conceptual authority and office constraints. |
| 23 | K2W13 Erfworld | C4 | D5 | One side's siege/turn decisions; scheduler model and detailed archive audit. |
| 24 | K2W21 OPM | C4 | D4 | Rank/strength mismatch in one rescue; overwhelming fixed actors remain causal. |
| 25 | K2W14 Homestuck | C5 | D5 | Server permissions plus inventory handling; session graphs, media and timeline identity. |

**K2BO1:** do not read CW7 as uniformly cheap because it resembles the status
window. OotS's local literacy case is relatively small; Erfworld needs a credible
side-turn model; Homestuck needs distinct server permissions and temporal identity.
Their high distinction makes them useful later tests rather than excluded worlds.

## Open source and acceptance edges

| Code | What remains | What would close it |
|---|---|---|
| K2G1 | Survey, not full-source audit | Select one card, record exact editions/issues/pages, read its signature-rule scenes and exceptions. |
| K2G2 | Restricted/thin sources | Authorized Erfworld archive reading; useful Incal primary scenes; richer Valerian material. Unknown wiki counts stay unknown. |
| K2G3 | Conditional target tests | Specific cases for Astro City/Gunnerkrigg/Thorgal; distinct laws for Saga/Usagi/Incal. Calvin's N stays weak unless a lighter local-stakes target is deliberately accepted. |
| K2G4 | Proposed abstractions | Show one legal and one blocked action under the actual rule; compare ordinary literacy with extra sight and edit permission. No abstraction is implemented by this document. |
| K2G5 | Later gameplay proof | Only after authorised implementation: rebuild, fresh desktop-origin play, intervene/abstain comparison and relevant save/reload/import checks. Current lane has no playable acceptance result. |
