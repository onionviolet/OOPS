# Source deep dive queue (2026-10-24, proposal)

Harvest authorized 2026-10-25: reuse held/read sources, fill missing books and
chapters, include traditional novels and retain all fitting candidates. The
[harvest receipt](SOURCE_HARVEST_2026-10-25.md) owns actual collection, reuse,
alias corrections and remaining gaps. Native Z-Library delivered thirty verified
files despite desktop API failure. The latest retry acquired Millennial Mage 1–2,
Industrial Strength Magic, Heretical Fishing, Bog Standard: Scarred, a bounded
Gamer's Guide Step 1 snapshot and Bookworm's remaining Part 4 gaps. Bookworm
holds 22/33 main volumes; Part 5 Volumes 2–12 remain open. The account reached its
explicit daily download limit; P5V2 is recorded as quota-stopped before delivery.
Remaining gaps and completed hashes are preserved in the receipt's private owners.
The receipt links the private reuse index and next gaps. Setup/extraction,
research and gameplay are separate.

Owner for the one-world-at-a-time source-deep-dive sequence Weibao started on 2026-10-24
([USER_VISION](../USER_VISION.md#source-deep-dives-one-world-at-a-time-2026-10-24)). Each run follows
the [playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md) and saves a world card under
[cards](../worlds/world-core-kit-2026-10-14/cards/README.md). Rows here are proposals; the queue
order is a default Weibao can change. Rules: WPR1-WPR32, AU1-AU15, AD5, AD35, AD37, AD38.

## Status

| World | State | Card |
|---|---|---|
| Re:Zero | done 2026-10-24 (Arcs 2-4 full read this round; Arcs 1, 5-10 from round 1) | [re-zero](../worlds/world-core-kit-2026-10-14/cards/re-zero.md) |
| Tensura (Slime) | done 2026-10-24 (re-synthesis of the 2026-10-10 full JA WN read) | [tensura](../worlds/world-core-kit-2026-10-14/cards/tensura.md) |
| Worm | done 2026-10-24 (re-synthesis of the 2026-10-04 full read) | [worm](../worlds/world-core-kit-2026-10-14/cards/worm.md) |
| The Perfect Run | done 2026-10-25 (full read, 481,607 words) | [perfect-run](../worlds/world-core-kit-2026-10-14/cards/perfect-run.md) |
| Super Supportive | done 2026-10-25 through chapter 312 (Weibao: "Run both in parallel accordingly", "download super supportive accordingly?"; paced Claude in Chrome capture, 1,506,547 words) | [super-supportive](../worlds/world-core-kit-2026-10-14/cards/super-supportive.md) |
| You Are Summoned | done 2026-10-25, Books 1-5 (Weibao: "Run You Are Summoned 1-5 next, same method, with a focus on entry, return and carryover"; 657,439 words) | [you-are-summoned](../worlds/world-core-kit-2026-10-14/cards/you-are-summoned.md) |
| Wish Upon the Stars | research complete 2026-10-25 through held Books 1-8, 527 story chapters / 1,052,746 words; Books 1-4 matching prior receipts, Books 5-8 new reading; response-cap breach and repairs disclosed in card | [wish-upon-the-stars](../worlds/world-core-kit-2026-10-14/cards/wish-upon-the-stars.md) |
| Godclads | done 2026-10-25, B3 (Calibre 76–77 full read; 458,756 words including glossaries/backmatter; usage caveats in card) | [godclads](../worlds/world-core-kit-2026-10-14/cards/godclads.md) |
| No Game No Life | on hold: only Vol 4 held (Calibre 231); Weibao is deciding on more volumes | none |

C5 reconciliation, 2026-10-25: the Status table above owns current held-edition research completion. The Round 1 holdings, prior-work cells, proposed order and QL1–QL4 below preserve October 24 planning history; they do not queue completed reads again. B2/B3 cards distinguish reused receipts from new reading and retain response-limit caveats. Their research completion does not select world implementation, publication or app adoption. You Are Summoned’s Claude-owned completion row is not evidence of a completed A3 read; A3 stopped for the ownership conflict.

## Round 1: hero works and more to consider (2026-10-24)

Weibao: "consider somethign like the perfect run and other hero works and more? Super suportive
on RR? You have been summoned? more to conider?"

### Candidates and holdings (checked 2026-10-24)

"You have been summoned" read as Dean Henegar's *You Are Summoned* (Aethon), the held series
whose title matches; say so if another work was meant. Word counts are approximate.

| ID | Work | Why it fits YAIRPG | Held? | Size | Prior work |
|---|---|---|---|---|---|
| HQ1 | **The Perfect Run** (Maxime J. Durand, RR 36735, complete) plus *Bad Runs* (RR 50539, 3 what-ifs) | Player-chosen save-point looper in a superhero city (New Rome), with corporations, heroes, criminals and monsters as routes; a third loop shape beside Re:Zero and Mother of Learning | yes: all 130 story chapters and 3 what-ifs captured 2026-10-11, indexed in `novels/perfect-run/source-preparation-2026-10-11/` (private) | about 600-740k words | world-design packet 2026-10-11 (bounded reading only); [RESEARCH_IDLE_GAMES](../RESEARCH_IDLE_GAMES.md) row 27; [CHEATS_BY_WORLD](../CHEATS_BY_WORLD.md) row 141 |
| HQ2 | **You Are Summoned** 1-5 (Dean Henegar) | An ordinary office worker summoned as a minion to a different world per job, returning to Earth with rewards; later books bring mana to Earth. Closest outside match to YAIRPG's own multi-world, carry-home structure | yes: Calibre 48-53; Book 6 published, not held | about 655k words (5 books) | none |
| HQ3 | **Super Supportive** (Sleyca, RR 63759, ongoing) | Weibao's listed top favorite; an alien "Interdimensional Warrior's Contract" grants powers to a tiny fraction of Earth; a support-hero career and slow daily-life growth | no: only chapters 2, 3, 9, 24 and 32 read live earlier | ongoing, large | [SKILLS_AND_TALENTS](../SKILLS_AND_TALENTS.md) pick 3, L8, L12; [RESEARCH_LITRPG_SYSTEMS](../RESEARCH_LITRPG_SYSTEMS.md) |
| HQ4 | **Wish Upon the Stars** 1-8 (Malcolm Tent) | Superhero cultivation LitRPG: powers and cultivation in one world | yes: Calibre 54, 59-65 | about 1.07M words | none |
| HQ5 | **Godclads** 1-2 (OstensibleMammal) | Power with costs and vents, threat ratings; ranked first in an earlier deep-read list | yes: Calibre 76-77 | about 460k words | [SKILLS_AND_TALENTS](../SKILLS_AND_TALENTS.md) pick 1 |
| HQ6 | **Ward** (Wildbow, Worm sequel) | Post-Gold Morning hero society across Earths; settlement-era lives | no: Bookracy candidate `d2ff0298` | large | Worm card G1 |
| HQ7 | **Super Powereds** and **Villains' Code** (Drew Hayes) | Hero-school and villain-guild lives; a forum thread suggests the first after Worm; the second is MEMORY only | no | unknown | Bay City in [WORLD_CARDS](../WORLD_CARDS.md) names Super Powereds |
| HQ8 | Mutants and Masterminds 4E playtest handbook | Rules reference for power points and ratings, not a world | yes: Downloads PDF | n/a | comics lane K4 `gm/dispatch/comics-2026-10-14/SUPERHERO_GAME_RULES.md` |

Route notes: Royal Road refused the in-app browser this session; the earlier Perfect Run
capture used a paced browser route. A Super Supportive read needs that paced route, Claude in
Chrome or another permitted copy, plus Weibao's yes for the bulk pull. Buying Book 6 or Ward
needs his yes.

### More to consider

| Code | Finding | Evidence | Disposition |
|---|---|---|---|
| HW1 | Hero worlds share an authority-reading layer: PRT ratings (Worm), Avowed classes and ranks (Super Supportive), threat ratings (Godclads), registries in other hero cities. They are readings an institution files about you, which can be wrong | Worm card W12; SKILLS_AND_TALENTS L12 | ACCOUNT FOR NOW: reuse one rating-as-dated-reading seam; do not build a per-world rank ladder |
| HW2 | Three loop shapes now sit in the queue: imposed death-checkpoint (Re:Zero), player-chosen save (Perfect Run), time-loop with a fixed span (Mother of Learning). A bystander's view differs by shape: who chooses the reset, who notices, what leaks | Re:Zero card section 3; CHEAT_COSMOLOGY checkpoint row | ACCOUNT FOR NOW: keep loop owner, trigger, checkpoint choice and leak channels as separate fields |
| HW3 | *You Are Summoned* models per-job summoning to other worlds with a return home and carried rewards, which is YAIRPG's own shape seen from inside one character | Aethon synopsis (search) | LATER: read it as a structural reference for entry, return and carryover, not as a world pack |
| HW4 | Power from an outside contract recurs: Super Supportive's contract, Worm's shards, Wish Upon the Stars' wishes, Re:Zero's spirit contracts with belief-judged breach. Who the counterparty is and what it wants decides limits | Re:Zero R30; Worm W2; RESEARCH_LITRPG_SYSTEMS L8 | ACCOUNT FOR NOW: model the counterparty and terms, not just the granted power |
| HW5 | Support careers can complete missions: healing, protection, coordination, evacuation. Super Supportive centers this, and it fits a Weibao-sized life better than front-line power | RESEARCH_GENRE_SWEEP PF15 | ACCOUNT FOR NOW: support outcomes count as mission success in hero worlds |
| HW6 | In hero worlds most people are unpowered (Worm's bystanders, the tiny fraction offered Super Supportive's contract). Power prevalence is a world dial with an in-world reason, and ordinary lives are the default start | Worm card section 1; READ_HISTORY_AUDIT row for Super Supportive | ACCOUNT FOR NOW |
| HW7 | Tone differs sharply: Perfect Run is comic, Worm is grim, Super Supportive is slow and warm. Tone is a world dial that shapes event text, not mechanics | search reader comments | ACCOUNT FOR NOW |
| HW8 | Many hero worlds at once is Weibao's direction; the practical risk is sequencing. Five held candidates total about 3.5M words | sizes above | ACCOUNT FOR NOW: one world per run, held sources first |
| HW9 | Tabletop superhero rules (M&M held, comics lane K4 done) already turn comic laws into numbers and can calibrate ratings and costs | COMIC_WORLDS CW9, K4 | LATER |

### Proposed queue order (default; Weibao can reorder)

1. HQ1 The Perfect Run: fully held, complete, never fully read; a full-read round like Re:Zero's.
2. HQ2 You Are Summoned 1-5: held; structural reference for YAIRPG's own loop.
3. HQ3 Super Supportive: the favorite; first needs a permitted reading route and his yes.
4. HQ4 Wish Upon the Stars 1-8 and HQ5 Godclads 1-2: held.
5. HQ6 Ward, HQ7 Drew Hayes: not held; acquisition decisions.

### LATER / DELEGATE

| ID | Item | Level | Effort | Done check |
|---|---|---|---|---|
| QL1 | Perfect Run full-read round (haiku readers over the prepared chapters, sonnet integrators) | research | large | card plus private synthesis, as for Re:Zero |
| QL2 | You Are Summoned round focused on entry, return and carryover | research | medium | card plus a structural note for the entry owners |
| QL3 | Decide the Super Supportive reading route and authorize the pull | decision | small | Weibao's reply logged |
| QL4 | Wish Upon the Stars and Godclads rounds | research | large | cards |
| QL5 | Ward, Book 6, Drew Hayes acquisition check | decision | small | holdings receipt rows |

## Held-book absorption candidates, 2026-10-25

Request: “more book absorbtions? we have our stuff from zlib”. Mode: reuse and check,
metadata discovery and proposed absorption targets. Rules: WPR1–5/7–8, AD32/35/36/38,
WA8/12. One coordinator, no readers or new acquisitions. Stop at a held-source
shortlist; this round does not claim a source read or select runtime work.

ACT NOW (done): checked the live Source Library local catalogue with nine title
queries. All rows below returned owned assets. Reused the acquisition
[wave](ZLIBRARY_YAIR_ACQUISITION_WAVE_2026-10-21.md), newer
[receipt](BOOK_ACQUISITION_RECEIPT_2026-10-24.md), and this queue's current Status
table. Earlier hero-source planning rows do not queue completed reads again.
Catalogue metadata verifies holdings, not the contents or completeness of an edition.

These priorities are coordinator proposals for useful questions, not a ranking of
source quality or newly verified canon. Reuse earlier research for each question
before opening source text. A full-read completion claim needs its own receipts.

| ID | Held source | Proposed question / playable target | Scope qualification |
|---|---|---|---|
| BA1 | Soulhome, Weirkey Book 1 | Material choice and spatial construction inside a progression structure; a build whose arrangement changes an actual capability | Book 1 held; exact mechanism needs source locators |
| BA2 | Ascendance of a Bookworm | Make an invention pass through materials, labour, teaching, finance and institutional access; one usable production chain | Live catalogue includes Parts 1–3 and selected later volumes, not the complete series |
| BA3 | Sufficiently Advanced Magic, Arcane Ascension Book 1 | Enchanting as a learned technical practice; one device with a legible resource path and failure condition | Book 1 held; compare native crafting before proposing another framework |
| BA4 | Spice & Wolf omnibus | A merchant journey where transport, price information, credit and counterparties change the deal | Acquisition receipt identifies Vols 1–17; verify internal coverage before a whole-run read |
| BA5 | All the Skills, Book 1 | Card acquisition, combinations and the distinction between owning a power and developing its use | Earlier read-history audit had synopsis-level evidence, not chapter text; held EPUB permits a new source pass |
| BA6 | Cradle, Foundation collection plus Books 4–10 | Revisit training, advancement and crafted power with the expanded held coverage | Compare existing cultivation work; new books do not establish new mechanics by themselves |
| BA7 | The Craft Sequence, five-book collection | Contracts, obligations and magical services as working infrastructure | Five named books held, not a whole-franchise claim |
| BA8 | Log Horizon Vols 1, 2 and 5 | Crafting, parties and guild services in a world lived in beyond combat | Vols 3–4 not returned; preserve the coverage gap |
| BA9 | Into the Labyrinth, Mage Errant Book 1 | Affinity-specific learning, mentors and practical limits in ordinary spell use | Book 1 held; source-check proposed interactions |

ACCOUNT FOR NOW: map each source-qualified mechanism to an existing owner in
[SYSTEMS_REGISTER](../SYSTEMS_REGISTER.md) and reconcile the existing
[all-source implementation](../gm/dispatch/reference-mechanics-2026-10-25/CHECKPOINT.md)
before calling it missing. Keep world-specific laws, source coverage and playable
coverage separate. Defaults, dials and costs come from mechanisms rather than
universal permission lists.

LATER / DELEGATE (not dispatched): BA1–BA9 each need a bounded source-gap pass,
then a proposed native slice. Capability: Luna low for holdings/receipt checks,
Luna medium for finite source shards under AU13–15, Sol for synthesis or design
judgment. Effort: medium per first-book pass; large for collections. Done check:
edition-qualified locators, reused-versus-new read coverage, existing-system map,
and one observable playable acceptance proposal. Runtime execution retains its
separate ownership, build, browser and persistence gates.

Checks: local catalogue queries returned owned metadata for all nine rows;
no book prose was read, no gameplay files changed, and no runtime tests apply.

## Royal Road and other series scout, 2026-10-25

Request: “Sounds reasonable, find more RR books stuff accordingly, other cool
series too”. Mode: discovery, primary-description checks and prior-work reuse.
Rules: WPR1–5/7–8, WA3/8/12, AD5/32/35/38. One coordinator, no reader agents,
no acquisitions or runtime changes. Direct web research kept here because local
holdings and saved research drive the comparison. Stop at distinct source leads
with an absorption question and an access qualification. Ranking below concerns
proposed next research value for OOPS, not source quality or accepted build order.

ACT NOW (done): checked author/RR/publisher pages and thirteen local catalogue
queries (the twelve selected series plus Pale). None returned an indexed local
asset under the queried title. This is a catalogue result, not proof that a file
or private capture does not exist elsewhere. A bounded filename search also found
an earlier Pale Lights sample; Pale Lights and Wildbow's Pale are different works.
Reused the [RR atlas](royal-road-2026-10-10/TROPE_ATLAS.md),
[LitRPG research](../RESEARCH_LITRPG_SYSTEMS.md),
[western comparison](power-systems/western/REPORT.md), and
[broad scout](power-systems/broad-scout/REPORT.md). Existing title mentions and
sampled scenes do not establish a whole-source read.

The source column records STATED public premises or directly observed listing
status. Each OOPS question is PROPOSED or INFERRED, not a source-verified mechanism.

| ID | Series and primary source | Source evidence / prior work | Proposed absorption question | Route / disposition |
|---|---|---|---|---|
| RR1 | [Ar'Kendrithyst](https://www.royalroad.com/fiction/26727/arkendrithyst), Arcs | Author describes creating magic, family, a new home and large consequences; listing marked completed | Can experimentation produce a new spell whose use changes life in its settlement? | RR listing and TOC accessible; inspect capture scope before a full read. Highest-priority new deep-dive proposal |
| RR2 | [Chaotic Craftsman Worships the Cube](https://www.royalroad.com/fiction/41656/chaotic-craftsman-worships-the-cube), ProbablyATurnip | Author's premise gives Ben crafting/enchanting without the combat gifts expected of summoned heroes; existing atlas already names it | Can a crafting career answer threats through useful objects, commissions and cooperation? | RR listing marked ongoing; deepen beyond atlas tags, not a newly discovered title |
| RR3 | [Millennial Mage](https://www.royalroad.com/fiction/47826/millennial-mage), J.L. Mullins | Author describes hostile wilds, protected cities, academy debt and learning while working | What does a working mage need to earn, maintain and learn to remain effective on the road? | RR marked STUB; page says Books 1–12 moved to Kindle Unlimited, with other formats offered. Opening-volume acquisition/holdings check precedes whole-source reading |
| RR4 | [The Runesmith](https://www.royalroad.com/fiction/33844/the-runesmith), Kuropon | Author explicitly connects hardware knowledge with words of power; atlas already names crafting and social status | Can rune devices be assembled and diagnosed through a coherent technical model? | RR marked ongoing; author says no authorized Amazon/Kindle releases. Prefer author serial for provenance |
| RR5 | [Delve](https://www.royalroad.com/fiction/25225/delve), SenescentSoul | Author describes mathematically meaningful stats, support/aura specialization and resource tradeoffs. Existing LitRPG owner already has Chapter 006 aura evidence | How do range, intensity, duration and regeneration make support builds play differently? | RR marked INACTIVE. Reuse existing chapter-backed work; inspect only missing interactions before proposing more reading |
| RR6 | [Industrial Strength Magic](https://www.royalroad.com/fiction/57011/industrial-strength-magic), Macronomicon | Author's premise combines magical and supervillain family paths with a System. Earlier scout flags exact tinker scaling as unverified | Can devices bridge distinct power mechanisms with explicit inputs and maintenance? | RR marked STUB with Kindle link; deepen the earlier premise-only scout after locating an opening edition |
| RR7 | [Mana Mirror](https://www.royalroad.com/fiction/62788/mana-mirror), Tobias Begley | Author describes indebted apprenticeship, an exploitative teacher and a competing chance to choose one's path | Can teachers offer different methods, access and obligations rather than just XP multipliers? | RR marked STUB; locate a beginning edition before full reading |
| RR8 | [Bog Standard Isekai](https://www.royalroad.com/fiction/69512/bog-standard-isekai), Miles English | Author describes a child-body start, initially unavailable leveling, dangerous nights and durable local goods | What useful progress remains available while a biological or institutional gate is still closed? | RR marked STUB with early-book links; candidate for progression-gate research, not an instruction to impose its age gate elsewhere |
| RR9 | [The Wandering Inn](https://wanderinginn.com/), pirateaba | Existing LitRPG owner has bounded original-chapter evidence for ordinary work and class recognition; official About page confirms web reading route | Can running a place become a rich progression path through work, guests and accumulated history? | Deepen named gaps from the existing owner; avoid an undirected whole-serial reread |
| RR10 | [A Practical Guide to Evil](https://practicalguidetoevil.wordpress.com/), ErraticErrata | Author serial and existing western report support Names, role-shaped aspects and narrative tactics at sampled scenes | Can lived choices shape a role's verbs, with local narrative laws changing how conflicts work? | Author-hosted serial; reuse existing scenes first. Narrative causality is world-specific, not a universal engine victory rule |
| RR11 | [The Faraway Paladin](https://j-novel.club/series/the-faraway-paladin), Kanata Yanagino | Licensed publisher describes upbringing by three undead mentors, learning and a religious vocation | How can upbringing, faith and obligations make a paladin life different from a combat class? | Publisher offers previews and edition listings; local title query empty. Whole-volume access unverified |
| RR12 | [The Twelve Kingdoms](https://sevenseasentertainment.com/series/the-twelve-kingdoms-novel/), Fuyumi Ono | Publisher describes perilous otherworld entry, mythical beings and political intrigue; identifies a new English translation | How can arrival, belonging and political responsibility generate a different life from adventuring? | Publisher edition route; local title query empty. Keep translation/volume identity explicit |

ACCOUNT FOR NOW: keep RR1/RR2 as the strongest additional deep-dive proposals,
with RR3 next once an opening edition is located. BA1–BA9 remain held-source
options, not displaced decisions. Search finds are not owned books, listing
access is not complete text, and source reading is not gameplay absorption.
RR5/RR9/RR10 are targeted extensions of saved research. First source-gap passes
should compare actual native owners in SYSTEMS_REGISTER before declaring a missing
feature. Any implementation of these proposals needs its own selected slice and
acceptance evidence under the existing absorption workflow.

LATER / DELEGATE (not dispatched): each selected first pass gets an edition and
finite source scope; Luna low for holdings/receipt checks, Luna medium for bounded
reading shards under AU13–15, Sol for synthesis/design. Effort: medium for a
first-volume pass, large for a full long serial. Done check: exact read coverage,
source locators, costs/exceptions, comparison to existing systems and one playable
slice proposal. No blanket full-library reading plan is opened here.

Checks: twelve selected titles have primary-source links; thirteen catalogue
queries returned no indexed matches; existing Delve, Wandering Inn, Guide and
Industrial Strength Magic evidence reused. Pale's About URL failed, so discovery
switched to indexed-source search and it was left unselected without retrying
the failing page. No chapters were bulk acquired or whole books read. Documentation
diff whitespace check applies; runtime tests do not apply.

## More-to-consider round: broader lives and harvest plan, 2026-10-25

Request: “consider more stuff too, and then we can harvest accoridngly”. Mode:
primary-description scouting, local holdings checks and preparation of a harvest
sequence. Rules: WPR1–5/7–8, AD5/32/35–38, WA3/8/12; source acquisition owner
and AU13–15 apply to later collection/reading. One coordinator; no generated
agents, downloads or bulk reading in this round. Stop at distinct additions and
a concrete collection plan. Prior BA/RR codes remain stable.

ACT NOW (done): broadened the comparison beyond crafted powers and ladders.
Ten local catalogue title queries returned Carousel Books 1–3 and no indexed
match for the other nine. This does not inventory every private capture. Checked
primary RR, author and publisher descriptions, reused existing Carousel/Daily
Grind research and the RR atlas. No title is asserted newly discovered merely
because it is added to this queue. Each proposed question below is a research
target, not verified canon or an accepted engine requirement.

| ID | Addition and source | STATED / observed evidence | Proposed OOPS question | Holdings / collection boundary |
|---|---|---|---|---|
| RR13 | [The Game at Carousel](https://www.podiumentertainment.com/series/1841/litrpg-and-gamelit/litrpg/the-game-at-carousel), Rob M. Lastrel / lost_rambler | Publisher describes horror-film archetypes and apparent unawareness affecting danger; existing broad scout has metadata-level evidence | What happens when observed conduct and assigned role affect a world's encounter rules? Read a success and a failure/exception | **Held:** The Bystander (Book 1), The Invitation (2), The Atlas (3). Reuse these exact local assets before considering acquisition. RR URL failed this round; switched to publisher, without retrying variants |
| RR14 | [Bioshifter](https://www.royalroad.com/fiction/59450/bioshifter), Thundamoo | RR marked completed; author describes two-world lives, nonhuman embodiment and magic/body changes leaking between them | How can changes in another body affect ordinary life and capability at home? | No indexed local title match. Author serial is a candidate for manifest-first collection; full TOC/content completeness unverified |
| RR15 | [Dungeon Life](https://www.royalroad.com/fiction/54476/dungeon-life), Khenal | Author's premise has a person choose to become a dungeon; listing marked STUB | What changes when the player is a place with spatial capabilities rather than a mobile human? Investigate ecology and visitor interactions, rather than assume them from the genre | No indexed local title match. Opening edition or author-hosted crosspost needs verification before capture; RR remainder is partial |
| RR16 | [The Daily Grind](https://www.royalroad.com/fiction/15925/the-daily-grind), argusthecat | Author describes an office subdimension; RR marked STUB and directs published Book 5 readers to Chapter 130. Existing broad scout flags precise skill-reward behavior as unverified | How can expeditions coexist with a day job, and what do rewards actually transfer into ordinary competence? | No indexed local title match. Locate opening books; keep published/serial seam explicit |
| RR17 | [The Butcher of Gadobhra](https://www.royalroad.com/fiction/43318/the-butcher-of-gadobhra), The Walrus King | Author describes paid VR labour under corporate ownership; listing STUB, early volumes moved to publication | Can productive work, employer terms and local infrastructure make a compelling adventuring life? | No indexed local title match. Verify beginning editions; remaining RR chapters do not supply the opening volumes |
| RR18 | [12 Miles Below](https://www.royalroad.com/fiction/42367/12-miles-below), Mark Arrows | Title says complete; listing marked STUB. Author describes lethal cold, guarded recovered technology, underground machines and safe zones | Can equipment, maintenance, shelter and route knowledge become the practical means of exploration? | No indexed local title match. Completed story does not mean complete RR text; locate opening books first |
| RR19 | [The Steerswoman](https://www.rosemarykirstein.com/the-books/), Rosemary Kirstein | Author identifies four books and links editions; selected endorsements emphasize scientific reasoning and cultures, not chapter-verified mechanics | Can observation, asking questions and testing a model open real routes without a level award? | No indexed local title match. Author edition links and free excerpts are discovery routes; full text unacquired |
| RR20 | [Foundryside / Founders trilogy](https://www.penguinrandomhouse.com/books/555103/foundryside-by-robert-jackson-bennett/), Robert Jackson Bennett | Publisher describes coded commands in objects, industrialized magic and merchant control | How do programmable properties affect manufacturing, ownership and access to magical infrastructure? | No indexed local title match. Publisher edition route; exact scriving rules require source reading |
| RR21 | [The Last Ship in Suzhou](https://www.royalroad.com/fiction/41852/the-last-ship-in-suzhou), lungs | RR marked HIATUS; author describes Fate/Karma, cultivation as defiance and generational grudges | Can cultivation depend on a person's interpretation, cultural setting and relationship to fate? | No indexed local title match. Collect an explicit available cutoff if selected, without claiming a completed story |
| RR22 | [Virtuous Sons](https://www.royalroad.com/fiction/41330/virtuous-sons), Ya Boy / Striker | Author presents Greco-Roman xianxia, philosophers and defiance of the Fates; listing marked ongoing | How can a different culture and philosophy produce mechanically distinct cultivation? | No indexed local title match. Exact accessible opening/edition coverage still needs a manifest check |

ACCOUNT FOR NOW: four additional absorption dimensions emerged. BMC1: body and
home-world consequences (RR14) need actual carriers and separate clocks, not an
automatic cross-world buff. BMC2: location-bodied play (RR15) needs an explicit
action reach and presence model. BMC3: knowledge progression (RR19) distinguishes
learning, belief, evidence and player display. BMC4: culture, institutional access
and work (RR17/RR20/RR21/RR22) can change available methods and costs without
forcing one universal progression ladder. These are proposed comparison questions,
not claims that corresponding native systems are absent.

### Proposed harvest sequence

This is a concrete future collection plan, not a claim that collection has run.
“Harvest” means acquiring/preparing source evidence; semantic reading and playable
implementation retain separate scopes and verification states.

| Batch | Sources | Work and acceptance check |
|---|---|---|
| H1: existing assets | BA1 Soulhome, BA2 Bookworm, BA3 Arcane Ascension, BA5 All the Skills, RR13 Carousel 1–3 | Resolve exact local keys, hashes and existing prepared/read receipts. Reuse matching preparations; prepare missing text without modifying originals. Keep one corpus per edition and distinguish whole-series gaps. No new download |
| H2: public-serial candidates | RR1 Ar'Kendrithyst, RR2 Chaotic Craftsman, RR4 Runesmith, RR14 Bioshifter, RR21 Last Ship in Suzhou | First inventory existing captures and live TOCs. Select the available story chapter range as of actual collection time; distinguish announcements, extras, hiatus and completed story. Verify the existing permitted transport before any body fetch. Stop a failing route and retain partial receipts |
| H3: opening-edition gaps | RR3 Millennial Mage, RR6 Industrial Strength Magic, RR7 Mana Mirror, RR8 Bog Standard, RR15 Dungeon Life, RR16 Daily Grind, RR17 Butcher, RR18 12 Miles Below, RR19 Steerswoman, RR20 Foundryside | Search exact first editions in the established Source Library route, verify author/language/volume and local aliases, then select one edition. RR stubs do not certify whole-source availability. Do not substitute a later volume for the missing start |
| H4: targeted reuse and retained queue | RR5 Delve, RR9 Wandering Inn, RR10 Guide; remaining BA and RR rows including RR11/12/22 | Reuse existing reading receipts and capture only named gaps where possible. Keep these candidates visible without automatically launching another full-serial read |

For each selected harvest, retain original EPUB/PDF or raw permitted capture,
ordered source manifest and URLs, source/output hashes, extraction version,
chapter population/ordering checks and an explicit gap report under the existing
private source owner. Store source prose privately, outside tracked docs and the
public bundle. Deduplicate by asset/hash and edition rather than title alone.
Log reader coverage separately; a validated archive is not a read book.

LATER / DELEGATE (not dispatched): H1 is a bounded holdings/preparation task
(Luna low, small to medium; done = exact-asset receipts and checked extraction).
H2/H3 are collection tasks (Luna low for catalogue/manifest checks; medium effort
per source; done = usable private corpus plus gaps and transport receipts).
Reading any entire source requires one finite AU13 plan after the corpus word
count is known, with bounded fresh readers, shared budget and repair reserve.
Sol owns consequential synthesis; no stronger-model bulk read is implied.

Checks: ten catalogue queries completed; Carousel 1–3 owned metadata found;
primary evidence linked for all ten additions; no bulk text fetched. First registry
inspection used a multi-ID argument unsupported by `show`; corrected to the
single-ID `show lncrawl` form. Documentation whitespace check applies; no runtime
tests are relevant. No acquisition, full-read completion, accepted build order,
commit or publication is claimed.

## More-to-consider round: additions and combined ranking, 2026-10-25

Request: “find more and then rank accoridngly, more to consider?” Mode:
primary-description discovery, holdings checks and ordinal research-priority
synthesis. Rules: WPR1–5/7–8, WA3/8/12, AD5/32/35–38. One coordinator,
no agents or acquisitions. Existing BA1–BA9 and RR1–RR22 stay stable. This round
adds RR23–RR30 and ranks all 39 current candidates, not every book ever named in
the project. Completed hero-source research in Status remains outside this
new-harvest comparison. Stop at a ranked, reviewable source plan.

ACT NOW (done): eight local catalogue queries returned no indexed title matches.
Pale Lights still has the earlier private sample and three-chapter research
receipt; an empty catalogue search does not erase those. Checked primary author
or RR descriptions for the additions below. Rankings and absorption targets are
PROPOSALS; description checks are not full-source reads.

| ID | Added source / evidence | Proposed question | Access and prior-work qualification |
|---|---|---|---|
| RR23 | [The Path of Ascension](https://www.royalroad.com/fiction/40920/the-path-of-ascension), C. Mantis | How do infrastructure and access support a long progression career? Check support institutions and resource constraints in source, rather than infer them from a tier list | RR STUB, numerous explicit removed chapter ranges; opening edition required. Training-infrastructure detail remains a research lead |
| RR24 | [Forge of Destiny](https://www.royalroad.com/fiction/21188/forge-of-destiny), Yrsillar | How does a sect become a place to live, learn and form ties, with different access by background? | Author describes a slum-born girl's sect entry. RR STUB; author links original unedited quest. Quest, edited serial and published volumes need distinct version identities |
| RR25 | [Super Minion](https://www.royalroad.com/fiction/21410/super-minion), Gogglesbear | How does a nonhuman being learn what people mean and become useful in a social world? | Author describes a powered bioweapon in a supervillain city; RR INACTIVE. Social-learning mechanisms need chapter evidence; availability does not imply a finished story |
| RR26 | [A Practical Guide to Sorcery](https://www.azaleaellis.com/a-practical-guide-to-sorcery/), Azalea Ellis | How do technical spell learning, university access, debt, owed favors and two identities interact? | Author synopsis explicitly connects magic-as-science, tuition, disguise and criminal favors. RR STUB; author's own site also has a reading route. Audit actual chapter access there before assuming an edition purchase is needed |
| RR27 | [Beware of Chicken](https://www.royalroad.com/fiction/39408/beware-of-chicken), Casualfarmer | What does cultivation look like when the character chooses a farm and community instead of a fighting career? | RR STUB. Author premise establishes refusal of the usual pursuit; publisher catalogue also describes farm and spirit animals. Existing RR atlas already includes it; not a new discovery claim |
| RR28 | [Chrysalis](https://www.royalroad.com/fiction/22518/chrysalis), RinoZ | How do a nonhuman body's available actions and growth choices reshape survival? Investigate colony consequences if supported by source | Author describes rebirth, Bite/Dig skills and dungeon survival; RR STUB. Exact mutation/evolution/colony rules remain unverified in this round |
| RR29 | [Beneath the Dragoneye Moons](https://www.royalroad.com/fiction/36299/beneath-the-dragoneye-moons), Selkie | How can healing remain a distinct progression career under dangerous conditions? | Author describes System classes/skills, healing, fighting and finding a place in Pallos. RR STUB; exact medical, oath and class rules need chapter evidence |
| RR30 | [Pale Lights](https://www.royalroad.com/fiction/65058/pale-lights), ErraticErrata | How do a patron's terms, borrowed benefit and delayed cost affect decisions? | Reuse [Book 1 Chapters 1–3 research](power-systems/novel-crawl/REPORT.md) and private receipts. [Author announcement](https://palelights.com/) moves future updates to RR; WordPress is not a current complete-source authority. Distinct from Pale and both Practical Guides |

### Combined research priority, all 39 candidates

Historical snapshot: superseded by the later **Reading-history reconciliation**
and its 54-source recommendation below. Retained as the pre-history-check order.

This is an ordinal next-pass recommendation, not a numerical measurement, a
quality ranking or accepted build order. Weigh (1) marginal mechanism/life value
against existing research, (2) fit to several native consumers, (3) edition and
holdings readiness, and (4) effort to reach a finite useful result. Source
descriptions supply leads; a top-ranked source can move down after inspection.
Lower-ranked sources remain valid world palettes. The literal harvest order
below adjusts for collection readiness and is distinct from this ranking.

| Rank | ID | Source | Reason for this next-pass position |
|---|---|---|---|
| 1 | BA1 | Soulhome | Held first book; concrete material/spatial progression question |
| 2 | BA2 | Ascendance of a Bookworm | Held arcs; making connects learning, households, money and access |
| 3 | RR1 | Ar'Kendrithyst | New-magic creation alongside a lived-in world; completed serial candidate |
| 4 | RR13 | The Game at Carousel | Held Books 1–3; unusually distinct role/observer rules; prior metadata gaps named |
| 5 | RR2 | Chaotic Craftsman Worships the Cube | Crafting career directly fits making and useful noncombat outcomes |
| 6 | BA3 | Arcane Ascension | Held first book; trained enchanting and devices |
| 7 | RR14 | Bioshifter | Distinct cross-world body consequences; completed serial candidate |
| 8 | RR4 | The Runesmith | Technical devices with native crafting consumers |
| 9 | RR26 | A Practical Guide to Sorcery | Technical learning, institutional access and identity/favor interactions in one life |
| 10 | BA4 | Spice & Wolf | Held collection; merchant play broadens the shortlist beyond powers |
| 11 | RR30 | Pale Lights | Existing sampled pact evidence permits a targeted extension with concrete open questions |
| 12 | RR3 | Millennial Mage | Working-mage life, finance, learning and hostile environment; opening text gap |
| 13 | BA5 | All the Skills | Held first book; power ownership versus practiced competence |
| 14 | RR20 | Foundryside | Programmed object behavior plus institutional control; new opening edition needed |
| 15 | RR24 | Forge of Destiny | Sect life and background-dependent access; version reconciliation first |
| 16 | RR27 | Beware of Chicken | Farm/community cultivation life; distinguish native household/garden overlap |
| 17 | RR15 | Dungeon Life | Place-bodied play offers a distinct action perspective; beginning text gap |
| 18 | RR18 | 12 Miles Below | Exploration depends on material means and environment; published/serial gap |
| 19 | RR19 | The Steerswoman | Investigation and knowledge progression; begin with a finite edition |
| 20 | RR29 | Beneath the Dragoneye Moons | Dedicated healer-life comparison; opening text and specific rule evidence needed |
| 21 | RR22 | Virtuous Sons | Culturally different cultivation; useful philosophical contrast |
| 22 | BA7 | The Craft Sequence | Held five-book collection; magic services/obligations are useful but broad |
| 23 | BA9 | Mage Errant | Held first book; affinities and mentorship overlap several higher candidates |
| 24 | RR7 | Mana Mirror | Apprenticeship method and agency; opening text gap and teaching overlap |
| 25 | RR17 | The Butcher of Gadobhra | Labour and corporate access; useful distinct life, larger edition task |
| 26 | RR6 | Industrial Strength Magic | Magitech bridge; earlier scout still lacks precise mechanism evidence |
| 27 | RR16 | The Daily Grind | Work/expedition coexistence and possible skill transfer; opening gap and earlier evidence limits |
| 28 | RR23 | The Path of Ascension | Career infrastructure lead; substantial removed ranges and cultivation overlap |
| 29 | RR28 | Chrysalis | Nonhuman growth is useful; compare body and colony questions against existing coverage |
| 30 | RR25 | Super Minion | Nonhuman social-role lead; unfinished available story, significant hero/body overlap |
| 31 | RR21 | The Last Ship in Suzhou | Fate/culture contrast; hiatus cutoff and cultivation overlap |
| 32 | BA6 | Cradle | Expanded held shelf; compare incremental value with substantial existing cultivation work |
| 33 | RR12 | The Twelve Kingdoms | Belonging and political life; translation/edition task before bounded reading |
| 34 | RR11 | The Faraway Paladin | Mentors and vocation; useful but overlaps higher learning/obligation comparisons |
| 35 | BA8 | Log Horizon | Held Vols 1/2/5 with a gap; crafting/guild comparison overlaps higher candidates |
| 36 | RR8 | Bog Standard Isekai | Useful gate/early-life example; existing gate framework narrows the first question |
| 37 | RR10 | A Practical Guide to Evil | Role/narrative evidence already sampled; extend specific gaps rather than restart whole source |
| 38 | RR5 | Delve | Existing chapter-backed aura work; targeted gap check outranks a fresh harvest |
| 39 | RR9 | The Wandering Inn | Existing class/work samples; high whole-serial effort, retain named life/role questions |

### Further considerations and changed harvest recommendation

| ID | Finding / consequence | Disposition |
|---|---|---|
| BMC5 | Different sources can supply the same proposed feature. More books do not by themselves justify more currencies, clocks, crafting controllers or title owners | ACCOUNT FOR NOW: compare source-specific variants under existing systems, retain distinct world laws; no runtime design is selected |
| BMC6 | Employer obligations, university debt, ordinary favors, magical vows and patron pacts have different enforcement mechanisms | ACCOUNT FOR NOW: capture counterparty, terms, evidence, enforcement, release and an actual failure/exception separately; avoid a universal contract meter |
| BMC7 | Progression also happens through a home, profession, investigation, body, culture or institution. Earlier RR atlas tag harvesting had a female-lead filter bias | ACCOUNT FOR NOW: this round deliberately includes several women-led and nonhuman leads. This is coverage correction, not proof of balanced representation or a quota |
| BMC8 | Source readiness and research value differ. A completed serial can be stubbed; an owned late volume can lack its opening; different versions can change rules | ACCOUNT FOR NOW: maintain collection readiness separately from rank and preserve version/coverage boundaries |
| BMC9 | Long whole-source reads are not the first useful unit for every comparison. A mechanism needs setup, demonstrated use, cost and a failure/exception, not just a favorable scene | LATER: use a named bounded pass when it answers the question; explicit full-source requests still follow finite whole-source AU13 plans rather than stopping at a convenient sample |

Recommended **first harvest/preparation batch**: BA1 Soulhome, BA2 Bookworm,
RR13 Carousel and BA3 Arcane Ascension, reusing held assets; then inventory
RR1 Ar'Kendrithyst and RR14 Bioshifter captures. Recommended **first research
question** remains BA1 material/spatial progression. RR26 Sorcery and RR24
Forge get exact-version/access checks before collecting missing bodies; RR30
Pale Lights starts from its existing sample and current RR boundary. This
supersedes the previous round's short priority recommendation for planning only;
H1–H4 remain route categories, not a command to collect every row at once.

LATER / DELEGATE (not dispatched): rankings need no reader agents. Asset/edition
checks use Luna low, small effort, done = matching hashes/coverage and available
beginning. Each selected reading pass declares source scope, budget and output;
Luna medium for finite shards, Sol for synthesis, no paid or stronger-model bulk
fallback. Done = source-qualified answer and native-owner comparison, followed
by a proposed observable slice if useful.

Checks: eight catalogue queries completed with no indexed matches; primary
descriptions/access states checked; earlier Pale Lights sample evidence reused.
No whole books read or new assets acquired. Validate ranking for one occurrence
of each BA1–BA9 and RR1–RR30 and consecutive ranks 1–39; documentation whitespace
check applies. Runtime tests do not apply to this recommendation-only change.

## Reading-history reconciliation, 2026-10-25

Request: “consider looking through like reading history and more and stuff
accoridngly for more as well”. Mode: saved reading-owner audit, source/holdings
reuse and priority reconciliation. Rules: WPR1–5/7–8, WA3/8/12, AD5/32/35–38.
One coordinator, no agents, downloads, account changes or bulk reading.
No vault or personal-memory changes were requested or made.

### Evidence and corrections

ACT NOW (done): selectively read the master table, taste map, confirmed favorites,
restart and author sections of the [entertainment reading owner](</Users/weiwei/Documents/Claude/Projects/Weibao's Workspace/plans/02_Skills_Learning/Reading_Lists/Reading_List_Entertainment.md>),
plus the channel correction, reading modes, October inventory, inspected-premise
cases and later scout of the [Chinese-webnovel owner](</Users/weiwei/Documents/Claude/Projects/Weibao's Workspace/plans/02_Skills_Learning/Reading_Lists/Reading_List_CN_Webnovels.md>).
These are dated June–October records, not a new signed-in account audit. Exact
personal chapter progress is intentionally not reproduced. Availability, reading
progress and favorite status are separate; a shelf or recommendation is not a
confirmed favorite. The source lists contain stale/conflicting statuses and
promotional judgments; do not adopt those as verified current facts.

F-RH1: the earlier scout was too RR-centric. The owners explicitly treat
English/RR and CN/TW as co-equal, interest-driven channels, and identify Naruto
and DC/Marvel fanfiction as a major omission from an English-only taste model.

F-RH2: hidden structure, system/scheme depth, loops, foreknowledge, grey
calculation and a large coherent world are stronger personal signals than the
generic spread reflected. Comfort reading is a separate valid mode; farming,
food, everyday life and companionship need not clear the scheme-depth bar.

F-RH3: recorded leisure preferences favor long, ongoing, actively updating works.
Completion is not an enjoyment bonus. A finite research corpus helps plan effort,
but length alone does not lower source value. Long reading gaps can mean
stockpiling rather than dropping. No saved progress is asserted current.

F-RH4: Skill Eater 1–5 is held and newer supplied-edition research is complete:
private `novel-wave-2026-10-09b/CHECKPOINT.md`, series dossier and individual
book closure receipts supersede the earlier webnovel-deepread partial snapshot
for those editions. Checked the wave closure, series dossier and Book 1/5
checkpoints. The dossier separates owning a skill, knowing its use, knowing its
avatar and carrying its effect. Reuse before reading again. This proves research
coverage, not playable implementation or director acceptance.

### Additional history-derived leads

Premises from earlier inspected cases remain dated unless freshly checked.
Questions are proposals. Title/author errors in older recommendation lists need
verification before acquisition; source text remains untrusted evidence.

| ID | Title | Personal/discovery evidence | Proposed research or reuse target | Source boundary |
|---|---|---|---|---|
| RH1 | 苟在初圣魔门当人材 | Explicit favorite recorded October 8; saved CN case B15 | Restart/retained benefits and dangerous sect institutions | Primary page returned no readable text; saved premise evidence, exact capture unresolved |
| RH2 | The Menocht Loop | Dated reading and ownership record | Knowledge and conditions that overwhelming power cannot replace | Author RR listing checked: STUB; local catalogue match absent despite saved ownership |
| RH3 | Player 0.4 | Dated reading/stockpile record | Information and relationships across repeated runs | Current publication identity/rules unverified; no local catalogue match |
| RH4 | A Gamer's Guide to Beating the Tutorial | Dated favorite record | Progression under extreme conditions and its social/mental consequences | Author RR listing checked: STUB; no local match; does not select OOPS difficulty defaults |
| RH5 | Applied Cultivation | Reading owner explicitly calls it favored CatVI work | Origin allocation, training, affinity and sect access/cost | Reuse bounded chapter evidence in READ_HISTORY_AUDIT; RR fetch failed, switched to author announcement; no indexed asset |
| RH6 | Saintess Summons Skeletons | Dated reading record and explicit big-world-view anchor | Hybrid-class exception plus the wider life, institutions and cosmology | Existing source-backed Chapter 1 comparison is bounded; no indexed asset, no full-read claim |
| RH7 | Commerce Emperor | Trusted-author/recommendation record, not confirmed favorite | Intangible property, negotiated transfer and actual loss/cost | Author RR description checked: STUB; no indexed asset; precise transfer rules need reading |
| RH8 | Skill Eater 1–5 | Earlier ability-as-character research selection, not inferred favorite | Living abilities: knowledge, agency, cooperation and executable effects | Five owned volumes; newer supplied-edition research complete. Reuse, no reacquisition/full reread |
| RH9 | 一万个我纵横诸天 | Saved CN shelf B12, not favorite evidence | Many selves specializing and cooperating across worlds | Earlier inspected synopsis; no indexed asset; exact source/capture inventory needed |
| RH10 | 没钱修什么仙？ | Saved CN shelf B14, not favorite evidence | Credit, education and institutional access to cultivation | Primary indexed synopsis supports power-loan hook; page render empty, not captured prose; no indexed asset |
| RH11 | 火影：我的攻略對象全是忍術 | Saved shelf B02, not favorite evidence | Personified techniques and interaction-based development | Earlier inspected synopsis; compare existing living-method research before collecting |
| RH12 | 還能保送怪物職業學院？ | Saved shelf B06, not favorite evidence | Monster vocational schooling, recognition and mismatched systems | Earlier inspected synopsis; exact source/access unresolved |
| RH13 | The Flower That Bloomed Nowhere | Cerebral recommendation record, not proof of reading | Investigation, identity and immortality research | RR listing located; mechanism detail remains a source question; no indexed asset |
| RH14 | Heretical Fishing | Saved comfort-lane reference | Leisure, useful work, community and companionship | Earlier bounded skill-growth research exists; no indexed asset; compare before new reading |
| RH15 | World of Cultivation | Saved recommendation, not favorite/reading evidence | Production, trade and organization alongside cultivation | Dated lead; current edition/aliases unverified; no indexed English-title asset |

Fresh primary checks and route locators:
[The Menocht Loop](https://www.royalroad.com/fiction/31514/the-menocht-loop),
[Gamer's Guide](https://www.royalroad.com/fiction/73205/a-gamers-guide-to-beating-the-tutorial),
[Commerce Emperor](https://www.royalroad.com/fiction/69923/commerce-emperor),
[Flower](https://www.royalroad.com/fiction/28806/the-flower-that-bloomed-nowhere),
[Applied Cultivation author announcement](https://www.reddit.com/r/ProgressionFantasy/comments/1uosok2/applied_cultivation_book_1_survival_protocol_is/),
[RH1 primary identity](https://www.qidian.com/book/1043182343/) (empty page render),
[RH10 primary indexed synopsis](https://www.qidian.com/book/1042256511/) (open
render empty; search index contains the loan hook). No failing page was retried
through variants. Current progress/status is not inferred from search freshness.

Fourteen local catalogue queries included simplified/traditional RH1 fragments.
Only Skill Eater returned matching indexed assets. This does not override saved
purchase ownership or prove no copy exists outside the catalogue. RH11/12 are
saved-premise leads; no new local title query or chapter verification is claimed.

### Current history-informed ranking, all 54 candidates

This replaces the earlier 39-source planning order and short harvest
recommendations. Earlier rows remain historical. Rank weighs personal signal,
marginal source value and native-system fit; harvest readiness is tracked
separately. Favorite evidence raises relevance without proving mechanics.
Already researched sources can rank highly for reuse while requiring no new
harvest. This is an ordinal proposal, not a numerical score, accepted build
order, or new runtime wave. Lower ranks retain their world/life questions.
The completed hero-source Status table stays outside this new-source comparison.

| Rank | ID | Source | Reason / question |
|---|---|---|---|
| 1 | RH1 | 苟在初圣魔门当人材 | Restart/retained benefits and dangerous sect institutions |
| 2 | BA1 | Soulhome | Held first book; concrete material/spatial progression question |
| 3 | BA2 | Ascendance of a Bookworm | Held arcs; making connects learning, households, money and access |
| 4 | RH5 | Applied Cultivation | Origin allocation, training, affinity and sect access/cost |
| 5 | RH6 | Saintess Summons Skeletons | Hybrid-class exception plus the wider life, institutions and cosmology |
| 6 | RR13 | The Game at Carousel | Held Books 1–3; unusually distinct role/observer rules; prior metadata gaps named |
| 7 | RH2 | The Menocht Loop | Knowledge and conditions that overwhelming power cannot replace |
| 8 | RH3 | Player 0.4 | Information and relationships across repeated runs |
| 9 | RR1 | Ar'Kendrithyst | New-magic creation alongside a lived-in world; completed serial candidate |
| 10 | BA3 | Arcane Ascension | Held first book; trained enchanting and devices |
| 11 | RR2 | Chaotic Craftsman Worships the Cube | Crafting career directly fits making and useful noncombat outcomes |
| 12 | RH8 | Skill Eater 1–5 | Living abilities: knowledge, agency, cooperation and executable effects |
| 13 | RH10 | 没钱修什么仙？ | Credit, education and institutional access to cultivation |
| 14 | RH9 | 一万个我纵横诸天 | Many selves specializing and cooperating across worlds |
| 15 | RH7 | Commerce Emperor | Intangible property, negotiated transfer and actual loss/cost |
| 16 | RH13 | The Flower That Bloomed Nowhere | Investigation, identity and immortality research |
| 17 | RR26 | A Practical Guide to Sorcery | Technical learning, institutional access and identity/favor interactions in one life |
| 18 | RR14 | Bioshifter | Distinct cross-world body consequences; completed serial candidate |
| 19 | RH4 | A Gamer's Guide to Beating the Tutorial | Progression under extreme conditions and its social/mental consequences |
| 20 | BA4 | Spice & Wolf | Held collection; merchant play broadens the shortlist beyond powers |
| 21 | RH11 | 火影：我的攻略對象全是忍術 | Personified techniques and interaction-based development |
| 22 | RH12 | 還能保送怪物職業學院？ | Monster vocational schooling, recognition and mismatched systems |
| 23 | RH15 | World of Cultivation | Production, trade and organization alongside cultivation |
| 24 | RR4 | The Runesmith | Technical devices with native crafting consumers |
| 25 | RH14 | Heretical Fishing | Leisure, useful work, community and companionship |
| 26 | RR30 | Pale Lights | Existing sampled pact evidence permits a targeted extension with concrete open questions |
| 27 | RR3 | Millennial Mage | Working-mage life, finance, learning and hostile environment; opening text gap |
| 28 | BA5 | All the Skills | Held first book; power ownership versus practiced competence |
| 29 | RR20 | Foundryside | Programmed object behavior plus institutional control; new opening edition needed |
| 30 | RR24 | Forge of Destiny | Sect life and background-dependent access; version reconciliation first |
| 31 | RR27 | Beware of Chicken | Farm/community cultivation life; distinguish native household/garden overlap |
| 32 | RR15 | Dungeon Life | Place-bodied play offers a distinct action perspective; beginning text gap |
| 33 | RR18 | 12 Miles Below | Exploration depends on material means and environment; published/serial gap |
| 34 | RR19 | The Steerswoman | Investigation and knowledge progression; begin with a finite edition |
| 35 | RR29 | Beneath the Dragoneye Moons | Dedicated healer-life comparison; opening text and specific rule evidence needed |
| 36 | RR22 | Virtuous Sons | Culturally different cultivation; useful philosophical contrast |
| 37 | BA7 | The Craft Sequence | Held five-book collection; magic services/obligations are useful but broad |
| 38 | BA9 | Mage Errant | Held first book; affinities and mentorship overlap several higher candidates |
| 39 | RR7 | Mana Mirror | Apprenticeship method and agency; opening text gap and teaching overlap |
| 40 | RR17 | The Butcher of Gadobhra | Labour and corporate access; useful distinct life, larger edition task |
| 41 | RR6 | Industrial Strength Magic | Magitech bridge; earlier scout still lacks precise mechanism evidence |
| 42 | RR16 | The Daily Grind | Work/expedition coexistence and possible skill transfer; opening gap and earlier evidence limits |
| 43 | RR23 | The Path of Ascension | Career infrastructure lead; substantial removed ranges and cultivation overlap |
| 44 | RR28 | Chrysalis | Nonhuman growth is useful; compare body and colony questions against existing coverage |
| 45 | RR25 | Super Minion | Nonhuman social-role lead; unfinished available story, significant hero/body overlap |
| 46 | RR21 | The Last Ship in Suzhou | Fate/culture contrast; hiatus cutoff and cultivation overlap |
| 47 | BA6 | Cradle | Expanded held shelf; compare incremental value with substantial existing cultivation work |
| 48 | RR12 | The Twelve Kingdoms | Belonging and political life; translation/edition task before bounded reading |
| 49 | RR11 | The Faraway Paladin | Mentors and vocation; useful but overlaps higher learning/obligation comparisons |
| 50 | BA8 | Log Horizon | Held Vols 1/2/5 with a gap; crafting/guild comparison overlaps higher candidates |
| 51 | RR8 | Bog Standard Isekai | Useful gate/early-life example; existing gate framework narrows the first question |
| 52 | RR10 | A Practical Guide to Evil | Role/narrative evidence already sampled; extend specific gaps rather than restart whole source |
| 53 | RR5 | Delve | Existing chapter-backed aura work; targeted gap check outranks a fresh harvest |
| 54 | RR9 | The Wandering Inn | Existing class/work samples; high whole-serial effort, retain named life/role questions |

### More to account for and next concrete work

| ID | Consequence | Disposition |
|---|---|---|
| BMC10 | Personal reading history, agent research coverage and gameplay implementation are independent | ACT NOW (done): RH8 corrected to reuse; dated personal progress not reported current |
| BMC11 | Favorite-author clusters are discovery routes, not blanket approval of every work | ACCOUNT FOR NOW: use Void Herald, CatVI, noct and other recorded clusters; verify each source |
| BMC12 | CN/TW fanfiction supplies altered institutions and cross-world mechanism interactions missed by a canon-only list | LATER: bounded Naruto/DC/Marvel work-specific passes, explicit canon/fan/original labels; no whole-fandom collection |
| BMC13 | Stockpiling makes recency a weak dislike signal | ACCOUNT FOR NOW: do not prune a recorded read merely for a gap |
| BMC14 | Long active stories and expansive worlds are desired; a finite capture cutoff makes research manageable | ACCOUNT FOR NOW: freeze available coverage at collection time; use AU13 for a requested full read rather than treat length as a defect |

Recommended next work: compare RH8's completed research with native consumers;
resolve exact source/holdings for RH1/RH5/RH6, then RH2/RH3. Keep the held
BA1/BA2/RR13 preparation batch ready while access is resolved. RH14/RR27 preserve
comfort depth. Recorded LOTM, Reverend Insanity and ORV favorites remain taste
anchors and existing-source inputs, not automatically reopened full-read jobs.

LATER / DELEGATE (not dispatched): holdings/receipt matching uses Luna low,
small effort, done = asset/edition/coverage receipt. Reading gets a finite source
scope and shared budget; Sol handles consequential synthesis. No repeated full
read of RH8, author messaging, purchase, recurring task or vault rewrite is
implied. Collection has not started in this round.

Checks: two local reading owners inspected selectively; fourteen catalogue
queries completed; accessible primary descriptions checked; private supplied-
edition closure reviewed. Verify 54 consecutive ranks and exactly one occurrence
of BA1–BA9, RR1–RR30 and RH1–RH15. Documentation whitespace check applies;
runtime tests are not relevant.

## Local reuse expansion, 2026-10-25, BMC15–BMC19

Weibao asked whether more material was already local and for another consideration
round. ACT NOW (done): broadened the EPUB shortlist to work-specific catalogue
matches, legacy reading owners and alternate-format files in the existing
Calibre/Downloads/private-source roots. [Harvest receipt](SOURCE_HARVEST_2026-10-25.md)
owns the checks. No public recommendation lookup was needed for this local pass.

### Additional held leads, ordered for reuse consideration

This is a proposed supplemental priority, not a renumbering of the 54 candidates
or a claim that every source needs another full read. Questions below are design
comparison prompts, not newly verified canon claims. Volumes describe observed
holdings rather than current publication completeness.

| Order | ID | Local lead | Held evidence and next useful comparison |
|---|---|---|---|
| 1 | LH1 | Godclads | Books 1–2; existing full supplied-edition coverage owner. Reuse its proposals and check native consumers |
| 2 | LH2 | Mother of Learning | Exact held hash matches completed supplied-snapshot checkpoint. Reuse the learning/time/knowledge dossier |
| 3 | LH3 | Worm | Held EPUB and completed supplied-compilation research owner. Bind its manifest before carrying claims into a new design |
| 4 | LH4 | A Soldier's Life | EPUBs 1/2/3/5/6 plus Book 4 MOBI. Exact MOBI hash matches the existing manifest; supplied 1–5 reading packet already exists. Book 6 needs its own coverage check |
| 5 | LH5 | Beyond the Timescape | Exact held hash matches completed snapshot checkpoint. Compare saved institution/body/resource proposals before new reading |
| 6 | LH6 | Kairos | Three held editions; ask which existing role, voyage or obligation consumers benefit |
| 7 | LH7 | Dungeon Crawler Carl | Two distinct first-book files, not two volumes. One prepares successfully; alternate has duplicate spine members |
| 8 | LH8 | Jekua / On Lavender Tides | Held Book 1. Compare companion relationships, care and travel questions |
| 9 | LH9 | Frith Chronicles / Knightmare Arcanist | Held opening book. Compare partner identity and learned competence questions |
| 10 | LH10 | Dungeon Born | Held opening book. Compare a place's agency, inhabitants and resource cycle |
| 11 | LH11 | Speedrunning the Multiverse | Four held editions. Compare prior knowledge against actual means and world-specific friction |
| 12 | LH12 | Wish Upon the Stars | Eight held editions and an older series dossier; four held hashes appear in that owner. Reconcile later-edition coverage rather than restart |
| 13 | LH13 | You Are Summoned | Five held editions and existing series reading owner; verify edition binding before extending |
| 14 | LH14 | A Knight Who Eternally Regresses | Held EPUB plus older local reader folder; reconcile exact coverage first |
| 15 | LH15 | Cathedral, Forge, and Waterwheel | Held practical-history reference: test crafting palettes against material/process dependencies |
| 16 | LH16 | Life in a Medieval Village | Held reference: test household, seasonal work and local institution detail |
| 17 | LH17 | The Time Traveller's Guide to Medieval England | Held reference: check ordinary travel, services and social practice questions |
| 18 | LH18 | The Knowledge | Held reference: check reconstruction chains and missing intermediate means |

### New consequences and disposition

| ID | Consequence | Disposition |
|---|---|---|
| BMC15 | Local ownership spans EPUB, MOBI, raw captures and conversion-derived files | ACT NOW (done): Book 4 recovered and exact source hash matched; format-path totals are not book counts |
| BMC16 | Similar mechanisms do not establish work identity | ACT NOW (done): keep 我的功法怎么全变成了美少女？'s ten-chapter packet separate from RH11's Naruto title |
| BMC17 | Existing source research can outrank a new acquisition for immediate useful work | ACCOUNT FOR NOW: reuse completed supplied-edition owners, with exact hash binding before importing claims; personal reading remains separate |
| BMC18 | Practical history broadens everyday play as well as power-system fiction | ACCOUNT FOR NOW: retain LH15–LH18 as supporting references; source passages must support any specific historical claim |
| BMC19 | A first-book duplicate, omnibus and eight-volume series have different coverage | ACCOUNT FOR NOW: preserve edition/member manifests and named gaps; do not rank file counts as source depth |

LATER / DELEGATE (not dispatched): bounded coverage reconciliation for LH11–LH14,
Luna low for hash/receipt matching, small effort, done = edition-to-reading map
with unresolved ranges. Sol only if conflicting evidence needs substantive
synthesis. This round authorizes no runtime changes, purchase or repeat full read.

Checks: 18 additional leads, 40 distinct EPUB hashes, 39 verified preparations;
one alternate DCC extraction blocked. Book 4's MOBI hash matches prior manifest.
Originals remain unchanged; raw source and private holdings stay gitignored.


## Acquisition continuation, 2026-10-25, BMC20–BMC22

The latest authorized retry advanced existing candidates rather than assigning
new favorite or source-reading claims. Primary identity references remain the
[Millennial Mage](https://www.royalroad.com/fiction/47826/millennial-mage/),
[Industrial Strength Magic](https://www.royalroad.com/fiction/57011/industrial-strength-magic),
[Heretical Fishing](https://www.royalroad.com/fiction/67114/heretical-) and
[Bog Standard](https://www.royalroad.com/fiction/69512/bog-standard-isekai)
author listings. Actual acquisitions and coverage belong to the harvest receipt.

| Code | New consideration | Disposition |
|---|---|---|
| BMC20 | Download redirects and catalogue recovery can reissue an already-held file | ACT NOW (done): cancelled the repeated P4V5 save, retained completed hashes, recorded normal Back navigation and the actual daily-quota refusal |
| BMC21 | A serial Step 1 snapshot and a published Book 1 can have different cutoffs | ACCOUNT FOR NOW: Gamer's Guide holds numbered 0–27; edition/cutoff reconciliation is required before claiming the full published opening or requesting a redundant copy |
| BMC22 | More RR coverage can use the existing ranked gaps while completed source research stays reusable | ACCOUNT FOR NOW: next opening leads are The Runesmith, Forge of Destiny, Dungeon Life, 12 Miles Below, Mana Mirror and The Path of Ascension; retain Carousel, Skill Eater, Godclads, Wish Upon Stars and You Are Summoned reuse bindings |

LATER / DELEGATE (not dispatched): bounded publication-cutoff reconciliation,
Luna low for mechanical metadata matching with coordinator judgment for conflicting
editions; done when the held hash/member range is bound to the selected published
or serial cutoff. No new full read is implied. Next native acquisitions wait for
actual allowance availability, then review P5V2's stopped receipt before reissue.
