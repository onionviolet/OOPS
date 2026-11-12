# Procedural grammar contract v0

*Owner: chat P in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#the-procedural-system-how-new-things-come-to-exist) (P2 base, P5 calibration, PFP16-PFP20). Published 2026-11-12 from commit 9bbc51363. Everything here is a proposal under AD56 (it widens what can be generated and checked) and stays adjustable. Changes to this contract are versioned requests to chat P (MC2). Module: [src/procedural_grammar.js](../src/procedural_grammar.js). Tests: [tests/procedural_grammar.test.js](../tests/procedural_grammar.test.js). Proof run and checkpoint: [foundation P checkpoint](gm/dispatch/foundation-p-2026-11-12/CHECKPOINT.md).*

## What it is

A **grammar** says what a thing in a domain is made of: typed part slots, the rules for how parts combine, and weights for how often each part appears. A **thing** is a set of parts that passed the rules. Canon things and generated things take the same path, so a generated Gu, potion or spell is valid only when the rules that accept canon accept it (PFP16, PFP17).

The grammar decides **what**. How a draw is made stays with the accepted [generator contract GR1-GR17](GENERATION_FOUNDATION_RULES_2026-10-14.md#the-rules-gr) and `gen_kit.js`: every draw is addressed (`drawU32(root, address(...))`), weights are integers with reasons (`pickWeighted`), retries end at a named fallback (`withRetries`). The grammar module adds no new randomness.

The module is domain-free: it names no world, no domain and no save key. Each domain chat writes its own grammar on it and keeps it in its own files (PFP3, PFP4). The [area guide](AREA_GUIDE.md#generation) lists it under Generation.

## The contract (PGC)

| Code | Contract line | Default, dial and reason |
| --- | --- | --- |
| PGC1 | **A grammar is declared data plus rule code.** `defineGrammar({id, revision, slots, rules, fallback, dials?, budget?})` returns a frozen grammar with `ref = id@revision` (GR10). | Default: slots and weights are data; a rule is a small function, written once per mechanism (PFP1). Reason: a new canon case should cost a row, a new mechanism costs code once. |
| PGC2 | **Slots are typed.** `one` (a single part), `set` (distinct parts, order ignored), `tokens` (ordered, repeats allowed). Each slot declares `values` (a list), `'corpus'` (the vocabulary is learned from the fit) or `open: true` (any value, novel ones flagged). `min` and `max` bound the count. | Default: a world's own declared lists (paths, roles, operations) are closed; names and flavor are open. Dial: a slot may move from `corpus` to a declared list when the source enumerates it. Reason: the proof run showed corpus-learned vocabularies reject rare canon parts (one held Steed-type Gu). |
| PGC3 | **One slot may be conditioned on one earlier slot** (`given`). Its weights are then counts per given value, summed across a set. | Default: condition the part the source ties together (head word on role, name marks on path). Reason: weights that ignore the tie make plausible parts in implausible pairs. v0 limit: one given per slot (see backlog). |
| PGC4 | **Rules are `derive` or `check`.** A derive rule computes fields (a band, a name). A check returns null or a reason. Each rule carries `default` and `reason` text and may name a `dial`. | Default severity `reject`; `flag` for "allowed but outside what the source shows". Reason: AD5 constraint form; AD56 says lines that would remove options are flags until Weibao says otherwise. |
| PGC5 | **Assembly is the one gate.** `assemble(grammar, parts)` returns `{ok, value:{grammar, parts, derived}, receipt:{violations, flags, overlays}}`. Violation kinds: `missing-part`, `too-many-parts` (past the declared `max`), `unknown-part` (closed slot), `bad-shape`, `rule-reject`. Flag kinds: `novel-part` (open slot, unseen in the fit), `outside-range` (more parts than any corpus row), `rule-flag`. | Default: canon parts, generated parts and player-invented parts (P4) all call `assemble`. Reason: generated means runnable (PFP16); a second validation path is how special cases appear. |
| PGC6 | **Weights come from the source.** `fitGrammar(grammar, rows, {smoothing})` turns labelled corpus rows `{id, parts}` into integer weights, each with a reason string (`corpus 12/304`), per-slot size counts and the seen support. | Default `smoothing` 0: only what the source shows. Dial: a positive integer opens every declared value, so a world can widen its range without code. Reason: PFP18 and GR9. |
| PGC7 | **A world departs from the fit by overlay, with a reason.** `overlayGrammar(fitted, {id, reason, reweight})` records each departure `{slot, value, from, to}`. | Default: world packs and regions overlay; they never copy a grammar (GR8). Reason: PFP18 asks where a world's dial departs from the source and why. |
| PGC8 | **Generation has an address, a cause and a budget.** `generate(fitted, {root, address, cause, validate?, maxAttempts?})`. `cause.kind` is one of place, history, pressure, inventor, flavor (or canon-test). Draws per call are capped by `budget.maxDraws` (GR11). Retries put the attempt in the address; the last resort is the grammar's named fallback, counted in the receipt (GR6). | Default: no bare rolls for anything that matters (PFP19); `flavor` is the P1 table case. Reason: a cause is what a story, a rumor or the player's question reads later. |
| PGC9 | **The generator writes truth only.** The value carries parts, derived fields and cause. What an actor knows of it, and what it is called to them, is a projection owned elsewhere (GR5, MC8). | Default: freeze on reveal stores the value, not the seed (GR3); the test reassembles a saved value to the same derived fields. |
| PGC10 | **The canon test is each grammar's finish line.** `canonTest(grammar, rows, {label, compare, identity, folds, infer, smoothing, generated, tolerance})` holds out each canon row in turn (deterministic folds by id hash), fits on the rest, assembles the held-out parts and compares derived fields to the canon truth. It reports the rebuild rate, failures grouped as missing rules, open-part coverage, hidden-part inference against a majority baseline, and a range check of generated items (inside rate, fallbacks, rule flags, canon name collisions, per-slot total-variation distance). | Default: 5 folds, 200 generated items, tolerance 0.25 on shares. Dial: per domain. Reason: PFP17; a grammar that cannot rebuild its held-out canon is missing a rule, and that rule is the next foundation task. |
| PGC11 | **Labelling belongs to the domain.** `label(row)` returns `{parts, truth}` or `{missing:[...]}`. Unlabelled rows are counted by missing field, never guessed silently. `inferSlot` may propose a label from conditioned parts, marked as an inference. | Default: corpus labels come from catalogue metadata first, readers second (MC14 plan in the checkpoint). Reason: P5 needs labelled parts, and a guessed label would make the fit agree with itself. |
| PGC12 | **Names come from the world's register.** Open name slots draw from the corpus's own words, and the canon test counts collisions with canon names (NMR2, NMR3, NMR5). | Default: a generated thing that lands on a canon name is reported, not renamed silently; the naming owner decides. Reason: one name, one entity per world. |

## How a domain uses it

1. Declare the grammar in the domain's own files: slots from the domain inventory, rules from the domain law, a fallback from an authored row.
2. Write `label(row)` for the domain's corpus and `compare(value, truth)` for the fields canon fixes.
3. Run `canonTest`. Each failure group is a missing part, a wrong rule or a missing derive rule; fix the grammar, bump `revision`, rerun.
4. Hand the fitted grammar to the domain's workings: K's working consumes `value.parts`, W's quantities and law fields read the derived fields. Generated things take the same working as canon.

Two grammars from sibling chats already fit this shape. L's living grammar (lineage, body, environment fit, learned behavior, plus a not-stored projection) maps to `set` and `one` slots with conditioned weights, and its projection is PGC9's knowledge split. B's draft (BG1-BG8: ingredient, roles, step, vessel, delivery, output, combination rules, canon test set) maps directly, with ordered steps as a `tokens` slot; nested step parts are the v1 gap below.

## Existing grammars in the code

These predate the contract and stay with their owners. Each is a domain-specific instance of the same idea; moving one onto this contract is its owner's call.

| Module | What it does | Contract fit |
| --- | --- | --- |
| `power_grammar.js` | Composes a power from typed parts and prices it; `fitPowerPrices` fits prices to anchors | A grammar plus a law-side price fit; PGC6 fits part frequency, not price |
| `rune_grammar.js` | Pairs and ordered strips; unnamed pairs resolve to a costly muddle | Ordered `tokens` with a pair rule; its discord fallback is AD38 in rule form |
| `name_grammar.js` | Person and thing names from per-world lists | A flavor grammar (P1) that PGC12 would draw from |

## Proof run (2026-11-12)

Corpus: the held Gu review index (1,463 non-reference records from the 2,206 captured catalogue rows). Labels come from catalogue metadata only: name, Saga rank, wiki rank, path and Gu-type categories. A committed slice of 140 rows (120 labelled, 20 unlabelled, labels only) lets the test run without private files. Full output: [canon_test_gu_report.txt](gm/dispatch/foundation-p-2026-11-12/canon_test_gu_report.txt). Reproduce with `node scripts/grammar_canon_gu.mjs`.

| Grammar | Corpus | Rebuild | Main missing rules |
| --- | --- | --- | --- |
| `proof.gu-kind@1` (naive) | full, 304 labelled | 236/304 = 77.6% | 26 Immortal-band kinds whose canon name has no "Immortal"; 25 kinds with no "Gu" suffix; 11 kinds whose ranks cross the Immortal threshold; 6 rare paths or roles unseen in the training folds |
| `proof.gu-kind@1` | slice, 120 labelled | 87/120 = 72.5% | same groups |
| `proof.gu-kind@2` | full and slice | 304/304 and 120/120 | none |

What revision 2 changed, each from a v1 failure group (GKG codes live in the fixture until chat G adopts them):

- **GKG1.** A kind is a line that may cross the Immortal threshold (Year Gu, Liquor Worm, Beast Enslavement). `band-coherent` became a dial with default allow.
- **GKG2.** The "Immortal" title is a naming part weighted by rank, not derived from rank. A title on an all-mortal kind is flagged.
- **GKG3.** The "Gu" suffix is a naming part (the Liquor Worm and Lotus lines).
- The path and role lists are world data (the source names its paths and types), not learned per fold.

Revision 2's 100% says the grammar can **express** every labelled canon kind. Since the two new parts are read off the name, that rebuild is close to by construction. The informative numbers are the others:

- **Inference.** Hiding the path and reading it from the name parts finds the canon path in 39.8% of held-out kinds against a 13.2% majority guess; role, 48.4% against 33.6%. Name words carry signal, and v0 uses only the marks for path because a slot takes one given.
- **Open-part coverage.** Only 32.9% of held-out kinds use name words all seen elsewhere. Gu names are mostly unique, so a naming register (PGC12) matters more than a fitted word list.
- **Range.** 200 of 200 generated kinds sit inside the corpus support with no fallback. Rank, path and role shares land within 0.07, 0.15 and 0.06 total variation of the corpus. Name-word shares sit near 0.38, which is expected for open slots. One or two generated names collide with canon names per 200 and are reported. Under revision 2, one to four of 200 carry an Immortal title on an all-mortal kind; GKG2 flags them, because weights conditioned on single ranks leak the title from lines that cross the threshold (PGB1 would close it).
- **Labels.** 1,159 of 1,463 records lack a label the grammar needs (role 822, path 719, rank 686). That gap, not the grammar, limits the fit: MC14.

## What v0 cannot express yet (backlog, by request)

| Code | Gap | Who asks | Proposed v1 shape |
| --- | --- | --- | --- |
| PGB1 | A slot conditioned on two parts (path read from head word and marks) | proof run | `given: [slotA, slotB]` with summed or product counts |
| PGB2 | Nested parts: a step with its own operation, ingredient and heat | B (BG3) | a slot of type `parts` that references a child grammar |
| PGB3 | Quantities on parts (a dose, a fraction, a rank threshold) | B, F, R | numeric slots with integer ranges, read by W's quantities |
| PGB4 | Joint rules over many held items (a killer move's core and supports) | G | a grammar whose parts are references to other things' values |
| PGB5 | Place-driven weights read from W quantities (moonlight makes Moonlight-path Gu likelier) | plan P3, E | an overlay computed from a place's quantities, with the place as cause |
| PGB6 | Actor search over the grammar (P4, move search) | A, G | bounded `sampleAndScore` over `generate` with a goal score |
| PGB7 | Names drawn from the world's naming sheet rather than corpus words | NMR | an open slot whose pool is the sheet register |
