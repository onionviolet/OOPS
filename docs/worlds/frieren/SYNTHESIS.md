# Frieren world-pack synthesis (M5)

Status: research synthesis and authoring proposals. All mechanics, starts, data shapes, characters, plots, numbers and implementation choices are **proposals**. Source reports are secondary wiki claims with title/revision citations. This task edits only this new folder; no gameplay acceptance or runtime behavior is claimed.

The user’s canon-first tier request follows `docs/USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13`: anime/manga worlds join that tier, led by JJK, Bleach and Fate, with other rule-based/documented series ordered by source coverage. This pack records Frieren as a canon-first research candidate, not a priority-order change.

## 1. Sources and labels

- **Primary input for this synthesis:** `docs/research/power-systems/wiki-digests/full-dumps/workers/frieren-full/NOTES.jsonl`, 134 entries, created from the Frieren Wiki WikiTeam IA snapshot dated 2023-12-12. It is git-ignored and paraphrased. Core laws were spot-checked against retained private payloads under `~/.codex/research/wikis/frieren.fandom.com/dump/full-reading/cited-pages/`.
- **Earlier work:** [`DIGEST_frieren.md`](../../research/power-systems/wiki-digests/DIGEST_frieren.md) and its historical pre-dump addendum. The digest records blocked/no-revision acquisition at that earlier date; the recovered snapshot is new evidence and remains secondary.
- **Design authorities reviewed:** `CAMPAIGN_FRAMEWORK.md`, `WORLD_COMPLETION_TEMPLATE.md`, `WORLD_SECRETS_AND_DISCOVERY.md`, `WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md`, and access/start/earned-option/research/deeper-synthesis files in `world-depth-2026-10-13/`.
- **Eight-owner layout:** adapted from `docs/worlds/bleach/`: [brief](WORLD_BRIEF.md), [campaign](CAMPAIGN.md), [module catalogue](MODULE_CATALOGUE.md), [source ledger](SOURCE_LEDGER.md), [ability variants](ABILITY_VARIANTS.md), [interactions](INTERACTIONS.md), [GM prompt](GM_PROMPT.md), [implementation packet](IMPLEMENTATION_PACKET.md). This [M5 synthesis](SYNTHESIS.md) is the ninth owner requested for research routing.
- **Source labels:** “wiki reports” means a source fact in the dated secondary revision; “proposal” means a game design choice; “inference” is explicitly marked where used; “gap” means evidence is unavailable, especially after snapshot.

### Read coverage

The lane notes report retained-page reading for 134 rows, with bounded scope: 10 `full_page`, 52 `mechanic_sections`, 37 `narrative_only`, 29 `needs_scope_review`, and 6 `out_of_scope_noncharacter`. Full-page entries were “Offen Mountain Range” 5242, “Continental Magic Association” 6639, “Weise” 7212, “Spells” 14938, “First Class Mage Exam” 14828, “Appetit Region” 7230, “Bande Woods” 7231, “Laub Hills” 7232, “Ecology” 14559 and “Alt Woods” 14478. Mechanic-section entries were read by selected mechanism-bearing sections, not necessarily the entire page; narrative and review entries followed each note’s explicit retained scope. The notes were compiled using targeted page/section reads, not a full-series text search or full manga read. Core laws checked directly against private payload text in this task: “Spells” 14938, “Aura” 14618, “Serie” 14764, “First Class Mage Exam” 14828, “Turk Region” 14484, “Zart” 14943, “Tot” 14705, “Timeline” 14231 and “Frieren” 14471. **No manga volume/chapter was read in full.** Other note claims were synthesized from notes rather than rechecked against primary manga text.

## 2. Rules an engine would need to model

| Rule | Evidence | Proposed engine shape |
|---|---|---|
| Spells are effects created by consuming mana; they can be conferred or recorded | “Spells”, rev. 14938 | Proposal: track known and executable states separately, alongside actor eligibility, resource reserve, target and cost; validate before committing |
| Concealment changes what observers perceive | “Frieren”, rev. 14471; “Fern”, rev. 14749; “Flamme”, rev. 14594 | True mana and presented signal separated from observer skill, context and belief |
| Detection can be interrupted during casting | “Frieren”, rev. 14471 | Perception opportunity on a cast timeline; exact duration remains unknown |
| A historical case reports that public analysis made a dangerous spell counterable | “Beyond Journey’s End Arc”, rev. 14281; “Timeline”, rev. 14231 | Proposal derived from this case: versioned knowledge propagation by institution/region and actual communication |
| Some abilities have unusual constraints or catastrophic reversals | “Aura”, rev. 14618; “Zart”, rev. 14943; “Revolte”, rev. 14713 | Per-ability conditions, failure mode, environment, durability and counter; never generic “magic” |
| Two cases report observation before spell formulation and a costly spell transfer | “Turk Region”, rev. 14484; “Serie”, rev. 14764 | Proposal derived from these cases: provenance-bearing observations; specific transfer transaction and giver loss |
| In one training case, broad defensive coverage rapidly drains Fern’s mana; she identifies covering the threatened area at impact as the response | “Beyond Journey’s End Arc”, rev. 14281 | Proposal: model coverage and timing as tactical choices; do not assign a universal numeric cost |
| Curses and Goddess magic need a separate relation | “Spells”, rev. 14938; “Laub Hills”, rev. 7232 | Exact curse case, target, perception, applicable defense and specific dispeller; preserve contradiction |
| Exam stages have distinct conditions; one travel case has an early-treatment window | “First Class Mage Exam”, rev. 14828; “Alt Woods”, rev. 14478 | Proposal derived from these cases: stage-specific roster/deadline/failure or environment/early-treatment windows; neither is a universal progression or travel law |

## 3. Full catalog at a glance

| Family | Coverage | Neighbors | Conflict / coverage limit |
|---|---|---|---|
| Human mage spells | Mana spells, study, concealment, detection, barriers, defense, offense, utility | Grimoires, teachers, tools, public research | Wiki’s broad spell categories are partly fan-made; individual limits often absent (“Spells”, 14938). |
| Priest / Goddess magic | Healing, support, scripture, curse response | Blessings, belief, afterlife claims | Costs and theological truth not independently settled (“Heiter”, 14835; “Goddess of Creation”, 14930). |
| Demon magic | Individual specialized powers, mana reading, deception | Curses, control, combat | Do not generalize every ability across demons (“Demon”, 14737). |
| Warrior and weapon | Strength, endurance, named techniques, weapon-specific constraints | Armor, training, terrain, teamwork | Many move conditions/costs absent (“Stark”, 14497; “Eisen”, 14925). |
| Learning and institutions | Training, exam, spell privilege, research diffusion | Rank, access, records | Proctors choose distinct exam conditions (“First Class Mage Exam”, 14828). |
| Ecology and fieldcraft | Flora, fauna, terrain, venom, weather, shelter | Travel, local knowledge, preparation | Manga/anime depiction differs for some species (“Ecology”, 14559). |
| Afterlife and long memory | Aureole, beliefs, records and journey | Temporal starts, relationships | Communication mechanics and some claims are unknown (“Aureole”, 13994). |

## 4. Proposed data model

Proposal: stable world/continuity/era/region/entry/scenario IDs; separate actor body, species, learned methods, known spells, tools, sources, mana, skills, language, relationships, records and local access; spell definitions with user, target, observation, activation, cost, effect, duration, counter and transfer semantics; mana observation records with actor and confidence; regional public-knowledge versions; exact curse cases; exam contracts; and provenance-bearing field observations. These are document-level proposals, not registered formats or existing engine APIs. Keep unknown values empty/unknown until supported.

## 5. Rule-to-play mapping

Proposal: reuse ordinary work, travel, relationships, study, records and finite projects where existing engine owners can support them. Show separate states for heard of, observed, understood, practiced and executable. Keep mana as one resource, not an overall power score. A spell record does not grant execution when user eligibility, actual source, target or local conditions are absent. Exams show their live stage gates; public research updates only actors it reaches. A source transfer can alter both learner and teacher. Notebook records identify witness and confidence. These mappings require implementation and fresh-browser proof before any behavior claim.

## 6. Living beside the protagonist: candidate starts

No fan-fiction survey (M3) was run. The following are **proposed starts**, derived from source-access patterns and current canon-first/random-start direction, not fan premises: (1) village guide with local routes and no combat spell; (2) mage apprentice with one teacher and modest means; (3) Association clerk/proctor aide with institutional information but limited field ability; (4) priestly traveler with one scripture-based support method; (5) long-road artisan tasked with supplies and preservation. Each candidate needs compatible era/place/body, first usable action, actor-specific knowledge and committed random selection before eligibility. The player is not assumed to be Frieren, Fern or a canon party member. Later manga/anime character availability is a gap.

## 7. More to consider

- Proposal: source-faithful continuity starts plus separately labelled AU branches; no silent blend of adaptations or chronology.
- Proposal: relationship depth through labor, teaching, memory, birthdays, shared shelter and long absence rather than an affinity bar.
- Proposal: finite travel and research with actual costs, interruptions and uncertainty.
- Proposal: distinct access routes (direct start, local invitation, institutional exam, travel route) with their own knowledge and obligations.
- Proposal: accessible spell discovery and journal layers that distinguish player help from character-known facts.
- Proposal: no numerical mana power ladder unless primary evidence and a playable need justify it.

## 8. First playable slice proposal

**Proposal:** desktop/laptop-first, one Turk-region village and nearby forest. The visible outcome is a finite field study: accept a local exchange, search via habitat clues or a guide, observe a specimen, record it, then formulate/practice one utility spell and choose whether to restore the memorial or keep the knowledge private. Deferred: mobile optimization, later arcs, broader spell taxonomy, combat balance, post-snapshot events, time travel, exhaustive canon cast, native world travel and sealed/changed truths. The source anchor is “Turk Region”, rev. 14484; numbers and local people remain invented proposal details. The packet’s real gate would require rebuilt source, fresh-origin desktop browser, two routes, invalid early study, persistence if state changes, and Weibao’s human play acceptance.

## 9. Gaps that would change the design

1. **Post-snapshot primary source:** manga chapters and anime material after 2023-12-12 could change world state, available cast, spells, counters, chronology and appropriate first slice. This pack does not fill them from memory.
2. **Manga primary verification:** current evidence is a secondary wiki snapshot. Chapter-level reading could correct spell laws, timelines, conditions or actor claims.
3. **Curse rules:** the wiki makes broad immunity/dispelling claims but includes a distinct encounter; exact cases could change defenses and priest progression.
4. **Mana and spell costs:** exact costs, recovery, range, duration and thresholds are generally unquantified, affecting resource and combat design.
5. **Time/afterlife:** how long-lived actors age and whether/how Aureole permits communication could change chronology, relationships and endgame design.
6. **Continuity authority:** adaptation boundary and player start era need an explicit selected profile before a source-complete campaign is authored.

## Completion checklist and status

Core laws were directly checked against private payloads with title/revision locators; noted contradictions remain visible. Surprising notes were targeted where P2/P3 risks mattered. Reader files remain in their original git-ignored lane; they were not copied into the tracked world folder. Tracked outputs contain paraphrase, no raw prose and no quote over 15 words. The tracked folder is correctly separate from private research notes and contains source links by title/revision. No build, test or gameplay verification was required or run for this research task. No human acceptance is claimed.

Scope map against the completion standard is a proposal: S00 source/authority in this file and SOURCE_LEDGER; S01 overview and S02 start in WORLD_BRIEF; S03 roles, S04 systems, S05 learning, S06–S10 ordinary life/materials/places/people/relationships, S11 continuity, S12 access/travel, S13 threats/knowledge in CAMPAIGN and MODULE_CATALOGUE; S14 persistence/integration in IMPLEMENTATION_PACKET. This is not a completed S00–S14 detail ledger. All implementation consumers, exact detail IDs, native state owners and acceptance cases remain future work.
