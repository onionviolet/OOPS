# Lane G: researching, knowledge-making and shared functional skills, 2026-11-06

Round 3 of the [larger foundations](../LARGER_FOUNDATIONS_2026-11-06.md) reconcile pass. Weibao, 2026-11-06: "...Or researching? or group or other functional abilities that should be shared across all the worlds?" Everything here is a proposal (AD32); nothing is accepted or dispatched. No code was run or changed; claims carry one of three labels: **shown** (file:line read this pass), **stated** (an owner doc says so, not re-verified in code) or **inferred** (my reading). Sealed content was not read; secrets are referred to by route only. Codes: `G-F` findings, `G-O` outcomes, `G-S` seam parts, `G-K` skills, `G-N` more-to-consider.

## Step 1: reconcile

### What already exists (the headline)

Knowledge-making is not missing. It exists five times, once per world or system, with no shared name. The Study panel's own doc already says so: lessons "are research projects in everything except name" (stated, `docs/representations/RESEARCH.md` round 1).

| Mechanism | Owner (shown) | Importers | Worlds that use it | Shape |
|---|---|---|---|---|
| Study rows and panel | `research_content.js:1-12`, `research_view.js`, `research_home.js` (side-effect import at `ui_extras.js:21`) | 1 (view), 0 named (panel) | Frontier only: lever lesson, datum lesson (2 rows) | steps (evidence, understanding, practice), levels, partial findings, "opens" a power. A projection, saves nothing |
| Lesson seam (FD11) | `lesson.js:1-20` | 2 (`teacher_window.js`, `book_world_lotm_divination_method.js`) plus field_workshop, audited_workshop_facts, feature_expansion_content, field_ui, simulation_effects | Frontier craftsman, datum, Klein's divination methods | teacher window plus blockers, one instruction-basis knowledge fact, optional XP step |
| Inference and divination adapters | `cast_inference_adapter.js:15-77`, `cast_divination_adapter.js:1-12` | 2 and 3 (LOTM cast host, act engine, spell adapter, `knowledge_view.js`) | LOTM only | evidence keys, intentions (considering, active, postponed), signal status (signal, obscured, unanswered), "unclear rather than invented" |
| Claims with hypothesis tests | `claim_runtime.js:1-8` | 3 (`local_livelihood_content.js`, `structured_pack_*`) | Village livelihood, structured packs | claim names means (memory, divination, information, report, investigation, inheritance), precision, dependencies; stale only when a dependency fails; a test resolves from a hidden truth fact |
| Craft experiments | `craft_experiment_log.js:1-12` (6 importers), `craft_failure_ledger.js:1-8` (1), `craft_recipes.js` seeded discovery (6), `craft_reference.js` (3) | 6, 1, 6, 3 | HP brewing (`hp_brewing_state.js`, panel), Village crafting, runes, pattern book | trial log where `deduce` can only eliminate what was seen; failures keyed by consumed set; five states kept apart (learned, identified, reference access, payment, output) |
| Attributed accounts | `book_world_mol_lore.js:1-30` | 3 | MoL only | kind (document, observation, interpretation), origin, author, edition, language, confidence, coverage (missing, redacted, mistranslated, unread, superseded, observed) |
| Evidence DAG | `mistglass_inquiry.js:1-13` | 0 importers (domain-registered, inferred) | Mistglass (Frontier original) | observe, compare, residue, apply, each gated on played practice |
| Knowledge store | `people_knowledge.js:7-8` and the store `state.simulation.knowledge[actor][key] = {stage, value, at, cause, basis}` | 6 (people_knowledge) | all | stage seen, interpreted or understood; basis observation, recollection, instruction (with `sourceId`), inference (evidence, uncertainty), divination (method, queryId) (stated, `docs/representations/KNOWLEDGE.md`) |
| Knowledge-by-bargain | `lotm_formula_rows.js:1-5` (43 canon formula rows, 12 of 22 pathways), `lotm_craft_rows.js:117` | LOTM | formulas as process rows; "formula knowledge to be written" is a stated means |

### Reconciliation ledger

| ID | Pair or topic | Classification | Evidence and consequence |
|---|---|---|---|
| G-F1 | Study rows vs lesson seam | Compatible variant, incomplete integration | Rows describe lessons by command id and hand-copy minutes and wording (stated, RESEARCH.md item 12). Lesson seam has two thin helpers. A row for Klein's Old Neil divination lesson does not exist although `lesson.js:5-6` names it as consumer. Study panel therefore shows 2 Frontier studies and nothing for any book life (stated, RESEARCH.md item 10, L2) |
| G-F2 | Research palette (TK0-TK5, RV1-RV8, RQ1-RQ8, RU1-RU5) vs built | Stale root doc and genuine gap | `TECHNOLOGY_AND_PROGRESSION.md:121-126,541-575` is the richest design for fidelity, unattended work and fragments (stated). Only the two-bar idea is built. The palette's TK fidelity ladder disagrees with the built stage trio seen, interpreted, understood; a mapping is needed (see G-S3), not a second vocabulary (AD7) |
| G-F3 | Inference adapter vs Study projection | Duplicate shape in two homes | Both turn evidence into a partial finding with a stated certainty. The adapter exists only on the LOTM host (inferred from importers). The Study view reads completed commands, not inference intentions. The Knows home (`knowledge_view.js`) reads the adapter, so one projection already sees both (shown, imports) |
| G-F4 | Divination vs research | Compatible variant | `cast_divination_adapter.js:3` "No accuracy RNG here" and "answer will not settle" mirror research with no support. Divination is a fast, costly, noisy method; study is slow, cheap, reliable. Both write the same store. This is FD18's "reveal a fact" channel (inferred, FD18 table) |
| G-F5 | Claims (A2) vs MoL attributed accounts | Compatible variant | Claims carry means, precision, dependencies; MoL records carry origin, edition, language, coverage. Neither has the other's field. A text claim needs both (see G-S2). Different worlds invented them for different sources (inferred) |
| G-F6 | `craft_failure_ledger` | Incomplete integration | Header says "Not wired into live gameplay yet" (shown, `craft_failure_ledger.js:5-6`), one importer (`craft_ledger_domain.js`). A wrong recipe costing the player is built as a rule and not as a consumer |
| G-F7 | `lore_practice_*`, `lore_history_*` | Naming trap | They are Remainder "lore work" shifts and warnings (`lore_practice_content.js:1-12`, 4 importers on content) and the storylet outcome history (`lore_history_state.js:1-5`, 9 importers). Neither is lore, study or knowledge-making. Rename or label before anyone builds a library on them (inferred) |
| G-F8 | Skill ladders: `skill_records.js`, `skill_ladder.js`, `skill_discovery.js`, `ability_skill_rows.js` | Mixed | Records (1 importer) and ladder (1) are Frontier-only dials (`SKILL_DIALS` has only `base.frontier`, shown `skill_records.js:12-14`). `skill_discovery.js` is read-only presentation (3 importers). `ability_skill_rows.js` has 0 importers; with `ability_ladders.js` (0) it is built and unplugged (shown) |
| G-F9 | HP lessons vs FD11 | Incomplete integration, partly stale | `lesson.js:5-6` says HP classes are "not built". `world_packs/book_hp_life_data.js:35-37` already has `lesson_charms` school commands written by hand, outside `lesson.js` (shown). So the stale claim is the comment, and the real gap is that HP classes do not use the seam (inferred) |
| G-F10 | Social, stealth, language skills vs "everywhere" | Gap, not duplicate | `src/data/skills.js` has 65 skills (shown, grep). Present: Perception, Literacy, Medicine, Haggling, Herbalism, Alchemy, Crafting, Climbing, Swimming, Running, Meditation. Absent: persuade, deceive, read people, stealth, language, wayfinding. Frontier original content adds `frontier.trail_reading` and `frontier.shared_inquiry` (shown, `skill_expansion_content.js:5-10`). Social reading lives as world kit K31 subtext (stated) and `cast_topic_talk.js` jobs |
| G-F11 | Knowledge stages: WORLD_SECRETS 5 stages vs store 3 stages | Compatible variant | Secrets doc has unnoticed, sensed, suspected, known, usable (`WORLD_SECRETS_AND_DISCOVERY.md:36-45`). Store has seen, interpreted, understood. Mapping (inferred): sensed and suspected are seen or interpreted with an `uncertainty` basis; usable is a power or practice step, not a stage. Docs call B544 F2 "need not form a compulsory linear ladder" (stated) |
| G-F12 | Appraisal | Compatible variant | MEANS_AND_APPRAISAL owns levels and types (`#Appraisal levels`, stated). Code: 34 files mention it, mostly character-sheet and item-card display, `combat_situation`, `opponent_board`; cheat `true-appraisal` card with freshness (`information_freshness.js:1-8`, 1 importer). No world-neutral "appraise a thing" verb exists; Haggling XP lives in `native_trade_transaction.js` |
| G-F13 | MoL loops and notes | Incomplete integration | RETENTION_RESET_SEAM carries `carry` entries with class soul-bound, carried, reset and a named carrier such as "a notebook" (stated, lines 44-47). A notebook as a lose-able object that holds claims does not exist; the knowledge store is the player's, not an item's (inferred) |
| G-F14 | Library and archive | Gap | 45 src files mention library or archive; none is a place with access rules for reading. `institution_access.js` (1 importer, MoL) is the right owner (stated, larger foundations). MoL academy library is the first likely consumer (inferred) |
| G-F15 | Writing and publishing | Gap | `gameplay_publication.js` is a transaction publisher (XP/inventory snapshots), unrelated to authored works (shown, `gameplay_publication.js:1-6`). MR29 lists "publication" in the shared envelope (stated) but no player treatise exists. Reads carry a `sourceId`, no text record (stated, KNOWLEDGE.md KR5) |

### Verdict on the existing rules

Binding rules already cover most of this: MR6 free experimentation, MR7 formulas as attractors, MR10 record only what was demonstrated, MR3 freeze on reveal, SLR4-SLR6 (every gain has a cause, feedback is a means), SLR14-SLR18 (teaching, transactions, texts are claims), SLR28 error is learnable, ACR5 progress the character can know, AD6-AD8 (means decide, own stats exact), AD51 (share when two worlds plausibly use it). No new principle is needed. The gap is a seam that joins five working mechanisms.

## Step 2: deepen backwards

Seven target outcomes, each worked back to what the player sees and does, state, owner and gap.

### G-O1 Klein researches a ritual in the library and gets a partial, risky answer

- **Sees:** a Tingen library desk (access by card or sponsor), a text with an edition and a damaged page, a Study entry "ritual of X: seen, 2 of 4 steps understood, one claim marked doubtful", a choice to try an offering with the part they do have.
- **Does:** pays access, spends hours reading, cross-checks a second source, tries the partial rite at a cost.
- **State:** access (`institution_access`), text records with coverage (MoL shape), knowledge entries with inference basis, one open claim. The attempt writes cost and a result.
- **Owner:** knowledge store plus `cast_inference_adapter` plus `cast_divination_adapter` for the rite itself (shown, LOTM host).
- **Gap:** no reading verb for LOTM; the Study panel shows nothing for the Tingen life (G-F1); the library has no access rules (G-F14). A wrong or partial rite that costs something is the stated fairness aim (ABR, AD9) but `craft_failure_ledger` is unwired (G-F6).

### G-O2 Harry studies for an exam and a friend helps

- **Sees:** Study entry "Charms, first-term practical" with levels, a note "Hermione can explain it", a posted timetable.
- **Does:** attends (FD15 enrolment, FD8 slot), practises, asks a friend, takes the exam.
- **State:** a position (class term), lesson transactions (FD11), a peer as a source with her own means (SLR15: teachers teach only what they hold), an exam as a graded check with a recorded outcome.
- **Owner:** `lesson.js` plus FD15 positions plus `check_contract` for the exam.
- **Gap:** HP lessons are hand-built commands (G-F9); no peer-teaching; no exam record; houses and points absent (HG2, stated in round 2).

### G-O3 A Mother of Learning looper keeps notes across loops

- **Sees:** a notebook with dated entries, each tagged "seen on day 4, loop 3", some marked stale because the world diverged; a page lost when the bag burned.
- **Does:** writes, rereads, tests an old note against today, replaces it.
- **State:** claims with `dependsOn` (shown `claim_runtime.js:1-8` "stale only when its own dependency stops holding") and a carrier item for those that live in paper instead of memory; carry class from the retention seam.
- **Owner:** claim_runtime plus `harm_loops` carry rows plus an item for the notebook.
- **Gap:** the notebook is not an object (G-F13). A day stamp on foreknowledge is proposed in the retention seam (stated, `staleness` field). This is the second world that needs per-claim staleness, which meets the AD51 test for sharing it.

### G-O4 A Village herbalist experiments with a new remedy

- **Sees:** a trial table (materials, dose, what showed), an elimination hint ("not the bark; maybe the root"), a failed batch recorded with why.
- **Does:** varies one factor, tries it on a willing patient or herself, records.
- **State:** `craft.experiments@1` log, failure ledger, body treatment (`craft_body_treatment.js`), `home_medicine.js` (4 importers).
- **Owner:** craft engine (shown).
- **Gap:** the log and ledger are crafting-engine local; their trial output does not become a Study entry or a claim (G-F3). The ledger is unwired (G-F6). Medicine as a skill exists but is read by 2 files only (shown, grep).

### G-O5 A cultivator derives a technique variant

- **Sees:** a technique they hold, a "variation" project: change one element, with a stated risk (qi deviation), a mentor's notes as a source, partial insight each session.
- **Does:** meditates, tests in small, accepts a degraded result at first, then a named variant.
- **State:** a new technique row frozen on reveal (MR3), derived from an old one; ability row with source, cost and drawback; an insight draw from seeded streams (SLR32).
- **Owner:** `techniques.js` (30 importers, shown) plus `structured_ability_runtime` plus MR6/MR7 (attractor, degraded version).
- **Gap:** craft has seeded discovery for recipes (shown `craft_recipes.js:1-6`) but techniques have no equivalent; a variant is a row authored by hand.

### G-O6 A player writes a treatise that others read

- **Sees:** a work with a title, a claim list (what the author actually held), a copy count, a reader's reaction, a payment or a rumour.
- **Does:** drafts from knowledge they hold (only what they know, AD6), chooses audience and risk (a forbidden idea), publishes or leaves it unfinished.
- **State:** a text record (same shape as MoL accounts, so it can be misread, mistranslated or superseded), copies as items, readers' knowledge entries with `sourceId`.
- **Owner:** none. Closest: attributed accounts (MoL), `institution_store`, `reputation.js` (1 importer, shown).
- **Gap:** G-F15 entirely. Also a proper consequence: forbidden teaching has in-world enforcers (SLR33, stated).

### G-O7 A teacher who withholds

- **Sees:** an NPC who answers "not yet" with a reason that fits their motive; a price in coin, errands or standing; a test before the next lesson.
- **Does:** negotiates, completes a task, or finds another source.
- **State:** lesson transaction (SLR16 stated) with consent and price, availability window plus blockers (shown `lesson.js:9-13`), teacher's own means (they teach only what they hold).
- **Owner:** `lesson.js` (shown), `teacher_window.js` blockers (shown: busy, irritated, away).
- **Gap:** blockers are scheduling reasons only; a motive-based withhold, a price tier or a prerequisite test is not in the helper (inferred). No NPC with a "guarded method" keeper (SLR16 names it, stated).

## The shared research seam (proposal)

### G-S1 One question record, projected first

The Study decision of 2026-10-30 holds: projection first, no new state until a second mechanism needs it (stated, RESEARCH.md). That condition is now met by claims, inference, craft logs and MoL accounts (shown in the table above). Proposal: a small `inquiry@1` slice, stored only when an inquiry is open, and everything else stays in its current owner.

| Field | Meaning | Existing owner it points at |
|---|---|---|
| question | what the character wants to find out, in their words; may start as an anomaly (RQ1) | knowledge entry or claim id |
| method | one of: read, observe, experiment, ask, derive, divine, translate, compare | commands already authored per world |
| sources | texts, people, places, instruments, each with access and a coverage tag | `institution_access`, MoL record shape, lesson teacher |
| effort | minutes, materials, attention kind (unattended or needs a judgment, RV1) | native jobs, FD8 slots |
| partial result | a knowledge entry with stage and a plain certainty word (seen once, repeated, confirmed by others, RU3) | knowledge store, basis kind |
| risk | what a wrong or early answer costs | failure ledger, harm state, standing |
| output | a knowledge fact, a claim supported or refuted, a power or recipe row, a lesson to teach | knowledge, claims, `learned`, `opens` |

Default: an inquiry stores no truth. Hidden answers stay in the owner; the record holds method, effort, coverage and the keys it wrote. Dial: a world may use just the method list it has. Reason: AD7, AD6, sealed-secrets rule.

### G-S2 Source access and coverage as one small vocabulary

Merge the two vocabularies already built into one, not a third: MoL's `coverage` (missing, redacted, mistranslated, unread, superseded, observed) and claims' `means` and `precision`. A text row declares who wrote it, what it claims, which language it is in and what part is readable now. A book you cannot read yet is a text with `unread` or a language gap; a teacher who withholds is a person-source with a blocker; both are the same row family, differing in `means`.

### G-S3 Fidelity words map onto the store, not a new ladder

| Palette word (TK) | Store state (shown, KNOWLEDGE.md) | Study level word |
|---|---|---|
| TK1 rumour | seen, basis recollection or instruction, low certainty | Curious |
| TK2 concept | interpreted | Seen or Checked |
| TK3 principle | understood | Explained |
| TK4 recipe | understood plus a `learned` row | Practised (first attempt) |
| TK5 mastery | skill XP and fluency, not knowledge (SLR1) | Practised (reliable) |

Teaching moves fidelity imperfectly (TK note, stated); lesson transactions already set stage to `understood` by default (shown, `lesson.js:17`). Proposal: a lesson may set a lower stage when the teacher's own hold is lower.

### G-S4 Experiments, wrong theories and costs

- Reuse the craft pattern for any domain: a log of trials where deduction only eliminates what was seen (shown `craft_experiment_log.js:3-6`).
- A wrong theory is an `interpreted` entry with an uncertainty basis that the player can act on (stated, secrets doc "a wrong reading can sit at stage 3 and get acted on, with consequences"). A refuting test marks the claim refuted (shown claim_runtime `hypothesis`). The cost comes from the action taken, not from the theory (AD38).
- Free experimentation always resolves to some outcome (MR6); near misses produce degraded versions (MR7), far attempts produce originals, frozen on reveal (MR3).
- Variance comes from seeded streams so reload cannot reroll a breakthrough (SLR32, ACR9).

### G-S5 Teaching, publishing and passing on

Teaching is a method (`ask`) with a teacher as source. Publishing is the same record written outward: the author's held claims become a text row that others read with their own means and coverage. Lessons and treatises are one thing seen from two ends. SLR23 (methods outlive the learner) is the reason both exist. Shared: record shape, source id, copy as item. Local: price, law, guild, press, school.

### G-S6 Funding and access

Access to a source is a cost or a standing, not a permission screen: membership (`institution_access`), a reader's card, a sponsor, a bribe, a stolen key. Funding is a purse effect (FD6) on a method, with a bounty or commission as the origin of a question (RQ2, RQ5). Group research: partners are actors with their own means and report route (ACR10); their finished search is not instant player knowledge. Slots come from desks, assistants and instruments (RV5), not a global cap.

### G-S7 Tie to FD18 and FD11

- FD18 "reveal a fact" channel (shown, FD18 table) becomes the **fast, costly method** of the same inquiry: output shape identical, certainty and cost differ. A new ability row that targets this channel adds a method, not a new subsystem.
- FD11 lesson is the **instruction method**: a teacher source with availability, a price and a gain. `lessonEffects` already writes the instruction basis (shown); G-S3 lets it set a lower stage for a weaker teacher.
- FD15 positions give classes and library membership a term and exit; FD16 event director can raise a question from an anomaly or a rumour (RQ1, RQ4).

### AD51 split test

Shared if two or more worlds plausibly use it (AD51, stated). Checked against worlds already in the repo, not against canon I have not read.

| Piece | Frontier | LOTM | HP | MoL | Verdict |
|---|---|---|---|---|---|
| question, method, effort, partial result, output | lessons | divination and rites | brewing trials | lore, loops | **Shared** (4 of 4 have a version, shown) |
| text with coverage and edition | notes | records (`lotm_records_*`) | school books | lore reader | **Shared** (inferred for HP) |
| fidelity words and certainty | study levels | signal status | assays | confidence | **Shared**, mapped |
| trial log and elimination | craft | craft rows | brewing | - | Shared by craft families (2 worlds shown) |
| formulas, spells, pathway names | local | local | local | local | **Local** (AD46) |
| who can read what, price of a library | local | local | local | local | Local, the access mechanism is shared |
| language list and translation rules | local | local | local | local | Local; one coverage tag shared |
| skill numbers, XP curves, rust dial | local | local | local | local | Local (SLR7) |

Each use declares differences (WA55). A second world validates the seam: the first cut should be Frontier Study plus LOTM (the Tingen reading), because that pair already differs in method (lessons vs rites).

## Shared functional abilities (non-combat)

### G-K Proposal: a short channel list, mapped from local nouns

Do not add eight native skills. Add a `channel` tag on skill and ability rows so worlds map their nouns onto a shared set. Skill numbers, XP curves and names remain local (AD46, SLR7). Mastery improves control, not truth (MR21): fewer steps, narrower variance, better cues.

| ID | Channel | Does | Existing seam | Shared | Local examples (inferred) |
|---|---|---|---|---|---|
| G-K1 | Perceive | notice clues, hidden things, impostors | Perception skill, observation lens, ABR19 look/seenBy | check shape, "notice" output as a knowledge entry | Spirit Vision, Presence sensing, charms, Gu sense |
| G-K2 | Read (text and language) | decode text, speak and understand a language | Literacy skill, MoL `language` and `coverage` | coverage tag, cost per unread page | archaic Jotun, wizarding runes, cipher |
| G-K3 | Inquire | form and test a hypothesis, cross-check sources | claim_runtime, craft log, inference adapter | G-S1 inquiry record | divination, brewing trials, cultivation insight |
| G-K4 | Read people | subtext, motive, lies, status cues | K31 (stated), `cast_topic_talk.js`, FD10 | one "reading" returns an attributed impression, never certainty | Spectator, Legilimency |
| G-K5 | Sway | persuade, bargain, deceive, intimidate | Haggling XP in trade (shown), conflict_frame as an intimidation hook (inferred) | a contest between two sets of means; result is an attitude fact and a cost | etiquette, bribery, vows |
| G-K6 | Conceal | stealth, disguise, keeping a secret | none (G-F10) | detection as a contest vs Perceive; the loser leaves a trace | cloaks, Marionette, Veil spells |
| G-K7 | Make and appraise | craft, repair, judge quality and origin | Crafting skills, craft engine, `item_card` display | MR rules; appraisal = reading a source with means (AD6, MEANS_AND_APPRAISAL) | potions, wands, alchemy |
| G-K8 | Heal | treat body, diagnose, nurse | Medicine skill, `home_medicine.js`, `craft_body_treatment.js` | body treatment with real people; no instant heal | healing potions, church rites |
| G-K9 | Travel | wayfinding, camp, cross terrain | Climbing, Swimming, Running; `frontier.trail_reading` | route legs, hazards, supply | portals, ferries, sect flight |

Rank by payoff for the next work: G-K3, G-K4, G-K2, G-K6, G-K5, then the rest. G-K1, G-K7, G-K8 and G-K9 mostly have an owner; their gap is a world mapping, not a mechanism.

### Where each channel plugs in

- A channel tag lets a lesson, a book or a cheat say which kind of competence it grants (SLR8: name the layer).
- A contest between channels (Conceal vs Perceive, Sway vs Read people) is the "pair of means" from MEANS_AND_APPRAISAL (counters are means too, stated). Not a stat race; the loser learns something.
- XP stays native (`{type:'xp'}` effects, 36 files shown) and the cause field distinguishes practice, instruction, text, failure (SLR4).

## More to consider, round 1

Labels follow the repo's palette convention. Effort: S (hours), M (day), L (days). Each has a done check.

### ACT NOW (this doc)

- **G-N1** Name the trap: `lore_practice_*` and `lore_history_*` are not knowledge-making (G-F7). Done: this doc says so; no code rename.
- **G-N2** Fix the stale pointer: `lesson.js:5-6` says HP classes are "not built" while `lesson_charms` commands exist (G-F9). Done check for the future patch: the comment names the real status. (Not edited here; the lane was doc-only.)
- **G-N3** Record the trigger that was waiting: Study decision said "state when a second mechanism needs it". Four mechanisms now do (table above).

### ACCOUNT FOR NOW

- **G-N4 Notes are objects.** Notes can be lost, burned, stolen, copied or forged. Account in `inquiry@1` that a text may be an item with a custody chain, so MoL's notebook carrier (G-F13) and a stolen treatise (G-O6) share one shape. Cost of ignoring: a second custody system later.
- **G-N5 A claim has an owner.** The same fact can be held by Klein, a rival and a church with different confidence. Store holds per-actor entries already (shown, `knowledge[actor][key]`); the inquiry record must name the actor, or an NPC research partner cannot exist (ACR10).
- **G-N6 Teachers hold a method at a stage.** A teacher who understands X at stage `interpreted` cannot teach `understood`. Account for it in G-S3 and SLR15; it also gives "the teacher is wrong" a mechanism.
- **G-N7 Information hazards.** Some answers cost the finder (MEANS_AND_APPRAISAL `#Information hazards`, stated). The `risk` field must be able to hold "knowing is the cost", with the sealed-secrets rule on the reveal route.
- **G-N8 Read aloud / share a note.** Giving a note to a partner copies a claim with its source and coverage; the partner's copy can be misread by them. Copy preserves the edition (MoL `copyOf`, shown). Cost of ignoring: duplicated truths that drift.
- **G-N9 Unattended study stops for a named reason** (RV1, RV2, ACR8). Reading and repetitive testing run while away; a judgment call waits and says so. Fits the offline clock work already in place (inferred).
- **G-N10 Anomaly intake from other seams.** A rumour (FD16), a failed batch (G-F6), a customer's impossible order (RQ2) open inquiries by emitting a question, not a quest. Needs the FD16 emitter list to include "raise a question".

### LATER

| ID | Idea | Level | Effort | Done check |
|---|---|---|---|---|
| G-N11 | Fill Study rows for LOTM (Old Neil divination lesson, one rite) | Sonnet | S | row lint passes against the registry; Study panel lists the lesson in a Tingen life; screenshot at 1920 by 1080 |
| G-N12 | Library desk for MoL academy via `institution_access`: access plus reading time plus one `unread` text | Sonnet | M | read with a card gets text, without it is refused with a reason; save, reload, import |
| G-N13 | `inquiry@1` slice, schema and validator, one consumer each from Frontier and LOTM | Opus design, Sonnet build | M-L | two worlds' inquiries open, partial, finish; migration; no sealed content in the receipt |
| G-N14 | Trial log shared by HP brewing and Village herbal remedy; failures surface as Study findings | Sonnet | M | a failed batch is visible as a finding with its cause; the ledger is wired (G-F6) |
| G-N15 | Teacher withholds: price, test, motive blocker added to `lessonAvailability` | Sonnet | S-M | an unavailable teacher cites a motive that the lead can learn; paid lesson settles once |
| G-N16 | Notebook item for MoL with claims and loss | Sonnet | M | burned notebook loses its page-claims, memory-carried claims remain |
| G-N17 | `channel` tag on skills and ability rows plus a coverage printout | Sonnet | M | every channel shows which worlds map it (like FD14's authored, palette, missing) |
| G-N18 | Conceal vs Perceive contest returning a trace | Opus design | M | stealth attempt leaves a witnessed fact; reload does not reroll |
| G-N19 | Treatise: text row from held claims, copies, readers | Opus design | L | author can publish only what they hold; a reader's entry names `sourceId`; a mistranslated copy is wrong in a visible way |
| G-N20 | Technique variant derivation (MR6/MR7 for abilities) | Opus design | L | near-miss makes a degraded variant, frozen on reveal |

## More to consider, round 2 (genuinely new angles)

- **G-N21 Study as a diegetic ledger of what you do not know.** RU4 known unknowns: only questions the character has noticed. Keeps AD6 and gives the player a to-do list that is in-world (ACCOUNT FOR NOW, S; `known unknown` is a status of a question, not a fact).
- **G-N22 Coincidence of methods.** If two methods give the same answer (divination and a library check), confidence rises; if they disagree, the disagreement is a finding (ACCOUNT FOR NOW, M). It is cheap because both write entries to the same key.
- **G-N23 Teacher quality is not a rank.** A famous teacher can give a worse lesson than an obscure one (SLR19, rank and competence separate). Choose a source by what they hold, not by title (LATER, S).
- **G-N24 Research across a life change** (death, loop, transmigration): carried understanding follows memory, notes follow custody (SLR20, AD11). Done check: a run ends, a note in a bag does not carry, a memory does (LATER, M, with G-N16).
- **G-N25 Language as coverage, not a skill bar.** A language adds readable parts of texts and speech, with a `partial` band, so "I can follow the gist" is a real state (ACCOUNT FOR NOW, S).
- **G-N26 Duplicated work between partners.** Two researchers pursuing the same question should be told, not charged twice. A partner report names the key it wrote (ACR10; LATER, S).
- **G-N27 A bad source can be useful.** A forged note teaches the forger's purpose; a refuted theory narrows the next trial. Count "refuted" as progress in Study (ACR5: effort, coverage, completion, success kept separate) (ACT NOW as a rule in the seam, S).
- **G-N28 Reading speed is a body dial.** Eyes, light, ink, stamina, fatigue after a long session (SLR12). Ties research effort to the body clock, which already exists (inferred).
- **G-N29 Cost of verification.** Checking a rumour has a price (travel, standing, danger). The cheap default is "told by a person" with a low certainty; the costly route is testimony verified (LATER, M).
- **G-N30 Peer review as an in-world agent.** A rival scholar, a church censor or a guild can contest a published claim; consequences come from agents with reasons, not game blocks (SLR33, AD38).

## Open points for Weibao

- **Q1** The Study panel names Frontier only. Is the first book-world row (Klein's Old Neil lesson or a library desk) the next slice, or does FD15 positions come first? My default is the lesson row, because it needs no new state and proves the panel on a second world.
- **Q2** `inquiry@1` waits for G-N13. No question needs an answer to continue; the default is to hold it until two consumers exist.

## Evidence

Read this pass: `src/research_content.js` (whole), `src/research_home.js` (whole), `src/lesson.js` and `src/teacher_window.js` (whole), headers of `cast_inference_adapter.js`, `cast_divination_adapter.js`, `claim_runtime.js`, `craft_experiment_log.js`, `craft_failure_ledger.js`, `craft_reference.js`, `book_world_mol_lore.js`, `mistglass_inquiry.js`, `people_knowledge.js`, `skill_records.js`, `skill_ladder.js`, `ability_skill_rows.js`, `lore_practice_content.js`, `lore_history_state.js`, `information_freshness.js`, `book_world_lotm_divination_method.js`; docs `LARGER_FOUNDATIONS_2026-11-06.md` (whole), `ACTIVITY_ABSTRACTION_RULES.md` (whole), `representations/RESEARCH.md`, `MAKING_RULES.md` (grep), `DOMAIN_RULES.md` SLR table, `TECHNOLOGY_AND_PROGRESSION.md` (TK, RV, RQ, RU rows), `WORLD_SECRETS_AND_DISCOVERY.md` (stages, skills table), RULES_INDEX AD lines. Importer counts come from `grep -l "from './name'"` over `src/*.js` on the working tree (other sessions' uncommitted edits present). Not read: `techniques.js` internals, `ABILITY_AUTHORING.md` and `ABILITY_RULES.md` bodies (headers only), `PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md` (no content read), `MEANS_AND_APPRAISAL.md` body (headings only). No tests, build or browser run.
