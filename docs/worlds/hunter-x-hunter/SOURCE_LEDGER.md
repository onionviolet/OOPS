# Hunter × Hunter source ledger

Status: secondary-source bounded review, proposal r1, 2026-10-14. This is not a primary manga audit, canon-completion certificate or rightsholder attribution grant.

## P1. Source snapshot and evidence labels

| Label | Meaning |
|---|---|
| `WIKI` | Dated secondary Hunterpedia page/revision paraphrased in the supplied notes. It can summarize primary references but is not independently verified canon. |
| `INFERRED` | Design or interpretation derived from one or more wiki notes. |
| `P` | Original YAIRPG authoring proposal; not a source-world fact. |
| `OPEN` | Evidence is absent, conflicting, too broad or requires direct primary review. |

Inputs: `docs/research/power-systems/wiki-digests/DIGEST_hunter-x-hunter.md` (dump snapshot review completed 2026-10-10); `full-dumps/workers/hxh-full/NOTES.jsonl`; `full-dumps/workers/hxh-full/r2-2026-10-13/shard-a/NOTES.jsonl`; `.../shard-b/NOTES.jsonl`. These reader notes are git-ignored paraphrases and remain at their source paths; the adjacent [reading manifest](readers-2026-10-14/READING_MANIFEST.md) lists every page, revision and scope. Revision ids below are required for every imported claim. Private cached page text lives under `/Users/weiwei/.codex/research/wikis/hunterxhunter.fandom.com/` and is not copied here.

## P2. Core rules and bounded uses

| ID | Secondary page and revision | Paraphrased evidence | Permitted use / limitation |
|---|---|---|---|
| S1 | *Nen* r421055 | Aura is life energy controlled through opened nodes; Ten, Zetsu, Ren and Hatsu form core principles; Gyo, In, En, Shu, Ko, Ken and Ryu are advanced applications. | WIKI summary citing manga chapters including 46-47 and later explanations. Use as a candidate rule map; verify primary scenes before tuning or declaring universal exceptions. |
| S2 | *Nen* r421055 | Slow training and forced initiation differ in speed and risk; uncontrolled aura can cause harm, fatigue and loss of consciousness. | Do not present forced awakening as safe onboarding. Exact event-specific outcomes need primary scenes. |
| S3 | *Nen* r421055 | Six categories and approximate affinity efficiencies are described. The page states that ordinary users cannot partially use Specialist abilities and only Specialists can create them; it also describes possible later transition. | Model Specialist eligibility as a categorical gate for ability use and creation, not a proficiency percentage. Keep numerical efficiencies and individual exceptions secondary and unverified; do not infer ability from personality alone. |
| S4 | *Nen* r421055 | Conditions, continuous activation predicates, vows, limits and breach outcomes are distinct. The page gives broken limitations a baseline of losing the affected ability and risking Nen capacity; its account also permits additional case-specific punishment. | Model unavailability, condition failure and vow breach separately. Show the reported baseline risks without making them a global formula; retain primary review before canon-compatible player vows. |
| S5 | *Hunter Exam* r419181 | The exam has multiple phases that vary; the wiki reports five or six as average, and reports next-year exam access for an applicant who passes phase three. | Use variable authored scenarios; exact dates and next-year eligibility require primary check and an explicit era. Keep this specific path distinct from a universal retake right. |
| S6 | *Hunter License* r405166 | Passing produces a valuable credential with access and privileges. The page says a lost/stolen card is not replaced, a successful passer cannot retake the exam, and selling the card does not transfer privileges. | Track credential owner, custody and loss distinctly. Reconcile this no-retake statement with the exam page's specific phase-three next-year route in primary review. Credential is not transferable power or blanket immunity. Legal summaries need primary review and fictional-jurisdiction qualification. |
| S7 | *Hunter Association* r419296; *Nen* r421055 | Association tests/licenses Hunters and imposes an additional concealed Nen-related professional step in the page summary; it also describes Provisional Hunters exempted from the Nen requirement. The Nen page reports that licensed Hunters generally may not disclose Nen to uninformed people, with an emergency exception. | Keep public exam completion, license custody, concealed qualification, job eligibility and observer knowledge distinct. Treat the disclosure constraint as secondary-source evidence for proposed routes; preserve the reported provisional exception and verify exact bylaws and exceptions in primary material. |
| S8 | *Heavens Arena* r417607 | Floors, matches, money and a Nen-related danger threshold are summarized. | Training/income module anchor; avoid exact safety or payout claims without page/primary check. |
| S9 | *Greed Island* r411117 | Game access is limited to Nen users; the wiki describes bodily entry, card storage, quests, exit and real danger. | Later destination proposal only. Direct primary verification needed for persistence, death, multiplayer and winning routes. |
| S10 | *Meteor City* r419877 | The page describes undocumented residents, elder governance, historical trafficking and disputes over responses to threats. | Use as candidate social context, not a complete or uncontested ethnography. |
| S11 | *Chimera Ants* r419293 | Species and colony change over time; abilities and threats vary, with specific arc events. | Ecology needs species/era-specific cards, not a generic level band. |
| S12 | *Succession Contest* r420995 | A multi-party succession conflict and related ability/organization events are described in the wiki snapshot. | Keep actor knowledge, rumor and actual event state separate. Manga is ongoing; cutoff and future status open. |

## P3. Contradictions and claims retained open

| Topic | Source conflict or uncertainty | Handling |
|---|---|---|
| Nen affinity and proficiency | *Nen* r421055 presents approximate adjacency efficiencies and a categorical Specialist ability-use/creation boundary; some individual category labels elsewhere disagree. | Keep efficiency estimates separate from Specialist eligibility. Example: *Basho* r420788 has a page ability box/type field and narrative/wiki classification that do not align cleanly; do not resolve from anime/game labels. |
| Exam age and eligibility | *Hunter Exam* r419181 discusses broad eligibility; its note distinguishes a 1999 anime age statement. | Keep anime-only minimum-age wording out of the manga baseline. The pack's exact registration policy remains open. |
| Hunter privileges | *Hunter License* r405166 gives percentages, a loan, legal treatment and other access claims, but its own source is secondary and procedures are incomplete. | Quote no exact benefit as implemented. Verify direct chapters and fictional jurisdiction before using numbers or criminal-law outcomes. |
| License star criteria | *Hunter License* r405166 summarizes bylaw-based stars. | Do not treat star rank as combat strength, universal job grade or complete bylaws. |
| Chimera Ant population/history | *Chimera Ants* r419293 and related pages summarize biology and chronology; rare species, queen origin and spread vary by account. | Keep biology and timeline claims individually sourced; mark broad origins OPEN until primary review. |
| Meteor City population | *Meteor City* r419877 records an official-translation inconsistency: chapter 102 reports 80 million and chapter 105 corrects to 8–10 million, per the page. | Preserve both reports and correction; do not use population as a fixed mechanic. |
| Greed Island status | *Greed Island* r411117 calls it a game but also identifies a real-world island. | Keep interface fiction, physical location and body-risk rules distinct. Exact game-engine implementation is not inferred. |
| Basho type | *Basho* r420788: ability box lists Conjuration, while wiki character metadata and continuity tags call type unknown; the 2011 anime identifies him as Conjurer. | Leave unknown; manga is the represented baseline. |
| Late manga continuity | Succession Contest notes include a dated 2026 wiki snapshot, but source capture/current publication status is not a primary audit. | No claim that the series is complete or current through publication after the cited revision. |

## P4. Selected primary locators reported by the wiki

These are chapter/volume locators copied as references from the secondary pages, not chapters read in this run.

| Claim | Reported locator(s) |
|---|---|
| Nen introduction, aura and early teaching | *Nen* r421055 cites manga chapters 46-47 and related later explanations; *Wing* r416749 cites chapters 45-60 and 91. |
| Exam and license | *Hunter Exam* r419181 cites chapters 3, 146-147, 331, 346 and 349; *Hunter License* r405166 cites chapters 1, 35, 37 and 38. |
| Greed Island access/location | *Greed Island* r411117 cites chapters 69-70, 121, 123, 134 and 149. |
| Meteor City population correction | *Meteor City* r419877 cites chapters 102 and 105. |
| Association bylaw | *Hunter Association* r419296 cites chapters 12, 335, 341 and 383. |

## P5. Source acquisition and reading status

Supplied reader inputs report completed page reads, selected mechanic-section reads, narrative-only reads and unresolved scope review. Completion means the retained wiki page/selected spans were read, not that the manga or every wiki page was read. The wiki digest states earlier lane mappings remain unverified and snapshot coverage is secondary. The indexed whole-wiki corpus has 4,123 content pages; indexing/category closure is explicitly not full reading. The source manifest marks 701 character articles checked and lists seven supplemental text spans unread in `hunterxhunter_SCOPE_AUDIT.json`.

Primary manga was **not read in full** and no direct primary page/chapter was read during this synthesis. Private cached wiki payloads were spot-checked for the Nen, Hunter Exam, Hunter License, Hunter Association, Greed Island, Genthru and exam-arc pages. The page text cites chapter locators above. These are cached wiki payload spot-checks, not raw manga payloads.

## P6. Attribution and continuity boundary

Togashi's manga is the canon authority for manga continuity. Anime-specific material, films, game-only rules, databooks and wiki inference remain separate until selected and verified. The pack paraphrases, uses no copied panels or assets, and includes no raw source prose. Preserve repo LICENSE and project upstream attribution in any future implementation. Nothing in this ledger grants permission to redistribute franchise text or assets.

## P7. Source disposition for future rules

The `needs_scope_review` rows and seven unread supplemental spans remain open. Before any rule or character from those records becomes a runtime requirement, resolve its scope and pin the manga cutoff. A page revision, chapter locator or completed wiki-note read does not certify a full primary read.
