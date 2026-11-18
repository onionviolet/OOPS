# derive-worm: Worm PRT class and rating from what the power does (proposal)

Lane note, 2026-11-17. Rules: [scripts/worm_prt_rules.mjs](../../../../scripts/worm_prt_rules.mjs), frozen in commit 38159016a before the scorer ran. Scorer and sidecar: [scripts/derive_worm_prt.mjs](../../../../scripts/derive_worm_prt.mjs), [worm_prt_derived.json](../../../coverage/worm_prt_derived.json). Stated numbers: [worm_prt_ratings.json](../../../coverage/worm_prt_ratings.json) (numbers and chapter headings only).

## What the rules do

Each class rule asks whether the power's mechanism matches the page's own class definition, using the Luna effect grammar (verb, object, target, time; valid fits only) and keywords in the effect sentence. Ranged energy is Blaster, area effect on surroundings is Shaker, control of minds or creatures is Master, information is Thinker, evading perception is Stranger, touch effects are Striker, own-form change is Changer, a tough or strong self is Brute, a self law-break (phase, own time) is Breaker. Set = every class that fires; primary = first in a fixed order, most specific first (Tinker, Trump, Master, Thinker, Stranger, Breaker, Changer, Blaster, Striker, Shaker, Brute, Mover). The number is `2 + 2 x reach + 1 if it lasts + 1 if a high-output object`, reach 0 for self or touch up to 3 for area. Devices and Entities abstain, and so does any row where no rule fires.

## Scores (split: sha1(id)[0] < 0x33 held out)

Nothing is fitted, so the whole stated cohort is the comparison set. It is labelled **labels seen while writing, not blind**: the author had read the cape table's classes. The held-out slice is the cleaner figure and is too small to judge (FLOOR 10).

| Set | n (abstain) | Rule | Baseline |
| --- | --- | --- | --- |
| Class, primary exact, whole | 28 (5) | 18 | 7 (always Tinker, the most common training primary) |
| Class, primary in canon set, whole | 28 | 19 | 7 |
| Class, exact set, whole | 28 | 9 | 6 |
| Class, primary exact, held out | 5 (1) | 2 | 1 |
| Number, exact, whole | 10 (5) | 3 | 2 (always 7) |
| Number, within one, whole | 10 | 5 | 5 |
| Number, exact, held out | 1 (1) | 1 | 0 |

Verdicts by the written rule: class passes, number passes by one exact hit and ties within one (read as no evidence). Held-out alone is `insufficient-held-out`. Misses are pinned by id in `worm_prt_derived.json`. Class misses: body-change capes land on Changer (Weld, Lung, Pretender, Wanton, Hookwolf) because the grammar reads "transform form self" for all of them; Clockblocker reads as Brute; Siberian as Striker; Nice Guy and Valefor gain a second class. Number misses lean on reach alone: Bakuda 9 for 6, Imp 9 for 5, Purity 5 for 8.

Stated numbers: 15 capes attach to a row. Lung (a range) and Nilbog (a posted rating the book calls wrong) are excluded, and 10 ratings name no ledger row (Merchants, the Pure, Mockshow and others). A re-rated cape (Skitter, Master 5 then 8) counts a hit on any stated value.

## Fan tier as a second voice

Five community rows, two name a class, one is comparable to a canon class set: Tattletale as Thinker, which agrees (1 of 1). No fan row states a number, and the wiki tier holds no Worm rows (the host answered 402 and 403). So agreement is n=1, not a score.

## Derived rows

130 cape rows with no stated class carry a `derived` block (rule, inputs, class, set, number where the grammar gives one) and the note says it is not a stated rating. They stay `catalogued` or `blocked`: a PRT class is a label, not a world term, so CASE_SHAPE gives them no case and no `expect`. Default: an engine case waits for a rule that moves a world quantity from the class (for example the protocol a class triggers).

## Palette (ACT NOW / ACCOUNT FOR NOW / LATER)

- ACCOUNT FOR NOW: a Changer, Brute and Breaker split needs a second grammar field (what the body change does for the fight), not more keywords. Dial: the effect sentence read for "tough", "phase", "forms" by a second reader.
- LATER/DELEGATE (level: sonnet, effort: small, done check: held-out n at least 10): extend stated numbers with the chapter-text rows the regex misses (Genesis, Madcap and Imp are located by search with no chapter recorded); a paid stated-field read through `scripts/label_runner.mjs` batch mode under `--max-usd 2` was not needed and not run ($0 spent).
