# World rule grammars and derived detail: considerations, 2026-10-19

Weibao, 2026-10-19: "other aspects and more? Also subtle stuff for each world like Harry Potter stuff
that we can derive from spellbook rules to see what each little thing is about." **Status: proposal.**
Codes **DG1 to DG30** (prefix checked unused by `git grep` 2026-10-19). Rounds are appended, never rewritten.

## Why a new file

The closest owners are the [cross-world audit precedent](RULES_FROM_SCRATCH.md#cross-world-audit-precedent-special-rules-and-little-details-2026-10-12)
(CP1 to CP5, workflow only), the [runes and inscription palette](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md)
(a grammar for runes), [HP craft research](gm/dispatch/harry-potter-craft-research-2026-10-12/REPORT.md) (canon craft facts, Time-Turners,
Polyjuice; private notes under `docs/research/novels/harry-potter/`, gitignored) and [body-lineage b9 PATTERNS](gm/dispatch/body-lineage-2026-10-14/b9/PATTERNS.md).
None owns "read a world's own rule grammar and derive per-thing meaning". This file links them and does not restate them.

## The idea

Many sources encode meaning in structure: how a spell is named and performed, how a textbook shapes a formula, how a school or grade
groups things, which pairs are stated counters. **Derivation** means reading that grammar from the source and generating per-thing
tags, axes and laws from a few authored grammar rows, so each little thing has a stated reason instead of its own authoring pass.
It stays inside the standing limits: derive only where the source states the rule, label inference, never invent canon (CP1, RS2, RS4),
and unknown is not forbidden.

## DG-A. Kinds of grammar a source can carry (targets to verify, not claims)

| Code | Grammar | What it could yield | Extends |
|---|---|---|---|
| DG1 | Name morphology (roots and affixes of spell, creature, plant, ingredient names) | Effect family or category hints | New |
| DG2 | Performance structure (words, gesture, intent, focus) | Which parts are separate facts: acquisition, reading, practice, execution | CP2 |
| DG3 | Category structure (school, subject, house, type) | A tag family and law-family differences between categories | IX2, TQ2 |
| DG4 | Formula shape in textbooks (ingredient lists, step verbs, ordering cues) | Operation vocabulary and attractors | WR2, OV2 |
| DG5 | Stated counters and opposites | Relation-graph rows with a source locator | IX3 |
| DG6 | Grade and level structures (years, exam levels, ranks) | Tier vocabulary per world | IX5, IX7 |
| DG7 | Common name versus technical name | Appearance tags versus property facts, look-alikes | TQ12 |
| DG8 | Textbook claims versus observed effects | A claimed rule is a knowledge item with reliability, not truth (annotated books can be wrong) | CP1, PD12 |

## DG-B. Turning grammar into engine state

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| DG9 | One small grammar record per world: parts, allowed combinations, which part carries which axis or tag, with an evidence label and locator per row | Author a few rows; derive many items | Rows per world; extends the world profile (P9, WDI41) |
| DG10 | Derived entries are flagged GENERATED with the grammar row id as provenance | Always | Provenance lets a correction regenerate only what it touched (GR10) |
| DG11 | A golden set from shown source cases | A derived item must match every shown case; a mismatch means the grammar row is wrong; unshown cases stay unknown | Golden set size per world |
| DG12 | Exceptions are pinned, not averaged away | Special devices and outliers sit in the pin store (RS12) | Per world |
| DG13 | Variation without invention | Dials move strength, precision, duration; no new effect appears without an authored family | IX11, R5 |
| DG14 | The player learns the grammar | A textbook or spellbook item reveals rows; knowing a rule lets the player guess what an unfamiliar thing probably does | Knowledge stages: guess, test, confirm (SI errors and staleness) |
| DG15 | A wrong inference is a wrong belief | Name-based guesses can fail on exceptions; failure follows the source's own consequence, never a hidden penalty | Per world |
| DG16 | Display: an inference notebook | Hypotheses with a confidence and what would test them | UV rows; deferred UI scope |

## DG-C. Per-world applicability (targets; each needs its own source check)

| Code | World | Grammar to check | Cost note |
|---|---|---|---|
| DG17 | Harry Potter | Spell naming and performance, textbook formula shape, herbology classes, stated counters, school levels | Seven novels already read and ledgered privately; start from those notes, no new raw reading |
| DG18 | Lord of the Mysteries | Pathway and sequence naming, potion formula structure, ritual formats | Existing HP/LOTM feature doc and book-world code; check before any new read |
| DG19 | Cultivation worlds | Realm and grade names, root or element types, technique grades | GT5 grade and impurity; per-novel source tier |
| DG20 | D&D | School, level, components (verbal, somatic, material), damage types as structured data | SRD data already in `src/data/srd521` and `src/effect_dsl.js`; the cheapest first proof |
| DG21 | Comic and power-classification worlds | Stated power classes and rating schemes | Held |
| DG22 | Original worlds | Author one grammar to scale content | Per world |

## DG-D. Subtle

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| DG23 | Grammar drifts across books, editions and fan works | Pin the edition and source tier per row (CP1) | Per world |
| DG24 | Translation changes morphology | Key the grammar to ids; names render through locale (SC9) | Per locale |
| DG25 | Sealed things | Grammar of a sealed secret appears by id only | Sealed-secret rule |
| DG26 | A derived meaning needs a reader and a law family | No derivation without a consumer (GR12, IX2) | Per row |
| DG27 | Reading budget | Derive from existing ledgers and notes first; raw reading only for named gaps under AU1 to AU15 | Per task |
| DG28 | Same data as the relation graph and tier tables | Grammar rows seed IX3 and IX5 so there is one source for each world's interactions | IX family |
| DG29 | Canon-first | A derived item never replaces a canon item of the same name; canon stays pinned | Per world |
| DG30 | Copyright | Save paraphrase and locators, never source text | Standing research rule |

## Disposition

**ACT NOW (done here):** owner map; prefix check; the point that D&D has structured data and HP already has private ledgers.

**ACCOUNT FOR NOW (constraints):** no derived entry without a locator or an INFERRED label; no new raw book reading without the AU plan; no per-world grammar rule asserted before a lane checks it.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| DG-A1 HP grammar derivation from existing private notes | Strong | Doc, one session (sent) | A worked table of grammar rows with evidence labels, a golden-case list, and a gap list needing raw reading; no raw book read |
| DG-A2 D&D SRD derivation proof on about ten spells | Balanced | Doc, one session (sent) | Each derived tag or axis traced to a structured SRD field; no invented effect |
| LOTM, cultivation and comic grammars | Strong | Held | Reading budget and Weibao's go |
| Grammar record format on the world profile (DG9) | Strong | Held | Needs the profile and dial format decision (WDI12, WDI39) |

## Fold: DG-A1 and DG-A2 returns, 2026-10-19

Lane outputs (doc only, reading only; DG-A2 ran only read-only listings): [DG-A1 HP grammar](audits/world_grammar_2026-10-19/DG_A1_HP_GRAMMAR.md),
[DG-A2 SRD derivation](audits/world_grammar_2026-10-19/DG_A2_SRD_DERIVATION.md). The root spot-checked that the SRD pack holds 20 spells
(`tests/effect_dsl.test.js`, `spells.json` record count) and that the nine private HP notes exist.

### Corrections first (the root was wrong or overstated)

- **DG31. Names and schools do not give meaning.** DG1 and DG3 hoped name morphology and category structure would yield effect families.
  Both lanes say no. In the SRD, evocation holds a damage spell and two no-damage spells, and abjuration holds a healing spell, so "school implies
  effect" fails its golden set. In HP, a scene shows an unknown spell's effect could not be predicted from its incantation. What the grammar does
  give is **structure**: parts of a performance, components, costs, ordering constraints, relation verbs, claims with reliability. Name hints stay
  low-confidence display hints (DG13), never effect sources.
- **DG32. D&D is a proof for mechanical tags only, and the pack is small.** "Cheapest first proof" holds for fields that map one to one (school,
  level, V/S/M, material cost and consumption, concentration, ritual, damage types, conditions, save, area, range). But the repo holds 20 spells,
  not the SRD list, and about 16 of 20 are `needs_ruling`. The full-list count is a placeholder (about 340 is memory, unverified).
- **DG33. The inert contract cannot carry derived output.** `effect_dsl.js` rejects extra keys and binds every record to SRD canon, so derived tags need
  a sidecar module keyed by record id, not a schema change. Monster resistances and vulnerabilities, a "countered by" relation, and a generated-record
  namespace are missing.
- **DG34. The SRD relation graph is thin.** 13 rows from 20 spells, 15 conditions and 10 monsters (6 damage or condition rows, 4 grant rows, 3 spell-counter rows).
  No fire versus cold opposition exists in the data. Default: do not mint opposition rows from damage-type names; a world that wants them authors them as design.
- **DG35. HP notes are rich for potions and herbology and thin for spells and school.** DG17 listed spell naming, school levels and houses as things to check. The existing
  notes record two spell scenes, no incantation texts, no spell taxonomy, no house or exam structure, and no tiers. Potion operation vocabulary, ordering constraints,
  claims, relation verbs (suppress, expire, repair a vessel but not its contents) and a handling-per-specimen rule are derivable now.

### Settled by the lanes

- **Derivable now for HP (with locators):** operation vocabulary (prepare, add, stir, heat, rest, observe, bottle); a `precondition` such as heat state; a spell `part` list
  (acquired, read, practiced, executed, plus target); `claim` records with source, speaker, tested cases and reliability; relation verbs; `appearance` tags carried with
  recipe, stage and modality (the same hue means failure in one recipe and success in another, so no hue-to-quality law); `year` and `subject_layer` labels.
- **Twelve HP golden cases** and **seven SRD golden cases plus mismatch tests M1 to M5** now exist as checks a derivation must pass (DG11).
- **Cost to cover the SRD list (by hand):** about 93 authored grammar rows, about 12 derived values per spell, only 1 to 2 interpretive family tags per spell needing a labelled pass.
- **HP gap plan fits AU3.** Eight named gaps (G-A to G-H); G-A and G-D re-read ranges already read, so they are cheap. The four-invocation, 48,000-word default covers them.
- **Tier-gap law is consistent with the source's own rule,** but the Dispel Magic check numbers are memory; a one-spell read would confirm.

### Open and unverified

- No raw HP text was opened; spell names, counters and exam levels are exactly the gaps. Nothing in either lane ran code or tests.
- SRD full count and per-level histogram are placeholders; `target.creatureTypes` for Hold Person and several line numbers were not checked.
- Edition and OCR drift in the HP compilation (mixed edition, not authenticated).

### Next steps (proposal, ranked, none selected)

| Rank | Step | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | SRD sidecar proof: `deriveSpellTags(record, grammar)` for the 20 spells plus golden tests M1 to M4 | Balanced | Small code slice, needs Weibao's go | Mechanical tags match golden cases; M1 to M4 expected-fail pass; no `effect_dsl.js` change |
| 2 | Count the real SRD list and tier histogram | Balanced | Small doc, needs the supplied text | Exact N and per-level counts replace the placeholders |
| 3 | HP gap G-A and G-D re-reads of ranges already read | Strong | Small, inside AU3, needs Weibao's go | Notes extended with paraphrase and locators; rows move out of gap |
| 4 | HP gaps G-B, G-C, G-E, G-F as one bounded plan | Balanced | One AU3-sized pass | Each row has a locator or is declared not derivable |
| 5 | Grammar record format on the world profile (DG9) | Strong | Held | Needs the profile and dial format decision (WDI12, WDI39) |

Everything stays a proposal. The honest summary: grammar derives structure and relations well, and meaning from names badly.
