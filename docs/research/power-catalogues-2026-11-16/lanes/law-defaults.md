# Law defaults lane: area-field and form-transformation (PSA28 dry run, 2026-11-17)

Register status: Proposal (AD32), agent-verified, not human-reviewed. Builds PWC60, PWC71-PWC76 and PSA28. No paid calls. Code: `scripts/law_defaults.mjs`, `src/area_field_law.js`, `src/form_transformation_law.js`, `scripts/form_transformation_ledgers.mjs`; tests `tests/law_defaults.test.js`, `tests/area_field_law.test.js`, `tests/form_transformation_law.test.js`. Numbers below come from `node scripts/law_defaults.mjs` (summary in `docs/coverage/fields/law_take.json`).

## What was wrong with the first read

The fill asked readers for six (area) or four (form) fields per row, and text rarely states them, so 0-5% of rows were complete and the 84-93% with defaults was true by construction. The redesign starts from something every labelled row already has: the effect sentence. 1,431 of 2,921 area rows and 1,317 of 2,019 form rows carry an `Effect verb.object/target/time` label (the same one the item-bound law reads). The law reads the sentence and only the fields that change play. Everything else is a dial with a named source, or is dropped.

## Field specs

| Law | Required (changes play) | Read, no default | Derived or dial | Dropped |
| --- | --- | --- | --- | --- |
| area-field | sentence, time, anchor, who | sentence (label verb.object) | time from label, else confirmed duration, else dial `sustained`; anchor from label target or aura shape, else `place`; who from affects, else `everyone`; ends derived from time | shape, size, cost, inside, affects, duration |
| form-transformation | sentence, target, reversal | sentence (label transform.form or alter.form, else a confirmed form-type change) | target from label or fill, else `holder`; reversal from the confirmed reversal, else the confirmed duration, else dial `at-will` | duration, change, trigger, cost, limits |

Reasons, in the order the code lists them: shape and size are the world's unit (a cone and a sphere land on the same place, and a world decides how big a place is); duration becomes `time` (instant, sustained, lasting, the grammar's own words) for areas and becomes a reversal with a clock for forms; abilities that come with a form belong to the packs that read `form`, so the law sets the label only. `SPECS` in the script is the machine-readable copy.

## Defaults, with where each came from

| Default | Value | Source |
| --- | --- | --- |
| area who | everyone | tabletop: an area effect hits everyone in it unless it names a choice (PF1 Area of Effect, D&D 5e Areas of Effect); allies, enemies, chosen and holder read as `marked` |
| area stacking | separate | tabletop: same-named effects do not stack (PF1 and D&D 5e Combining Magical Effects); bonus_stacking.js owns the rest |
| area anchor | place | rows: 87% of confirmed shapes are not an aura on the holder |
| area time | sustained | rows: the commonest label time on development rows; no kind (spell, power, creature, artifact) differs, so one default |
| form target | holder | rows: 81% of confirmed targets are the holder |
| form reversal | at-will | rows: the commonest confirmed reversal on development rows. The first guess, `none` (a change stays), was tested and lost: 1 of 20 held-out rows right |
| form abilities | follows the form | tabletop: a body-form change grants the new form's traits and a looks-only change does not (PF1 Alter Self versus Disguise Self); a dial for the packs that read `form` |

## Held-out accuracy

Split: sha1(`split:`+id) mod 5 = 0 is held out, frozen before scoring; dials fit on the other four fifths. Verdict rule: the backtest's (`verdictOf`, floor 10, must beat the majority baseline). The score rows are in `docs/coverage/derivation_rules.json` under `law.*`, so the runner's `confidence` column reads them (PSA28). Only rows the fill files cover are scored.

| Rule | n | Rule right | Baseline right | Verdict |
| --- | ---: | ---: | ---: | --- |
| area time from the confirmed duration | 79 | 75 | 12 | passes |
| area time default (dial) | 203 | 80 | 80 | equals baseline, a dial |
| area sentence from the confirmed `inside` | 62 | 10 | 22 | fails, not used |
| area ends from time | 6 | 3 | 4 | too few to judge |
| form target from the label target | 109 | 102 | 96 | passes |
| form reversal from the confirmed duration | 16 | 10 | 7 | passes |
| form reversal from the label time | 6 | 0 | 2 | too few, 0 right, not used |
| form reversal default (dial) | 20 | 9 | 9 | equals baseline, a dial |
| form sentence from a confirmed change | 112 | 107 | 107 | 96% right, same as the prior, so a prior, not a rule |

What the tests show: defaults by world or by kind (spell, power, creature) add almost nothing over the majority value. The two useful predictors are another field of the same row (the label time or target, a confirmed duration), not the ledger the row sits in. Two routes I wrote first lost on held-out rows and were removed: `inside` as a source for the area sentence, and the label time as a source for reversal. The truth for time and sentence is the Luna label, which is unchecked, so those rows measure agreement of two readers, not accuracy against a book.

## Dry-run take (runner column)

Taken means the composed case ran through `runCaseData` and came back `expressed-authored`; each distinct case runs once (`take()` returns runner-shaped rows `{id, state, detail, basis, confidence, take}`).

| Law | Rows | Taken | Share | Distinct cases | Held-out fifth |
| --- | ---: | ---: | ---: | ---: | ---: |
| area-field | 2,921 | 245 | 8.4% | 47 | 46 of 46 |
| form-transformation | 2,019 | 1,307 | 64.7% | 10 | 274 of 274 |

**area-field goes back to design: 8.4%, under the quarter.** Its limit is the sentence, not the fields. 1,281 rows have no object (only a verb tag), 278 read as not an area effect, and of the labelled rows the engine has no account for `force` (add 167, block 64, alter 57, move 20), `mind` (alter 64), `position` (move 50), `working` and `law`. Levers, sized by rows: a label pass over the 1,281 rows with a verb tag but no object (paid, not run here); a `force` account from its owner (about 310 rows); `triggered` and `delayed` time models (92); `move.position` with a destination (50); `block` and `conceal` terms (about 70). None is a field-design problem. The law and its 36 cases exist and pass, but nothing is wired.

**form-transformation clears it and is wired** (1,204 rows moved across 120 ledgers, 2,019 to 815 blocked; the 103 composable rows in the artifact and next-cell ledgers (lotm_artifacts, hp_objects, ri_treasures, hp_creatures, lotm_powers and the other next-cell builds) stay blocked because their own builder tests keep every row classified; same pattern as the item-bound law, rebuilds call `attachFormRows`). The take rests on the sentence, which every taken row states (1,025 by label, 282 by a confirmed form-type change). The reversal is the weak field: of the 1,307, 48 state it, 174 derive it from a confirmed duration (a rule that passes), and 1,085 take the `at-will` dial (45% right, the baseline). Rows needing no default for a required field: 199 (9.9% of the slug); one default: 1,004; two or more: 104. Read the 64.7% as "the law can show this row's form change with its reversal as a per-world dial", not as filled data.

## Still open

- Rows the fill read as not this effect (278 area, 136 form) need the verdict pass; they stay blocked and are the first review set.
- 57 form rows over an area wait for the area law to carry them.
- `derivation_rules_backtest.mjs --check` exits 1 at the base commit (the Gu rank rows' version hashes differ from the committed file), so I spliced the `law.*` rows into the committed file and left the other rows as they were. The backtest now also imports `scoreRows`, so a regenerate on a machine with the Gu inputs adds them.
- The label times and sentences come from unchecked Luna labels; a second reader over a held-out slice would turn "agreement" into accuracy.
