# Procedural grammar contract v0

*Owner: chat P in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md#the-procedural-system-how-new-things-come-to-exist) (P2 base, P5 calibration, PFP16-PFP20). Published 2026-11-12 from commit 9bbc51363; phase 2 (effect grammar, PGC13-PGC18) the same day after K and W v0 merged. Everything here is a proposal under AD56 (it widens what can be generated and checked) and stays adjustable. Changes to this contract are versioned requests to chat P (MC2). Module: [src/procedural_grammar.js](../src/procedural_grammar.js). Tests: [tests/procedural_grammar.test.js](../tests/procedural_grammar.test.js). Proof run and checkpoint: [foundation P checkpoint](gm/dispatch/foundation-p-2026-11-12/CHECKPOINT.md).*

## What it is

A **grammar** says what a thing in a domain is made of: typed part slots, the rules for how parts combine, and weights for how often each part appears. A **thing** is a set of parts that passed the rules. Canon things and generated things take the same path, so a generated Gu, potion or spell is valid only when the rules that accept canon accept it (PFP16, PFP17).

The grammar decides **what**. How a draw is made stays with the accepted [generator contract GR1-GR17](GENERATION_FOUNDATION_RULES_2026-10-14.md#the-rules-gr) and `gen_kit.js`: every draw is addressed (`drawU32(root, address(...))`), weights are integers with reasons (`pickWeighted`), retries end at a named fallback (`withRetries`). The grammar module adds no new randomness.

The module is domain-free: it names no world, no domain and no save key. Each domain chat writes its own grammar on it and keeps it in its own files (PFP3, PFP4). The [area guide](AREA_GUIDE.md#generation) lists it under Generation.

## The contract (PGC)

| Code | Contract line | Default, dial and reason |
| --- | --- | --- |
| PGC1 | **A grammar is declared data plus rule code.** `defineGrammar({id, revision, slots, rules, fallback, dials?, budget?})` returns a frozen grammar with `ref = id@revision` (GR10). | Default: slots and weights are data; a rule is a small function, written once per mechanism (PFP1). Reason: a new canon case should cost a row, a new mechanism costs code once. |
| PGC2 | **Slots are typed.** `one` (a single part), `set` (distinct parts, order ignored), `tokens` (ordered, repeats allowed). Each slot declares `values` (a list), `'corpus'` (the vocabulary is learned from the fit) or `open: true` (any value, novel ones flagged). `min` and `max` bound the count. | Default: a world's own declared lists (paths, roles, operations) are closed; names and flavor are open. Dial: a slot may move from `corpus` to a declared list when the source enumerates it. Reason: the proof run showed corpus-learned vocabularies reject rare canon parts (one held Steed-type Gu). |
| PGC3 | **A slot may be conditioned on earlier slots** (`given`: one slot, or an array for joint conditioning, PGC19). Its weights are then counts per given value, summed across a set. | Default: condition the part the source ties together (head word on role, name marks on path). Reason: weights that ignore the tie make plausible parts in implausible pairs. |
| PGC4 | **Rules are `derive` or `check`.** A derive rule computes fields (a band, a name). A check returns null or a reason. Each rule carries `default` and `reason` text and may name a `dial`. | Default severity `reject`; `flag` for "allowed but outside what the source shows". Reason: AD5 constraint form; AD56 says lines that would remove options are flags until Weibao says otherwise. |
| PGC5 | **Assembly is the one gate.** `assemble(grammar, parts)` returns `{ok, value:{grammar, parts, derived}, receipt:{violations, flags, overlays}}`. Violation kinds: `missing-part`, `too-many-parts` (past the declared `max`), `unknown-part` (closed slot), `bad-shape`, `rule-reject`. Flag kinds: `novel-part` (open slot, unseen in the fit), `outside-range` (more parts than any corpus row), `rule-flag`. | Default: canon parts, generated parts and player-invented parts (P4) all call `assemble`. Reason: generated means runnable (PFP16); a second validation path is how special cases appear. |
| PGC6 | **Weights come from the source.** `fitGrammar(grammar, rows, {smoothing})` turns labelled corpus rows `{id, parts}` into integer weights, each with a reason string (`corpus 12/304`), per-slot size counts and the seen support. | Default `smoothing` 0: only what the source shows. Dial: a positive integer opens every declared value, so a world can widen its range without code. Reason: PFP18 and GR9. |
| PGC7 | **A world departs from the fit by overlay, with a reason.** `overlayGrammar(fitted, {id, reason, reweight})` records each departure `{slot, value, from, to}`. | Default: world packs and regions overlay; they never copy a grammar (GR8). Reason: PFP18 asks where a world's dial departs from the source and why. |
| PGC8 | **Generation has an address, a cause and a budget.** `generate(fitted, {root, address, cause, validate?, maxAttempts?})`. `cause.kind` is one of place, history, pressure, inventor, flavor (or canon-test). Draws per call are capped by `budget.maxDraws` (GR11). Retries put the attempt in the address; the last resort is the grammar's named fallback, counted in the receipt (GR6). | Default: no bare rolls for anything that matters (PFP19); `flavor` is the P1 table case. Reason: a cause is what a story, a rumor or the player's question reads later. |
| PGC9 | **The generator writes truth only.** The value carries parts, derived fields and cause. What an actor knows of it, and what it is called to them, is a projection owned elsewhere (GR5, MC8). | Default: freeze on reveal stores the value, not the seed (GR3); the test reassembles a saved value to the same derived fields. |
| PGC10 | **The canon test is each grammar's finish line.** `canonTest(grammar, rows, {label, compare, identity, folds, infer, smoothing, generated, tolerance})` holds out each canon row in turn (deterministic folds by id hash), fits on the rest, assembles the held-out parts and compares derived fields to the canon truth. It reports the rebuild rate, failures grouped as missing rules, open-part coverage, hidden-part inference against a majority baseline, and a range check of generated items: per-slot inside rate, fallbacks, rule flags, canon name collisions, per-slot total-variation distance, and joint pair support (`pairs`: the share of generated items whose every value pair across two slots the corpus shows). Per-slot inside is 100% by construction at smoothing 0; pair support is the range number that can miss. | Default: 5 folds, 200 generated items, tolerance 0.25 on shares. Dial: per domain. Reason: PFP17; a grammar that cannot rebuild its held-out canon is missing a rule, and that rule is the next foundation task. |
| PGC11 | **Labelling belongs to the domain.** `label(row)` returns `{parts, truth}` or `{missing:[...]}`. Unlabelled rows are counted by missing field, never guessed silently. `inferSlot` may propose a label from conditioned parts, marked as an inference. | Default: corpus labels come from catalogue metadata first, readers second (MC14 plan in the checkpoint). Reason: P5 needs labelled parts, and a guessed label would make the fit agree with itself. |
| PGC12 | **Names come from the world's register.** An open name slot draws from the world's naming sheet register where the sheet has one for that kind of thing, and falls back to the corpus's own name words, fitted by PGC6. The canon test counts collisions with canon names (NMR2, NMR3, NMR5). | Default: a generated thing that lands on a canon name is reported, not renamed silently; the naming owner decides. v0 gap: the `gu` sheet has no Gu kind-name register (its register line reads "Xianxia: Gu, aperture, primeval essence, clan and mountain names", and its sample person names are log labels such as "Chores"), so the proof uses corpus words only (PGB7, sent to the naming owner). Reason: one name, one entity per world. |

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

Revision 2's 100% says the grammar can **express** every labelled canon kind. Since the two new parts are read off the name, that rebuild is close to by construction. So is the per-slot range check: at smoothing 0 a draw can only pick values and part counts the corpus shows, so 200 of 200 inside is guaranteed. The informative numbers are these:

- **Inference.** Hiding the path and reading it from the name parts finds the canon path in 37.8% of held-out kinds against a 13.2% majority guess; role, 44.4% against 33.6% (naive Bayes scoring from phase 3; the phase 1 sum of fractions gave 39.8% and 48.4%). Name words carry signal, and v0 uses only the marks for path because a slot takes one given.
- **Pair support.** Only 112 of 200 generated kinds (56%) use path and role pairs that some canon kind shows; for rank and path, 152 of 200 (76%). Path and role are drawn separately, so generated kinds drift from the book's combinations. Under AD56 an unseen pair stays allowed; the fix is conditioning (role given path, PGB1), not a reject. This is the next rule P5 calibration needs.
- **Shares.** Rank, path and role shares land within 0.07, 0.15 and 0.06 total variation of the corpus, inside the 0.25 tolerance. Head and mark words are over it (0.37 and 0.39), which is expected for open slots with mostly unique words and is reported as over, not passed.
- **Open-part coverage.** Only 32.9% of held-out kinds use name words all seen elsewhere. Gu names are mostly unique, so a naming register (PGC12) matters more than a fitted word list.
- **Collisions and flags.** One or two generated names per 200 collide with canon names and are reported. Under revision 2, one to four of 200 carry an Immortal title on an all-mortal kind; GKG2 flags them, because weights conditioned on single ranks leak the title from lines that cross the threshold.
- **Labels.** 1,159 of 1,463 records lack a label the grammar needs (role 822, path 719, rank 686). That gap, not the grammar, limits the fit: MC14.

## What v0 cannot express yet (backlog, by request)

| Code | Gap | Who asks | Proposed v1 shape |
| --- | --- | --- | --- |
| PGB1 | A slot conditioned on two parts | proof run | Done in phase 3 as PGC19 (joint keys with single-given backoff) |
| PGB2 | Nested parts: a step with its own operation, ingredient and heat | B (BG3) | Done in phase 3 as PGC21 (`parts` slot with a child grammar) |
| PGB3 | Quantities on parts (a dose, a fraction, a rank threshold) | B, F, R | numeric slots with integer ranges, read by W's quantities |
| PGB4 | Joint rules over many held items (a killer move's core and supports) | G | a grammar whose parts are references to other things' values |
| PGB5 | Place-driven weights read from W quantities (moonlight makes Moonlight-path Gu likelier) | plan P3, E | an overlay computed from a place's quantities, with the place as cause |
| PGB6 | Actor search over the grammar (P4, move search) | A, G | bounded `sampleAndScore` over `generate` with a goal score |
| PGB7 | Names drawn from the world's naming sheet rather than corpus words | NMR | an open slot whose pool is the sheet register |

## Effect grammar (phase 2, 2026-11-12)

The plan's [one effect grammar](PROCEDURAL_FOUNDATION_PLAN.md#one-effect-grammar-for-every-world) (PFP22-PFP24, EF1-EF8, NV1-NV5) as a grammar on this contract. Module [src/effect_grammar.js](../src/effect_grammar.js); new-effect harness [src/effect_checks.js](../src/effect_checks.js); tests [tests/effect_grammar.test.js](../tests/effect_grammar.test.js); runner `node scripts/grammar_canon_effects.mjs`; full output [canon_test_effects_report.txt](gm/dispatch/foundation-p-2026-11-12/canon_test_effects_report.txt).

| Code | Contract line | Default, dial and reason |
| --- | --- | --- |
| PGC13 | **An effect is a sentence of seven parts.** Verb (12: move, add, remove, transform, bind, release, sense, conceal, copy, block, end, alter), object (18, each of a kind: quantity, state, knowledge, relation, thing, working, law), target and shape (self, touched, bound, line, cone, area, marked), time (instant, sustained, lasting, delayed, triggered), carrier, cost and limits. `defineEffectGrammar({world, carriers, limits})` declares one per world; verbs, objects, targets and times are shared, carriers and costs are the world's. | Default: primitives stay few (EF2); a new verb or object needs a canon effect the set cannot express and a second consumer. Reason: an unchecked list is how every world grew its own effect names. |
| PGC14 | **A verb acts on the object kinds it can change** (`VERB_ACCEPTS`). A carrier pays from the accounts its world gives it. | Default: both are reject rules, so a canon sentence that fails one names a missing primitive or a mislabel. Dial `anyCost`. Reason: laws read properties, not categories (PFP22). |
| PGC15 | **The boundary with W.** P composes sentences; W lands them. `lowerEffect` turns a sentence into W ops: an add or remove on a quantity W declares becomes an `add` op; alter on a law becomes `law_add`; everything else publishes the effect kind `effect.<verb>.<object>` that present holders answer (WSC8). A quantity object W has not declared is published and listed in `needs`, as a request to W. | Default: P never declares a quantity, unit or bound (WSC2, W decides); W never names an effect sentence's parts. The one mapping P proposes is moisture to W's `humidity`. Reason: one owner per seam (SB2, SB3). |
| PGC16 | **Counterplay is derived** (EF3). Each sentence carries the verbs that answer it on the same object (sense answers conceal, release answers bind, block and end answer most). | Default: wards, dispels and Gu defenses come out of the grammar, with no counter list per effect. |
| PGC17 | **New effects pass five checks, in order.** `checkEffect` runs four per candidate: **runs** (it assembles, and the world's canon shows a law for its verb on that object kind), **pays** (its declared amount meets the price on one curve over scope, fitted from canon amounts), **allows** (no world law forbids it, or the forbidding law carries an exception with its in-world reason and cost) and **explains** (every part has a word in the world's vocabulary). `keepSpread` applies the fifth over a set: the best candidate per niche (verb on object kind) first, then by score (useful, novel, fit as integer dials), so the world keeps a spread, not one best effect copied. | Default: a world's laws, words and price curve come from its canon; a pack adds more with a reason. Reason: generated means runnable (PFP16) and new things have a cause (PFP19). |
| PGC18 | **Novelty is a dial with a cause** (PFP24). `proposeEffects` takes `novelty: {level, cause}`: level 0 changes one part of a canon sentence (NV1), level 1 changes two, level 2 carries another world's sentence into this world's carrier and cost and changes one part (NV3). Level 3, composition (NV2), is refused here: it is a K composed working (SC6). Every proposal also carries the generation cause. | Default: a traditional teacher sits at 0, an inventor far from tradition at 1 or 2. Dial per world and per actor. |

### Canon test on two worlds (EF1)

Labels are deterministic readings of repo data (MC14 step 1): Gu from chat G's 78 chapter-checked parts rows (the function family read as a sentence, cost family from rank and fuel, limits from the observed note), Hogwarts from the 117-record spellbook's paraphrased "Operation or lead" column by ordered keyword rules. Each world also has a comparison the labeller does not read: G's separately authored ability effect kinds for Gu (14 kinds), and chat S's six family headings for Hogwarts.

| World | Labelled | Rebuild | Verb read from object, target and time | Missing rules |
| --- | --- | --- | --- | --- |
| Gu | 57 of 78 (21 have no function in their scenes) | 55/57 = 96.5% | 77.2% (baseline 28.1%) | 2: Spring Autumn Cicada and Year Gu change **time**, which the grammar files as a law and `transform` does not reach. Either years are a quantity (lifespan) the Gu holds, or rebirth is a verb on time; the next scene check decides |
| Hogwarts | 109 of 117 (8 leads have no operation: a legal category, witness accounts, artefact commands) | 85/109 = 78.0% | 46.8% (baseline 7.3%) | 5 verb-object rejects (Create boils reads as add on form; a revived state as transform on a working; the Taboo as block on knowledge; Descendo as release; clearing an airway as release on vitality) and 19 family mismatches, each a mislabel or a record whose family spans verbs |

The Gu rate is higher partly by construction: its labels map G's function families, and only the ability-kind comparison (all 14 agree) is independent. The Hogwarts labeller reads free text, so its misses are real. **Across worlds:** 64.2% of Hogwarts sentences use a verb on an object kind that some Gu sentence also uses; 84.2% of Gu sentences have a Hogwarts counterpart. One grammar connects them without a join.

### New effects from the harness

Forty proposals per world and level, cause `pressure`, keep six. Pass rates: Gu 24, 16 and 22 of 40 at levels 0, 1 and 2; Hogwarts 24, 24 and 20. Most failures are **runs** (no canon law for that verb on that object kind) and, at level 2, **explains** (the world has no word yet for a part from the other world). Kept examples: a Gu that adds strength around the user instead of only to the user; a Gu that moves a bond held by a chosen target (from the Defodio lead carried into essence); a Hogwarts ward that blocks workings for good (from Cave Inimicum with its limit dropped); a Hogwarts spell that adds light around the caster (from the Starlight Firefly Gu carried into a spoken spell).

**Pays:** the Gu curve fits 26 canon dose amounts but finds no rise with scope (slope clamped to 0, base 3.2): Gu costs follow rank and kind, not reach. Hogwarts has no canon amounts, so its curve is the default dial (1 + scope). Both are listed below.

### What the effect grammar cannot express yet

| Code | Gap | Proposed shape |
| --- | --- | --- |
| PGB8 | Cost by rank and kind (the Gu curve finds no scope slope) | a curve over scope plus a world-declared rank term, fitted when canon amounts carry rank |
| PGB9 | Time as a quantity a Gu holds versus a law it changes (Year Gu, Spring Autumn Cicada) | decide per world: `lifespan` quantity with add and remove, or a verb on time with a law field |
| PGB10 | Magnitude, range and duration numbers inside a sentence | numeric parts priced on the same curve (with PGB3) |
| PGB11 | Composition (killer moves, combined charms) | K's composed working (SC6); P supplies sentences per step |
| PGB12 | Fit checks on a kept set that read the actor's need (NV4) | a usefulness dial supplied by A's wants |

### MC14 step 1: deterministic labels from repo data

`node scripts/grammar_label_mc14.mjs --out <summary.json>`; summary in [mc14_labels_summary.json](gm/dispatch/foundation-p-2026-11-12/mc14_labels_summary.json).

- **Gu index:** of 1,159 records missing a label, 170 get a path from a name word equal to a declared path ("Strength", "Soul"), and 3 a rank and 3 a path from G's chapter rows. On the 162 already-labelled rows where the name-word rule fires, it agrees with the wiki category 147 times (91%). It stays a separate layer, not a fit label (PGC11, dial to admit it). Roles (822 missing) have no repo source: the wiki page text sits outside the repo, so they wait for an approved reader plan.
- **Spells:** 109 of 117 leads labelled as sentences; 8 are not effects.
- **Potions:** 101 subjects in the evidence observations; 62 with ingredients, 13 with preparation operations, 11 recipe-shaped (both), as rows for B's grammar (BRG1, BRG3).

## Phase 3 (2026-11-12): grammar layers, procedural rules, coverage tooling

Weibao's "making all achievable" direction set coverage ledgers (CV1-CV4), grammar layers GL1-GL7, procedural rules PR1-PR9 and milestones MS1-MS7 in the [plan](PROCEDURAL_FOUNDATION_PLAN.md#making-all-achievable-ledgers-grammar-layers-procedural-rules-milestones-2026-11-12). P's part follows.

| Code | Contract line | Default, dial and reason |
| --- | --- | --- |
| PGC19 | **Joint and chained conditioning (GL5).** `given` may be an array: weights are counted per combination of the given slots' values. An unseen combination backs off to each given alone, then the marginal. Chains (path given rank, role given path and rank) are slots in order, each with its own `given`. | Default: condition the parts the source ties. Reason: separate draws break the source's combinations (phase 2 pair support 56%). |
| PGC20 | **Inference and prediction read the same weights.** `inferSlot` reads a hidden part from the parts conditioned on it (naive Bayes with add-one smoothing; the log prior is the `inferPrior` dial, off by default because it pulls sparse name evidence toward the majority). `predictSlot` and `predictParts` go forward: the most weighted value given the parts already known. `canonTest({predict})` hides slots and predicts them in order, against the majority guess, and groups the misses. | Reason: a canon test that only re-assembles labelled parts is close to circular; prediction and inference are not. |
| PGC21 | **Nested parts (GL6).** A slot of type `parts` holds an ordered list of child things, each assembled, fitted and generated by its own child grammar; violations and flags carry the path (`steps[1].op`). Parent rules read the children (order, counts). A `parts` slot is not conditioned itself; its child grammar's slots are. | Reason: recipes and moves have steps with their own parts (GL3). |
| PGC22 | **Frozen values pin their grammar (PR2).** `freezeValue` stores parts, derived fields, cause and the grammar ref; `thawValue` returns the value as seen and reports whether the pinned revision is loaded and still accepts it. A revision changes only unseen things. | Reason: saves stay stable across grammar edits (GR3, GR10, OS8). |
| PGC23 | **Bounded search (PR3).** `exploreEffects` takes `budget: {trials, stop}`: proposals and checks each cost one trial; `stop` is a caller-owned clock test, so the search stays pure. A truncated search says so. | Default 400 trials. Dial per actor. Reason: idle settlement stays cheap (MC16). |
| PGC24 | **Niche archive (PR4).** `createNicheArchive({keys})` and `archiveOffer` keep one best entry per niche (verb, object, carrier by default); ties keep the holder, so replays are stable; plain JSON, so a world can save it. | Reason: a world fills with different moves, not one best move copied. |

### Procedural rules PR1-PR9 in this contract

| Plan rule | Where it lives |
| --- | --- |
| PR1 addressed and repeatable | PGC8 (`generate` needs an address and a cause), GR1-GR17 |
| PR2 freeze on reveal, ref pinned | PGC22 |
| PR3 bounded search | PGC23 |
| PR4 spread, not a winner | PGC17 (`keepSpread`) and PGC24 (archive) |
| PR5 novelty dial with a cause | PGC18 |
| PR6 everyone uses the same generator | PGC5 (one assembly gate); NPC callers arrive with A |
| PR7 explain every output | PGC17 (`explains`), PGC4 reasons on every rule |
| PR8 names last | PGC12; waits on the naming owner's Gu kind-name register (PGB7) |
| PR9 sealed truths by ID | MC12; nothing generated in these proofs is sealed |

### Grammar layers, where each stands

| Layer | Canon test (non-circular) | Result |
| --- | --- | --- |
| GL1 identity | Joint pair support on generated items, 80% target; hidden-part inference over the majority guess | `proof.gu-kind@3` (path given rank, role given path and rank): path and role 96.5%, rank and path 94.0%, rank and role 98.5% on the full index (v2: 56.0%, 76.0%, 91.0%). Path read from name parts 39.5% against 13.2%. **Met** |
| GL2 effect | Hold out the effect sentence; predict verb, object, target and time from identity through the fit | Gu (identity: wiki type and path): whole sentence 43.9% (majority 0%), verb 54.4% (28.1%). Hogwarts (identity: S's family): whole sentence 11.0% (0.9%), verb 31.2% (7.3%). **Below the 70% target.** The re-assembly rebuild (96.5% and 78.0%) meets it, but that one is close to circular |
| GL3 composition | Rebuild held-out moves and recipes from components, through K | Shape ready: all 23 canon moves assemble as nested roles (51 roles). 28 roles name no Gu and 6 moves list one role, both flagged. The rebuild through K waits on K's composed working (MS4) |
| GL4 context | A seeded world grows things where the source shows them | Not started; needs E and PGB5 |

**What GL2 is missing, read from its grouped misses.** In Gu, wiki "support" and "offensive" types span many verbs, so identity cannot tell amplify from strength or an area sense from a self guard. Missing rules: area versus self target by kind, and a lasting versus sustained split for producers. In Hogwarts, a family heading spans verbs: "Make, change and repair" holds removes (Reducto, Expulso) and adds (Aguamenti, Fiendfyre) as well as transforms. Four-letter incantation stems were tried as a further identity part and scored slightly worse (verb 29.4%), because 117 mostly unique incantations are too sparse. What would close the gap is identity the world packs own: G's ability resolver kind per Gu, and S's operation per spell (SG2), both independent of the sentence labels. Those are requests to G and S, not P rules.

### Coverage tooling (MS1, CV1-CV4)

`scripts/coverage_report.mjs` validates `docs/coverage/<corpus>.jsonl` and writes the [counts table](coverage/README.md). `npm run check:coverage` fails only on malformed rows: bad JSON, unknown fields, a missing or duplicate id, an empty source, a state outside the five CV2 forms, mechanisms not a list of names, or a `runs-*` row whose test file does not exist. Percentages are a report, not a gate (CV4). Test: `tests/coverage_report.test.js`. The ledgers belong to their owners (G, B, S, L).

## Phase 4 (2026-11-12): grammars run both ways, player goals and honest previews

The plan's [lore from parts](PROCEDURAL_FOUNDATION_PLAN.md#lore-from-parts-forward-and-backward-rv) (RV1-RV5, PFP28) and [player-made possibilities](PROCEDURAL_FOUNDATION_PLAN.md#player-made-possibilities-pm) (PM1-PM8, PFP29). Module [src/grammar_search.js](../src/grammar_search.js); goal search in `src/effect_checks.js`; tests [tests/grammar_search.test.js](../tests/grammar_search.test.js).

| Code | Contract line | Default, dial and reason |
| --- | --- | --- |
| PGC25 | **Backward search (RV2).** `searchParts(fitted, {want, pool, accept, budget, beam, answers, canon, identity})` searches the part combinations that assemble to a wanted thing: some parts fixed, some derived fields wanted, plus any acceptance test (a law, a check, a cost). It runs a beam over the fitted weights, scored as smoothed log probabilities (sets add a size term), and every assembly costs one trial (PR3). Answers come best first, marked canon where they match a canon thing. Nested slots draw ordered child lists from a pool of child things the actor holds (GL3). Deterministic: no draws. | Default beam 12, budget 200 trials. Reason: canon recipes are one answer among those the mechanisms allow (AD38, PFP28). |
| PGC26 | **Gaps are answers too (RV4).** When nothing answers, the search returns the gaps: wanted parts the actor does not know or own (`lacks-part`), and the rules that refused the near candidates, with counts. | Reason: a lore thing the player cannot make yet is a goal with a visible missing part, skill or law. |
| PGC27 | **Honest preview (PM2).** `previewValue(grammar, value, knowledge)` shows each part the actor knows, marks the rest `{unknown: true}`, and marks a derived field `{uncertain: true}` when its rule reads an unknown part (by the rule's `reads`; a rule with no reads counts as reading everything). | Reason: knowing more sharpens previews; a guess is never shown as fact (GR5, UK1-UK7). |
| PGC28 | **Say what you want (PM3).** `searchEffectsForGoal(fitted, goal, {actor, world})` takes a partial sentence ("hide the camp" is conceal information around). The actor's known verbs and objects and owned carriers and costs bound the search. Target, time and limits stay open, and every candidate passes the same four checks as any new effect (PM1). Each answer carries its checks and its preview; parts the actor stated count as known. `knowledgeFrom(sentences)` reads what an actor knows from the canon sentences they have seen. | Reason: one gate for everyone (PM1, PFP11); the player still chooses and pays. |

### Results

- **Backward canon test** (`backwardCanonTest`): from only the verb, object, target and time of each canon sentence, the search returns the canon route among its top five answers for 48 of 57 Gu sentences (84.2%) and 97 of 109 Hogwarts sentences (89.0%). Each target averages about four other allowed routes (other costs, limits or carriers). The misses are mostly ties between a canon sentence with no limits and a cheaper cost family. The first scoring, summed raw weights, found 10.5% and 7.3%, because every added limit outscored the canon's empty set; log probabilities fixed that.
- **"Hide the camp":** a keeper who has seen Stealth Scales, Moonlight, Earth Communication Ear Grass and White Jade, owning only a Gu on primeval essence, gets four candidates in six trials, all passing the checks. The first is "hides what is hidden around while fed by a Gu on primeval essence". Its preview marks the time part unknown, since none of the four Gu the keeper knows shows it. The same keeper asking to alter a law of the place gets a `lacks-part` gap on the object.
- **Nested backward search:** the toy move test finds every ordered pair and triple of held roles with exactly one core; the real moves wait on K's composed working for an acceptance test that runs them (GL3, MS4).

### Backlog

| Code | Gap | Proposed shape |
| --- | --- | --- |
| PGB13 | Backward search that wants an effect of a composed move (the move's sentence from its roles) | K's composed working supplies the composed effect; `accept` reads it |
| PGB14 | Search depth by skill and knowledge (PM3 "search depth rises") | beam and budget from the actor's skill, supplied by A or R |
| PGB15 | Failures that teach (PM4): a failed candidate updates the actor's knowledge | a knowledge write through N's owner from the refused-rule gaps |
