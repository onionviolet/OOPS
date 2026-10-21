# DG-A1: Harry Potter rule grammar from existing private notes (2026-10-19)

**CHECKPOINT:** Lane DG-A1 of [DG1 to DG30](../../WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md). Doc lane, one new file, written
2026-10-19 from the existing private derived notes. No raw novel text was opened, nothing was acquired, nothing was committed. Status:
**proposal**. Nothing here is an accepted decision, a canon claim or an implemented rule. Rows use Default + Dial + Reason framing; a
"derivable now" verdict means a derivation has an authored locator today, not that the grammar is complete.

Committed-safe by construction: paraphrase and locators, no source text, no long quotes (DG30, standing research rule). HP is a
public franchise; no sealed secret truth is used or implied (DG25).

## 1. Reading basis and an honest thinness verdict

These existing notes were the whole basis. Short keys appear in the locator column.

| Key | Private note (gitignored, under `docs/research/novels/harry-potter/`) |
|---|---|
| CCE | `craft-integration-2026-10-12/CANON_CRAFT_EVIDENCE.md` (CCF01 to CCF15, G1 to G5) |
| SRE | `craft-integration-2026-10-12/SPECIAL_RULES_AND_EVERYDAY_CONSEQUENCES.md` (TT-C, PJ-C, PJ01 to PJ07, ER01 to ER12) |
| BSS | `craft-integration-2026-10-12/BRANCHES_SPELLCRAFT_AND_SCALE.md` (SCF01, SCF02, SP01 to SP08) |
| FCT | `craft-integration-2026-10-12/FEATURE_CONTRACTS.md` (HP-C01 to HP-C20) |
| SRL | `craft-integration-2026-10-12/SOURCE_READ_LEDGER.md` (what was actually read) |
| WAL | `world-audit-2026-10-11/SOURCE_CONTRACT_AND_LEDGER.md` (P01 to P07 author-writing claims, C-rows) |
| WAO | `world-audit-2026-10-11/ORIGINS_ERAS_BODIES_AND_OPENING.md` and `WHOLE_WORLD_COVERAGE.md` |

Public owners also read: [craft research REPORT](../../gm/dispatch/harry-potter-craft-research-2026-10-12/REPORT.md),
[source ledger](../../worlds/harry-potter/SOURCE_LEDGER.md) (H6 to H8, wand pages), [b9 PATTERNS](../../gm/dispatch/body-lineage-2026-10-14/b9/PATTERNS.md)
and [SRC_harry-potter](../../gm/dispatch/body-lineage-2026-10-14/b9/SRC_harry-potter.md) (HP1 to HP4), CP1 to CP5 in
[RULES_FROM_SCRATCH](../../RULES_FROM_SCRATCH.md#cross-world-audit-precedent-special-rules-and-little-details-2026-10-12),
[CRAFTING_ENGINE Round 7](../../CRAFTING_ENGINE.md) (IX3, IX5, IX7, IX22, IX24), TQ2, TQ7, TQ12 and
[AU1 to AU15](../../AGENT_USAGE_RULES.md).

**Thinness verdict (plain).** The prior dispatch was a craft and consequence audit, not a grammar audit. Its fifteen canon facts are
about potions, herbology handling and two spell scenes. Consequences:

- **Potions and herbology:** rich enough for operation vocabulary, ordering constraints, stated and shown failures, and claim reliability.
- **Spells:** thin. Two scenes (BSS SCF01 feather practice, SCF02 an unknown marginal spell) plus one author-writing wand ledger. The notes
  do not record incantation texts, spell name lists, or a spell taxonomy. Name morphology (DG1) for spells is therefore a named gap, not a
  derivation.
- **School structure:** subjects and electives come from author writing (WAL P04), not scenes. House structure, exam levels and year-by-year
  syllabus are not in the notes at all (a search of the world-audit and craft notes finds house solely in house-elf context).
- **Counters:** a handful of cases, no table. Textbook text itself was not extracted into the notes; teacher and character claims were.

A derivation built on these rows would be small and honest. It would not yield a spell grammar.

Evidence labels: **SHOWN** the narrator depicts an event; **STATED** a character or author-writing claims it (attributed, may be wrong);
**INFERRED** this audit or an earlier worker infers it; **MEMORY** general franchise recall not recorded in any note (a lead, not a
basis for a derived entry until a gap read supplies a locator).

## 2. Grammar rows

Columns: pattern in my words; evidence and locator; scenes; exceptions or contradictions; proposed derived tags or axes (all proposals,
aligned to IX3 relation graph, IX5 tiers, TQ tag kinds); reader (GR12, a consumer must exist); verdict. "Derivable now" means a locator
exists in the notes. "Gap" means a bounded raw read is named in section 5. "Not derivable" means the notes cannot support it and a read
would not obviously fix it.

### DG1: name morphology

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G1.1 | Potion names are usually descriptive of function or form (a remedy named for its target ailment, a solution named for its effect, a draught named for its purpose). | INFERRED from the potion names recorded in CCE CCF04, CCF09, CCF12, CCF14, CCF11 and SRE PJ-C1; names only, no morphology claim in any note | B1 ch.8; B3 ch.7; B5 ch.12; B6 ch.9 | Polyjuice reads as a coined compound; the hair product is a brand; Wolfsbane borrows a plant name (SRC_harry-potter HP2); so the descriptive pattern is a tendency. | A soft `effect_family_hint` on the recipe record, flagged GENERATED with row id (DG10), not an effect (DG13). | Recipe search and the experiment notebook (DG16, IX24) | **Derivable now**, low confidence, hint only |
| G1.2 | Spell names: the notes record almost none; the two spells in scenes are a levitation application (name not recorded) and Levicorpus (SCF02). | BSS SCF01, SCF02 give effect and recovery, not name structure. MEMORY: many names look Latinate and a spell and its release sometimes share a stem. | B1 ch.10; B6 ch.12 | Unknown. SCF02 explicitly says the effect and target could not be predicted from the incantation alone. | None. | None until a gap read | **Gap G-A** (name, stem, counter pairing in the two scenes) |
| G1.3 | Ingredient and plant names are mostly ordinary or lightly coined botanical and animal terms (mandrake, knotgrass, fluxweed, dittany, bubotuber and so on). | INFERRED from CCE CCF05, CCF06, CCF10, CCF15 | B2 ch.6; B2 ch.10; B4 ch.13; B7 ch.14 | Same name can mean a living plant, a harvested part or a processed lot (form, TQ4). | Names key the material record; morphology adds nothing the table lacks. | None | **Not derivable** (no property is carried by the name) |

### DG2: performance structure

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G2.1 | A spell cast has separable parts the source treats as different facts: instruction, movement, pronunciation, target, tool. The teacher stresses movement and pronunciation; a practiced demonstration succeeds where early attempts fail. | SHOWN BSS SCF01 (book-01.txt 4601 to 4671); STATED the teacher's emphasis and anecdote | B1 ch.10 | One spell's practiced execution is not a global phonetic grammar (SCF01 own caveat). | `part` list on a spell record: `acquired`, `read`, `practiced`, `executed` (CP2), plus `target`. Weights unset. | Knowledge stages and the practice loop (SP01) | **Derivable now** as a part list; weights not derivable |
| G2.2 | A spell can be attempted nonverbally and without deliberate target selection, with an unintended but concrete effect, then ended by a searched counter. | SHOWN BSS SCF02 (book-06.txt 8124 to 8207); STATED Hermione's objection to trying unknown instructions | B6 ch.12 | The invented-spell authorship is Harry's inference. Nonverbal eligibility is not universal. | `target_selection` and `counter_known` as separate fields; unknown-instruction use carries a stated failure mode (DG15). | Experiment notebook (DG16); SP03 | **Derivable now**, one scene |
| G2.3 | Wand or tool is a channel with variable quality, not a gate; wandless casting is acknowledged. | STATED HPL H6 to H8 (official pages, not scenes); BF1 correction in HPL | none in the notes | Specific loyalty and disarming cases are not universal (HPL H8 caution). | `tool_quality` as an axis feeding execution, not a boolean `requires_wand`. | Execution resolver (future) | **Derivable now**, supplement-qualified (C-X) |
| G2.4 | A potion performance is a sequence of physical operations: preparation (weigh, crush, stew), ordered additions, stir counts and direction, heat state, timed simmer, cue check, bottling. | SHOWN/STATED CCE CCF03, CCF04, CCF12, CCF13, CCF14 | B1 ch.8; B5 ch.12; B6 ch.9 | A violated hard step is not rescued by general skill (CCF12). | Operation vocabulary list per world (WR2): `prepare`, `add`, `stir`, `heat`, `rest`, `observe`, `bottle`. | Craft resolver stage list; HP-C05 staged brew | **Derivable now** |
| G2.5 | Herbology performance is protected handling then harvest then a consumer, with the handler needing gear and the specimen staying school property. | SHOWN CCE CCF05, CCF10 | B2 ch.6; B4 ch.13 | Handling rules are specimen specific (young plant cries versus pus); no universal gear rule. | `handling` tag kind (TQ2) with a per-specimen protection requirement. | Greenhouse action gates (HP-C12) | **Derivable now**, per specimen |

### DG3: category structure

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G3.1 | The school splits instruction into named subjects with first-year and elective layers. | STATED WAL P04 (author writing); the draft note there names a different syllabus; WAO S07 says no complete spell or potion list | author writing, not a scene | Draft versus finished syllabus disagree; scene confirmation absent. | `subject` as a tag family on lessons and methods. | Study schedule and teacher availability (S07, S11) | **Derivable now** as labels; law-family differences between subjects **not derivable** |
| G3.2 | Products fall into ordinary consumer classes: remedy, cosmetic, protective novelty, household good. | SHOWN CCE CCF10, CCF11, CCF15; FCT HP-C13 to HP-C15 | B4; B5; B6 | Class membership is my grouping (INFERRED), not a source taxonomy. | `product_class` tag (INFERRED, flagged). | Commission and shop lists | **Derivable now**, inferred |
| G3.3 | Houses, teams and year groups as categories that change rules. | none in the notes | none | n/a | none | none | **Not derivable** from these notes; **Gap G-F** if wanted |

### DG4: formula shape

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G4.1 | A formula has ordered stages with numeric counts, and ordering can be a hard constraint tied to heat state. | SHOWN/STATED CCE CCF04 (add after heat off, Snape's diagnosis is attributed), CCF12 (one quoted stage: ground mineral, counted counterclockwise stirs, timed simmer, drops of syrup) | B1 ch.8; B5 ch.12 | Counts, direction and quantities are recipe specific. The stage is not a complete recipe (CCF12, G4). | `step` verbs plus `precondition` field (for example `heat_off`), values authored per recipe. | Staged-brew resolver (HP-C05) | **Derivable now** for these two recipes; no general formula shape |
| G4.2 | The person sample goes in last; one ingredient depends on a harvest condition; one stage has a stewing duration. | STATED CCE CCF06; SRE PJ-C1, PJ01 | B2 ch.10 | The 21-day figure belongs to that recipe, not brewing in general (CCF06). | `provenance` tag (harvest condition), `stage_clock` on the recipe. | Recipe record, PJ01 | **Derivable now**, recipe local |
| G4.3 | A revised method can replace a printed step and improve a cue. | SHOWN CCE CCF14 (flat blade crush, a stir ratio) | B6 ch.9 | The nod to the printed method means it was not impossible; improved cue is not proven potency. | Method versions with source label (HP-C04). | Method version store | **Derivable now** |
| G4.4 | Whether textbook formulas share a typical shape (ingredient list, then numbered steps) across subjects. | none; the notes quote no textbook layout | n/a | n/a | none | none | **Gap G-C** |

### DG5: stated counters and opposites

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation (IX3) | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G5.1 | A suspending effect is ended by a counter found by searching the same source. | SHOWN BSS SCF02 | B6 ch.12 | Counter name not recorded in the note; MEMORY says a paired name exists. | One relation row `levicorpus_effect -> released_by -> counter` with locator, label SHOWN; name filled after Gap G-A. | Experiment notebook, relation display (IX24) | **Derivable now** (one row); name needs **G-A** |
| G5.2 | A shrinking solution made wrongly is corrected in a later batch and a restoration is separate bottled drops; the animal returns. | SHOWN CCE CCF09 | B3 ch.7 | Restoration bottle identity is unestablished (CCF09). | Relation `shrunk_state -> reversed_by -> unnamed_restorative`, flagged unknown-identity. | Same | **Derivable now**, partial |
| G5.3 | Suppression, expiry and repair are different operations: a transformation condition is suppressed by a potion, not cured; temporary appearance changes expire; a repaired vessel does not regain lost contents. | STATED/SHOWN SRC_harry-potter HP1, HP2; CCE CCF15(b), G3; SRE PJ05 | B5 ch.15; B2 ch.12 | Wolfsbane facts come from secondary wiki digest notes, not scenes. | Relation verbs `suppresses`, `expires_into`, `repairs_vessel_not_contents` (IX3, GD5 in b9). | Condition and body ledger | **Derivable now**, three verbs |
| G5.4 | A skin remedy and a wound-closing herb are shown to work, with a stated dose and a caution. | SHOWN/STATED CCE CCF10, CCF15(c) | B4 ch.13; B7 ch.14 | One observed dose is not a universal dose. | `treats` relation to a condition tag with a dose note. | Infirmary and first aid consumers | **Derivable now** |
| G5.5 | A general opposition scheme (poison against antidote, element against element). | none recorded; MEMORY of a general antidote remark in the first potions lesson, unrecorded | B1 ch.8 (TXT 3670 to 3785 was read but this was not noted) | n/a | none | none | **Gap G-D**; no opposition cycle is asserted |

### DG6: grades and levels

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation (IX5, IX7) | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G6.1 | School years are an ordinal; the first year is inferred as 1991. | INFERRED WAL C07 (adjacent school years, not an explicit numeral) | B2 ch.8 | Mixed edition and OCR; era dates for other starts are targets (WAO T-rows). | `year` as an ordinal on pupil and class records; no tier on magic itself. | Class schedule | **Derivable now** for year |
| G6.2 | Electives and an advanced alchemy option exist. | STATED WAL P04 | author writing | Draft versus finished account differ. | `subject_layer` (core, elective, conditional). | Study planner | **Derivable now**, supplement-qualified |
| G6.3 | Evaluation words exist in scenes (worthless, best attempt, approving nod) but the notes record no named grade scale. | SHOWN CCE CCF12, CCF14; FCT HP-C11 | B5 ch.12; B6 ch.9 | A teacher's verdict is one person's call. | `assessment` receipt with reviewer, scope and band unset. | Review and commission records | **Derivable now** as a receipt shape; the scale itself **not derivable**. The exam-level scale is **Gap G-E** |
| G6.4 | Potion, spell or plant tiers (IX5) | none | none | n/a | A world tier count of none is the default until a source supplies one. | none | **Not derivable**; unknown is not forbidden |

### DG7: common versus technical names

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation (TQ12) | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G7.1 | Appearance cues are recipe, stage and modality specific: the same hue means different things in different recipes (acid green is the failure smoke in one scene and the correct liquid in another). | SHOWN CCE G1 (CCF04 against CCF09); CCF12 vapor cue | B1 ch.8; B3 ch.7; B5 ch.12 | None found. | `appearance` tags carried on the batch record with recipe, stage and modality; no hue-to-quality law. | Observation owner (HP-C06) | **Derivable now**, golden GC3 |
| G7.2 | A product can have a handling name and a use name at once (a harvested pus lot versus the diluted remedy). | SHOWN/STATED CCE CCF10 | B4 ch.13 | Dilution ratio is a gap in the notes. | `form` tag step (TQ4) separates the raw lot from the dispensed product. | Greenhouse to infirmary chain | **Derivable now**, ratio unknown |
| G7.3 | Common names against technical or Latin names of plants and creatures. | none recorded | n/a | n/a | none | none | **Not derivable** from these notes; **Gap G-C** might show a textbook naming style |

### DG8: textbook claims versus observed effects

| Row | Pattern | Evidence and locator | Scenes | Exceptions | Proposed derivation (PD12, CP1) | Reader | Verdict |
|---|---|---|---|---|---|---|---|
| G8.1 | A printed method can be improved by an annotation, and an annotation can be wrong or unsafe to try unknown. | SHOWN CCE CCF14, G2; BSS SCF02 | B6 ch.9; B6 ch.12 | One improvement does not prove annotations are reliable (G2). | `claim` records with `source`, `speaker`, `tested_cases`, `reliability`; claim is a knowledge item, not truth. | Knowledge stages (guess, test, confirm, DG14) | **Derivable now** |
| G8.2 | A teacher's diagnosis is a claim attached to a shown consequence (a quill added hot, a spleen excess). | STATED over SHOWN CCE CCF04, CCF09, G4 | B1 ch.8; B3 ch.7 | Complete recipes are absent, so a diagnosis cannot be checked against text. | Same `claim` shape, speaker = teacher, `reliability` unset. | Same | **Derivable now** |
| G8.3 | A character's estimate (a month to prepare a potion) is a conditional forecast. | STATED CCE CCF06 | B2 ch.10 | Not a law. | `forecast` claim with conditions. | Plan and prediction notebook | **Derivable now** |
| G8.4 | The text of an actual textbook page against what the scene then shows. | none recorded | B1 ch.8 supply list is in CCF01 but not a formula page | n/a | none | none | **Gap G-C** |

## 3. Golden cases (shown cases any derivation must reproduce)

A derivation that contradicts one of these has a wrong grammar row (DG11). Each is SHOWN unless noted; unshown cases stay unknown.

| ID | Case (my words) | Locator | Tests row |
|---|---|---|---|
| GC1 | A beginner remedy fails when quills go in before the cauldron leaves the fire; the cauldron melts and the spill injures the pupil. The teacher's explanation is attributed. | CCE CCF04 (book-01.txt 3737 to 3772) | G2.4, G4.1, G8.2 |
| GC2 | A shrinking solution turns the wrong hue when proportions are off; the corrected green batch shrinks an animal; separate drops reverse it. | CCE CCF09 (book-03.txt 3130 to 3215) | G5.2, G7.1 |
| GC3 | The same hue means failure in one recipe and success in another. | CCE G1 | G7.1 (a hue-to-quality rule must fail this) |
| GC4 | A staged potion requires counted stirs, a timed simmer and a measured drops stage; skipping a step changes the vapor cue and the batch is declared worthless. | CCE CCF12 (book-05.txt 6467 to 6519) | G2.4, G4.1 |
| GC5 | A revised crush method yields a better cue and the printed method is still approved. | CCE CCF14 (book-06.txt 6472 to 6573) | G4.3, G8.1 |
| GC6 | A unknown marginal spell, tried nonverbally, hangs a person; a counter is searched and found. | BSS SCF02 (book-06.txt 8124 to 8207) | G2.2, G5.1 |
| GC7 | A practiced levitation exercise fails in early attempts and succeeds after a corrected demonstration. | BSS SCF01 (book-01.txt 4601 to 4671) | G2.1 |
| GC8 | A repaired bowl keeps its shape; the essence it held does not return. | CCE CCF15(b) (book-05.txt 9215 to 9253) | G5.3 |
| GC9 | A shared potion base splits into doses; each dose takes a different person sample; the user keeps their own thoughts but changes size and voice; the person's likeness does not supply a password. | SRE PJ-C2, PJ-C3 (book-02.txt 5370 to 5502, 5533 to 5565) | G5.3, PJ02 to PJ04 |
| GC10 | A wrong-species hair sample in the same potion needs hospital care, not ordinary expiry. | SRE PJ-C3 (book-02.txt 5645 to 5698, 5699 to 5705) | G5.3 |
| GC11 | A protected greenhouse harvest of a young plant requires full hearing protection; a pus harvest requires gloves and goes to the infirmary. | CCE CCF05, CCF10 | G2.5, G7.2 |
| GC12 | A labeled herb bottle closes a wound with a small dose; full healing is declined for risk. | CCE CCF15(c) (book-07.txt 8356 to 8397) | G5.4 |

## 4. Reader and law-family map

A derived meaning needs a reader and a law family (DG26). The first proposals use IX2 families that exist in the design, not new ones.

| Derived item | Reader (GR12) | IX2 or other family |
|---|---|---|
| `effect_family_hint` on a recipe | Recipe search and notebook | none (display) |
| `part` list on a spell | Study and practice loop (SP01) | none yet |
| `step` plus `precondition` | Staged brew resolver | `inhibit` or `volatilize` per the world's authored rule |
| `appearance` tag with recipe, stage, modality | Observation owner | none (TQ12 look-alike separation) |
| Relation verbs (`suppresses`, `expires_into`, `repairs_vessel_not_contents`, `treats`) | Relation notebook (IX24); body ledger | `neutralize`, `separate`, `age` |
| `claim` with reliability | Knowledge stages (DG14) | none |
| `year`, `subject_layer` | Schedule and teacher availability | none |

Everything else waits (GR12): a row without a reader stays a record.

## 5. Gap list (no reading done; ranges a later bounded read would need)

All ranges refer to `source-preparation-2026-10-11/book-NN.txt` lines or compilation PDF pages as the notes record them. Where the notes
give no range, the read starts from the full-text index `search.sqlite` with the anchor given, and a worker sets the range then. Any such
read follows AU1 to AU15; under AU3 the exploratory default is four invocations and 48,000 source words, which every gap below fits
inside. Word counts are my estimates.

| Gap | Question | Source range (already read, so re-read is the cheap route) | New range (to locate) | Rows it closes |
|---|---|---|---|---|
| G-A | Spell name, incantation form, counter name and pairing in the two spell scenes | B1 book-01.txt 4601 to 4671 (SCF01); B6 book-06.txt 8124 to 8207 (SCF02) | Next scene where the counter is used (B6 ch.12 follow-up, book-06.txt after 8207, to the chapter end) | G1.2, G5.1 |
| G-B | The Latin or compound structure across more spell names | none | 3 to 5 named-spell scenes found by index search in B2 (dueling club), B3 (defense lessons) and B5; a short list, not a catalogue | G1.2, DG2 |
| G-C | Textbook layout, naming style, common versus technical names | none | Index search for supply-list book titles (B1 ch.5, book-01.txt 1760 to 1785 already read) then the in-lesson textbook scenes in B1 ch.8 (3670 to 3785) and B6 ch.9 (6330 to 6575) | G4.4, G7.3, G8.4 |
| G-D | The first potions lesson's stated claims about antidotes and ingredient categories | B1 ch.8 book-01.txt 3670 to 3785, read, claims not noted | re-read only; extend the notes with claims and speaker | G5.5, G8.2 |
| G-E | Named exam levels, grade words and class years | none | Index search B5 exam chapters (career advice and exams); one to two chapters (about 8,000 words estimate) | G6.3 |
| G-F | Houses and teams as rule categories | none | Index search B1 ch.7 sorting scene and one team scene; keep to what changes a rule | G3.3 |
| G-G | Herbology and creature textbook claims against what lessons show | B2 ch.6 book-02.txt 2315 to 2395; B4 ch.13 book-04.txt 4820 to 4862 | the third-year lesson scenes by index search | G7, G8 |
| G-H | Edition and OCR drift on any quoted number | all admitted ranges | spot check against a second edition if one is later authorized | DG23 |

## 6. What the grammar cannot tell us

Unknown is not forbidden. These stay unknown, with Default and Dial framing:

- **Default:** a spell's effect cannot be inferred from its name; **Dial:** the player may guess and test (DG14); **Reason:** SCF02 shows an unknown instruction giving a surprise.
- Exact quantities, completeness of any recipe, and the finished dose are not in the notes (CCE G4).
- Potion tiers, spell power tiers and a global effect scale: none are recorded; the world tier count defaults to none.
- Whether any stated absolute in the source (wand-bound, species limits, age limits) holds for exceptions; the notes record several scene exceptions and no complete list.
- Invention and revision laws beyond Harry's inference (SP06).
- Cross-edition numbers, film or game details (separate source sets).
- Counter pairs not yet found: the absence of a counter in the notes says nothing about the source.

## 7. Risks

| Risk | Default response | Dial | Reason |
|---|---|---|---|
| Edition drift and OCR damage | Pin edition and tier on each row (DG23, CP1); the compilation is mixed edition and not authenticated (SRL, CCE boundary) | Per row | A number from a damaged page can mislead |
| Film or game contamination | Keep novels, the 2016 script, films and games as separate source sets; HPL treats them as separate; the notes already keep script scenes labeled | Source set per instance | Hue, voice and counter details differ across media (SRE PJ-C2 flags a voice convention) |
| Fan material | Held in `FAN_CRAFT_EVIDENCE.md`; fan mechanics (for example electrical or magical participation theories) are hypotheses, not grammar rows | Per row, label AU | The fan rows are character claims in another author's world |
| Author-writing supplements | Mark supplement-qualified (C-X) and keep a separate ID (WAL SC2) | Per row | Weaker than direct text |
| Over-derivation | Derivations are hints with a flag; they do not create effects (DG13) | Per world | Name tendencies have exceptions (Polyjuice, Wolfsbane) |
| Calibration of failure | A failed inference follows the source's own consequence, not a hidden penalty (DG15) | Per world | Honest wrong beliefs need a reason |
| Reading budget | Use section 5 gap ranges inside AU3; do not start a whole-book pass for this grammar | Per task | AU1 to AU15 |
| Copyright | Save paraphrase and locators; no quotes (DG30) | none | Standing research rule |
| Same-name collisions | A derived item does not replace a canon item of the same name (DG29) | Per world | Canon stays pinned |

## 8. Disposition

**ACT NOW (done here):** a grammar table with evidence labels and locators for DG1 to DG8; twelve golden cases; eight named gaps with ranges;
an unknown list; risks.

**ACCOUNT FOR NOW (constraints):** the notes support operation vocabulary, claim reliability, relation verbs and part lists for potions and
herbology; they do not support a spell grammar, house or exam structure, or any tier. No derived entry is added without a locator or an
INFERRED label.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Gap G-A and G-D re-reads of ranges already read, noting name and claim text as paraphrase | Strong | Small, inside AU3 | Notes extended with locators; rows G1.2, G5.1, G5.5 move out of gap |
| Gaps G-B, G-C, G-E, G-F as one bounded plan | Balanced | One AU3-sized pass, needs Weibao's go | Each row has a locator or is declared not derivable |
| Grammar record format on the world profile (DG9) | Strong | Held | Needs the profile and dial format decision |

Everything above is a proposal. It stays under the sealed-secret rule: no secret truth appears here.
