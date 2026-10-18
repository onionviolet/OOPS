# Fate / TYPE-MOON source ledger

Status: **secondary-source ledger, 2026-10-15.** This records what the available evidence can support; it does not certify primary-canon truth. Source-revision links go to the cited archived article. Reader notes and raw payloads remain under the existing gitignored full-dump/private research folders.

## Labels

| Label | Meaning |
|---|---|
| `W` | Dated Type-Moon Wiki assertion at the named page revision. Secondary evidence. |
| `R` | Reader note paraphrase, with page revision and selected-scope locator where preserved. |
| `I` | Synthesis inference from one or more named records. |
| `O` | YAIRPG proposal, never a canon claim. |
| `U` | Unresolved, absent, contradictory, unexpanded, or not verified against primary work. |

Every behavior proposed in the other owners is `O`, even when informed by `W` or `R` evidence.

## Frozen research inputs

| Input | Evidence represented | Scope / limit |
|---|---|---|
| [`DIGEST_fate-series.md`](../../research/power-systems/wiki-digests/DIGEST_fate-series.md) | Revision-backed bounded review DF1–DF3; pages Command Spell r404906 and Servant r405040. | Digest says Fandom scripted fetch returned 403; review used the dated archive. Earlier E8 mappings remain explicitly unverified leads. |
| [`fate-full/NOTES.jsonl`](../../research/power-systems/wiki-digests/full-dumps/workers/fate-full/NOTES.jsonl) | Initial full-reader set: 33 paired complete page selections, 735,773 characters per checkpoint. | Full selected payloads, not necessarily complete article contents or all nested citations. |
| [`shard-a/NOTES.jsonl`](../../research/power-systems/wiki-digests/full-dumps/workers/fate-full/r2-2026-10-13/shard-a/NOTES.jsonl) | Manifest rows 31–1035; 993 notes / 15,585,170 characters per summary. | Selected archived payloads; two predecessor-page skips documented; ten no-input rows. |
| [`shard-b/NOTES.jsonl`](../../research/power-systems/wiki-digests/full-dumps/workers/fate-full/r2-2026-10-13/shard-b/NOTES.jsonl) | Manifest rows 1036–2517; 1,481 notes / 15,576,638 characters per summary. | Selected archived payloads; nested citations unresolved in 474 notes and 31 explicit unknown rows. |
| [`shard-c/NOTES.jsonl`](../../research/power-systems/wiki-digests/full-dumps/workers/fate-full/r2-2026-10-13/shard-c/NOTES.jsonl) | Manifest rows 2518–6391; 3,864 retained reads / 15,566,907 characters; 21 no-input records adjudicated per summary. | Selected archived payloads; 374 retained rows with unresolved nested sources; page set includes metadata-only entries. |
| [`typemoon_INDEX.json`](../../research/power-systems/wiki-digests/full-dumps/typemoon_INDEX.json) and `typemoon_SOURCES.json` | Snapshot index and retained-page manifest. | Archive dates, selected hashes and source statuses are historic research metadata, not live wiki state. |

The reader summaries report complete reading of each assigned retained selected payload in bounded chunks and hash/length reconciliation. This synthesis author read the summaries, digest, targeted rows and local design references, then spot-checked selected private payloads; the synthesis author did not reread the entire corpus.

## Core bounded claims

| Claim / status | Evidence and revision | Qualification |
|---|---|---|
| `W` Fuyuki Master's authority charges and energy supply are distinguishable. | [Command Spell r404906](https://typemoon.fandom.com/wiki/Command_Spell?oldid=404906), digest DF1/DF3; [Master r398975](https://typemoon.fandom.com/wiki/Master?oldid=398975). | Fuyuki-specific charge count and command behavior. Other rituals differ. Broad commands can weaken/resist; exact enforcement depends on order, energy, and Servant circumstances. |
| `W` A summoned class vessel carries a bounded instance drawn from a heroic record. | [Servant r405040](https://typemoon.fandom.com/wiki/Servant?oldid=405040). | Secondary encyclopedia article with unexpanded citations. Not a universal explanation for every digital, pseudo-servant, or altered graph. |
| `W` Master status, command authority, and supply paths have distinct conditions. | [Master r398975](https://typemoon.fandom.com/wiki/Master?oldid=398975). | Includes Fuyuki, Moon Cell, Chaldea, and other specific exceptions; no merged default. |
| `W` Circuits, Foundations, formulas, and magical energy are related but distinct. | [Magic Circuit r395092](https://typemoon.fandom.com/wiki/Magic_Circuit?oldid=395092). | Article spans multiple works and embedded encyclopedia material; this synthesis spot-checked the selected text. Primary sources are not authenticated here. |
| `W` Fate/Zero is a similar parallel world to stay night despite a ten-year-earlier event. | [Fate/Zero r405726](https://typemoon.fandom.com/wiki/Fate/Zero?oldid=405726). | The article's explicit branch statement governs this proposal; don't fuse the Zero cast/state into a future stay night instance. |
| `W` Continuity names and timelines require a work/branch selector. | [Timeline r405727](https://typemoon.fandom.com/wiki/Timeline?oldid=405727), [Fate/stay night r401551](https://typemoon.fandom.com/wiki/Fate/stay_night?oldid=401551), and lane summaries. | This is a navigation/proposal rule. Timeline article itself can contain wiki/editor synthesis. |

### Spot checks made for this synthesis

| Payload | Checked point | Result / limit |
|---|---|---|
| Magic Circuit r395092, private selected payload | Pseudo-nervous-system description, soul/physical-expression language, Foundation/formula/energy execution, circuit rating axes. | The retained text contains these distinctions. Embedded citations and cross-work scope remain secondary. |
| Master r398975, private selected payload | Master status/visible mark, Magical Paths, Moon Cell contract restriction, Chaldea supply architecture. | Confirms those sections exist and are not universalized here. |
| Command Spell r404906, private selected payload | Fuyuki three-per-Master rule, command specificity/energy behavior, possibility of resistance and differing relationship after charge loss. | Confirms Fuyuki-scoped digest summary. Digest calls agreement an influence; do not treat as a guaranteed command engine. |
| Servant r405040, private selected payload | Heroic Spirit record versus instance/copy, class-vessel and anchor explanations; Chaldea Saint Graph storage can preserve memories after resummoning under circumstances. | Confirms article wording, not a primary text audit or complete model. |
| Command Spell r404906, private selected payload | Three initial Fuyuki charges; additional charges may be stolen or received from the overseer under circumstances; specific uses can reinforce a Servant with magical energy. | Charge ceiling and energy use remain conditional, not universal. |
| Master r398975, private selected payload | Master status may persist with a remaining Command Spell after Servant loss; a pact with an unclaimed Servant is possible. | Fuyuki-related statement; primary route check remains open. |
| Fate/Apocrypha r397812, private selected payload | Development section identifies the online MMO as canceled at planning stage. | Development history, not a selectable released game version. |
| Fate/Zero r405726, private selected payload | Explicit similar-parallel-world language and 1994 Fourth War setting. | Confirms the key continuity boundary, not primary canon adjudication. |

## Continuity index

| Work / branch | Revision-backed evidence | Evidence status |
|---|---|---|
| *Fate/stay night* routes | `Fate/stay night` r401551; route notes throughout shard corpora. | `R/W`; pin route, release/edition, and local date. Route sequence is not one completed history. |
| *Fate/Zero* | r405726. | `W`; separate but related parallel continuity. |
| *Fate/hollow ataraxia* | r403127 (retained manifest and paired reader note); loop notes. | `R/W`; loop rules are scoped to this work. |
| *Fate/EXTRA* / *CCC* | `Moon Cell` r381336; Master r398975; character pages across shards. | `R/W`; Moon Cell rules differ from Fuyuki. Separate sequel/Record claims by edition. |
| *Fate/Grand Order* | Many event, chapter, character, system and Lostbelt rows across shards. | `R/W`; FATE system, Singularity, Lostbelt, event, Arcade and collaboration are separate contexts. |
| *Fate/strange Fake* | Snowfield/character and collaboration rows in shard C; timelines. | `R/W`; Snowfield Singularity/collaboration explicitly differs from main story in notes. |
| *Fate/Apocrypha* | Initial set and character/class notes. | `R/W`; war structure and class roster belong to this work. |
| *Fate/Prototype* / fragments | Character and history rows across shards. | `R/W`; alternate-root continuity. Do not fill unfinished spaces from later works. |
| *Prisma Illya* | Class Card and character rows. | `R/W`; cards and alternate graph mechanics are local. |
| GUDAGUDA / Redline | Character/event/manga notes. | `R/W`; gag event, Redline manga and FGO implementation stay distinct. |
| Original *Tsukihime* | `Tsukihime` r347154; Dead Apostle r400369; related character pages. | `R/W`; original 27 Ancestors hierarchy is not a remake default. |
| *Tsukihime* remake | Remake character and event notes. | `R/W`; distinct categories/rules from original; exact edition and route needed. |
| *Melty Blood* | Work and character notes. | `R/W`; each game's branch and gameplay/story distinction must be pinned. |
| *Kara no Kyoukai* | Work, character, Root pages. | `R/W`; Ryougi's identity and faculties must not be conflated with Shiki Tohno. |
| *Mahoutsukai no Yoru* | Work and Aoko notes. | `R/W`; Aoko's state belongs to its selected period. |
| *DDD* | DDD page in initial reader set. | `R/W`; source explicitly distinguishes it; no automatic shared rule inference. |
| *Fire Girl / Mathematica* | Shard C selected notes. | `R/W`; independent system; do not rename as magecraft. |
| Other FGO event worlds, Lostbelts, Moon Dubai, collaboration worlds | Event and chapter notes across all shards. | `R/W`; separate entry per causal branch/rule-bearing situation; avoid using event proximity as continuity proof. |

## Contradictions and qualifications retained

| Conflict / qualification | Source scope | Handling proposal |
|---|---|---|
| Command Spell force, broad orders, consent/agreement, and relationship after charges end. | Digest DF1/DF3, Command Spell r404906, Master r398975. | Keep authority, energy, deliverable action, resistance and social loyalty distinct; don't resolve every disputed phrase into a single success percentage. |
| Master eligibility / contract / one-active-Servant and energy supply differ by system. | Master r398975 and lane notes. | Fuyuki, Moon Cell, Chaldea, Ainsworth and other variants remain separate policies. |
| Zero and stay night details differ despite similar event chronology. | Fate/Zero r405726 and stay night r401551. | Use separate continuity entries rather than harmonizing. |
| FGO chronology, pruning/retention, Traveler explanations, and restoration sometimes conflict within articles or across revisions. | Shard A/B/C summaries; e.g. Lostbelt Zero notes and Urd notes. | Retain both claims with speaker/page/section; leave unresolved until primary chapter check changes a proposed mechanic. |
| FGO ability text, parameters, class labels, lore and gameplay cards may disagree. | Shard A/B summaries. | Record version and source field; gameplay equivalence is not lore equivalence. |
| Tsukihime original/remake hierarchy, Dead Apostles, exceptions, and terminology differ. | Dead Apostle r400369 and remake-character notes. | Do not port original taxonomy into remake. |
| Urd: immutable past statement versus a selected past that changes an attack result. | Shard C summary, Urd record. | Preserve unresolved; no universal rule of fate or timeline correction. |
| Snowfield Singularity pages have incomplete synopsis and variant participant/charge differences from *strange Fake*. | Shard C summary. | Do not fill causal story beats from titles, collaboration rosters, or memory. |
| DDD, Fire Girl, and other connected catalog entries have independent system scope. | Initial set and shard C summary. | No franchise-wide shared system by association. |
| Zero-input and metadata-only records, sparse stubs, and unexpanded transclusions. | Shard A/B/C summaries and `SCOPE_DISPOSITIONS.jsonl`. | Absence is not proof that a character lacks powers or that omitted content has no rule. |

## Primary-source gate

No primary TYPE-MOON game, novel, manga, film or anime was read in this synthesis. Wiki pages' embedded primary citations are not independently checked. The listed facts should be described as secondary wiki evidence until a design-relevant claim receives a direct, edition-pinned primary check. No fan consensus, complete roster, or canon completeness is claimed.
