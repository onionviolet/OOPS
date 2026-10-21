CHECKPOINT: IX-A written 2026-10-19 as a proposal. Doc only. No source file edited, nothing committed. The toy traces were computed by hand and then cross-checked by a scratch run of the real `resolveBatch` outside the repo (copy: `side-session-notes/.../IX_A_toy_scratch.mjs`). One hand trace was wrong and is corrected in B6.

# IX-A: can unbounded interactions be data on the existing craft law?

Owner codes: [CRAFTING_ENGINE Round 7](../../CRAFTING_ENGINE.md#round-7-2026-10-19-alchemy-and-procedural-interactions-from-tier-difference-and-tags) IX1 to IX24. Lane rules: [core audit](../WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md). Rules applied: MR5, MR8, MR17, MR30, MR32, MR34, GR11, GR12, GR16, AR1, AD36. Everything below is a proposal, not an accepted decision. Evidence labels: SHOWN (read in code or doc, with line), STATED (a doc says so), INFERRED (my reading), MEMORY (none used).

## 0. Answer in five lines

- **Yes for most of it, with one compile step and no second engine.** A relation graph plus law families expands into ordinary `reactions` rows. `defineCraftLaw` already carries reactants, products, `limit`, `catalyst`, `priority`, `after` (SHOWN `src/craft_resolver.js:54-64`). Neutralize, feed and inhibit all fit as plain reactions (section 1).
- **Tier as one scalar axis does not work.** Scalars are mass-weighted means over the whole batch and no reaction can read a scalar (SHOWN `:120-123,159`, `:58`). Tier works as strata: the same axis split into one fraction axis per tier, which is data (section 2). A `tier` field that the engine stratifies for you is the smallest follow-up edit.
- **Tag pairs between consumed lots cannot ride the craft law today**, because only catalyst-lot and station tags are read (SHOWN `:112-113,128-129`). They can ride it after a tag-to-axis mapping, and the rule-module resolver should keep gates, records and parameters (section 3).
- **Scale is fine at toy and mid size.** Measured: 400 reactions cost 0.5 ms per 12-step resolve; 3900 cost 2.5 ms (section 5, run once, this machine). A per-law reaction budget is still wise because product validation re-resolves.
- **Honest bound unchanged (IX1, audit P1).** Instances are unbounded; mechanics are the finite families. Order of addition, concentration and dilution laws are not expressible yet (section 1 gaps).

## 1. What `defineCraftLaw` carries versus what needs more

| Need | Carried today? | Evidence | Verdict |
|---|---|---|---|
| Two axes cancel (opposes) | Yes | reactants `{A:1,B:1}`, products `{matrix:2}`; mass check at `:59`; `matrix` is a fraction axis (`craft_materials.js:70`) | Reaction row |
| One axis feeds another (feeds) | Yes | `{A:1,B:1}` to `{B:2}`: B grows from A, needs a seed of B; extent is `min` over reactants (`:130-132`) | Reaction row |
| X reduces Y without being spent (dampens, inhibit) | Yes | same axis on both sides: `{salt:1,rot:r}` to `{salt:1,matrix:r}`. Subtract then add (`:133-134`) nets zero, and extent caps by the salt amount. Bounded, not unlimited | Reaction row (INFERRED from `:130-134`, confirmed by scratch run B4) |
| Partial strength | Yes | `limit` permille (`:61,131`) as in `bind-toxin` limit 700 (`craft_content_frontier.js:57`) | Dial per family |
| Gate on a tag in the batch | Catalyst lots only | `catalystTags` built from catalyst lots (`:113`); station tags (`:128`) | Consumed-lot tags unreadable |
| Process order | Yes | `after: opId` runs at that op's step, `after: null` at the end (`:125-127,154,157`) | Order by op, not by addition |
| Ordering of competing reactions | Yes, deterministic | sort priority desc then id (`:64`), consumed in turn (`:126-135`) | Needs generated priority (IX20) |
| Cycle (A feeds B feeds C feeds A) | Safe | each reaction fires at most once per `react` call (`:126-136`, no fixpoint), so no infinite loop; chains within a pass depend on priority order (section 4, B6) | Bounded by design |
| Amplify (output multiplier) | No | `availability` is per op, not conditional on axes (`:50-53,153`) | Model as feed or as a new field (E2) |
| Saturate (cap) | Partly | `limit` caps a reaction's share; no cap on an axis amount | Needs a new field only if wanted |
| Separate (recover a fraction) | Yes | convert/reaction from `matrix` or a residue axis to an active axis, `limit` as recovery | Reaction or op convert (`:145-152`) |
| Concentration or dilution effects | No | reactions use absolute amounts, so water (matrix) never changes an extent; outputs divide by mass (`:164`) but reactions do not | New `minConcentration` style field if a world wants it (E5) |
| Order of addition | No | inputs merge and sort canonically (`:86-103`; test `craft_engine.test.js:66-80` reverses inputs, same id) | IX12 order-of-addition is out unless a process step adds inputs |
| Per-lot facts | No | lots are summed into axis totals before any law runs (`:120-123`) | See T2 |

**What needs a compile step.** Relation rows are not in the law shape. Default: a pure function `compileRelations(rows, families, tiers) -> reactions[]` that runs before `defineCraftLaw`, emits plain reaction rows with generated ids and priorities, and has no runtime presence. Dial: a world ships hand-written reactions beside generated ones. Reason: `defineCraftLaw` rejects unknown fields (`only`, `:29,55`), so the relation graph cannot ride on the law spec without an edit, but a compile step needs no engine edit at all.

**Identity and save lock.** `law.ref` is `id@revision` only (`:82`), and `validateBatchProduct` re-resolves under the supplied law and fails on any difference (`:192-194`). So a relation-row edit without a revision bump makes old products fail validation instead of drifting silently (INFERRED). Default: the compile output hash goes in the law `id` or a test asserts the hash against the revision. Reason: MR30.

## 2. Tier as an ordinal and tier-gap laws (IX5, IX6)

Where a tier could live, with what each costs:

| Option | How | Breaks | Verdict |
|---|---|---|---|
| T-a Scalar axis `tier` | tag-law style threshold (`:168`) | A batch of one tier-3 and one tier-1 lot reads mean 2, a tier nobody holds (`:159`); reactions cannot read scalars (`:58`) | Reject for rules; fine as a display hint |
| T-b Derived tag stored on the product | like `tagLaws`, stored in `product.tags` (`:168-176`, MQ-A stored-derived pattern) | Product-level, so it cannot gate a reaction inside the batch | Good for output and display only |
| T-c Strata: one fraction axis per tier (`heat.1`, `heat.2`, `heat.3`) | Authored in the catalogue; a material's active mass sits in the stratum of its tier | 18 axes for 6 base axes x 3 tiers; each material record stores every axis (`craft_materials.js:126-129`) so records grow | Works now with no engine edit |
| T-d `tier` field on material, engine stratifies | `normalizeMaterial` allows `tier` (`craft_materials.js:109`), catalogue flags an axis `tiered`, `resolveBatch` adds `qty*value` to `axis.tier` at `:120-122` | Composition keys change shape, so craft_state projections and the product registry need a read (not checked) | Smallest ergonomic edit (E2) |

Per-batch averaging: `resolveBatch` sums lots into one number per axis and only then reacts (`:120-123`). Scalars are averaged by mass (`:159`). So a per-lot tier rule is impossible on scalar axes and unnecessary on strata, because the stratum is the lot's tier. Dilution does not move strata (water adds matrix only).

**How a gap rule reads two lots.** It does not read lots. The compiler enumerates stratum pairs. Default rule table (a dial per world and family): the coefficient of the lower side by gap `[1, 2, none]`. Gap 0: one unit cancels one unit. Gap 1: the higher tier counts 1, the lower counts 2, so one higher unit cancels two lower units. Gap 2: no reaction is emitted, so the two coexist untouched ("too far apart to interact"). Reason: coefficients are integer ratios and conserve mass by construction (`:58-59`). A world that wants "higher tier dominates and erases" sets a larger coefficient or a `limit`; a world with no tiers uses one stratum.

**Output tier caps.** Feed products: the seed keeps its stratum and the newly made mass lands in the lowest input stratum (T6, case B6). Uplift that needs a tier-t catalyst reuses `catalyst` (`:129`) only with a tag, so it needs a tag per tier, which is data.

## 3. IX9: which carrier for tag-pair interactions

| Aspect | Craft law (`craft_resolver.js`) | Rule-module resolver (`rule_modules.js`) |
|---|---|---|
| What it outputs | New composition: amounts move, mass checked (`:158`) | Detached proposals: one parameter target `oral.restore_availability` (`rule_modules.js:12,51`), gates, observation and consequence records (`:96-113`) |
| Tags | Catalyst-lot and station tags only (`:112-113,128-129`); family tags via `materialTags` (`craft_materials.js:157-159`) | Any role (input, actor, station, product) with `all`/`any`/`not` queries (`rule_modules.js:44,33-38`), indexed by anchor tag (`:72-85`) |
| Amount arithmetic | Integer extents, exact | None for compositions. `allocateRuleClaims` is full-extent only and "No reaction executor is admitted" (`:114-121`) |
| Catalysts | Retained, not debited (`:179`; test `craft_engine.test.js:82-95`) | No concept |
| Ordering | priority desc, id (`:64`) | layer, depth, value, specificity, order; effects sorted by ref (`:87-88,98`) |
| Receipts | `trace` is returned but not stored on the product (`:174-179`) | Receipt with matched modules and status (`:112`) |
| Save lock | `id@revision` plus re-resolve (`:82,192`) | Fingerprinted lock over modules (`:89-93`) |

Default (proposal): amount-moving interactions ride the craft law, expressed over axes. Tag-pair patterns (IX8) become a catalyst query on a generated reaction, or a tag-to-axis mapping when both sides are consumed (a family tag contributes to a stratum). The rule-module resolver keeps what it already does: gates, records, witnessed consequences and parameters around a batch. Dial: a world that wants pure tag-pair matching on consumed lots adds E5, a `present` tag query on a reaction evaluated against consumed-lot tags. Reason: building tag-pair arithmetic in the rule resolver would need the reaction executor it deliberately lacks, and the craft law already has conservation and tests. Cost of the default: tags alone cannot start a reaction until E5 or a mapping exists. Cost of the other route: a second arithmetic engine, which this audit does not recommend (WDI2 sibling).

## 4. Worked toy

Setup (basis 100, so amounts are small). Six base axes `heat cold life rot salt spirit`, three tiers, so strata axes `heat.1 heat.2 heat.3 ...` plus reserved `matrix`. Mass of a lot is `qty x 100`; the lot's active value goes in its stratum and the rest in `matrix`.

Materials (property, rest is matrix): Ember moss `heat.1` 40; Frost lily `cold.1` 30; Cinder bloom `heat.2` 30; Sun ember `heat.3` 20; Grave rot `rot.1` 50; Heartroot `life.1` 30; Brine salt `salt.1` 25; Dew spirit `spirit.1` 10; Sage spirit `spirit.2` 20.

Relation graph (4 rows, at most 8):

| Row | Relation | Family |
|---|---|---|
| R1 | heat opposes cold | neutralize |
| R2 | life opposes rot | neutralize |
| R3 | salt dampens rot | inhibit |
| R4 | life feeds spirit | feed (`after: warm`, op `warm` level 1, no converts) |

Families, with gap coefficient of the lower side `[1, 2, none]`. Let `ca`, `cb` be the coefficients of side A and side B (the lower tier side gets the larger one).

- neutralize: reactants `{A:ca, B:cb}`, products `{matrix: ca+cb}`.
- inhibit: reactants `{A:ca, B:cb}`, products `{A:ca, matrix:cb}` (A retained, B turned inert; extent caps at `A/ca`).
- feed: reactants `{A:ca, B:cb}`, products `{B:cb, spirit.min(i,j): ca}` (seed keeps its tier, new mass lands in the lowest input stratum).
- Priority formula (IX20), default: `100*familyRank + 10*maxTier + (2 - gap)`. Law A ranks neutralize 3, inhibit 2, feed 1. Law B (revision 2) swaps neutralize and inhibit. Same-priority ties break by id (`:64`).

Generated count: 4 rows x 7 allowed tier pairs (9 minus the two gap 2 pairs) = 28 reactions (scratch run printed 28).

Traces. Notation `axis: before to after`. Numbers computed by hand; every one matched the scratch run except B6, noted there.

**B1, same tier cancel.** Inputs 2 Ember moss, 3 Frost lily. Mass 500. Start `heat.1` 80, `cold.1` 90, matrix 2x60+3x70 = 330 (sum 500). Reaction `R1 heat.1/cold.1`, 1:1, extent min(80,90) = 80. After: `heat.1` 0, `cold.1` 10, matrix 330+160 = 490 (sum 500). Product conserves mass. Run: matched.

**B2, tier gap 1 (higher dominates).** Inputs 1 Cinder bloom (`heat.2` 30), 3 Frost lily (`cold.1` 90). Mass 400, matrix 70+210 = 280. Reaction `heat.2 : 1`, `cold.1 : 2`, products matrix 3. Extent min(30/1, floor(90/2)=45) = 30. After: `heat.2` 0, `cold.1` 90-60 = 30, matrix 280+90 = 370 (sum 400). Hand comparison, not run: the same 30 units of heat at tier 1 would cancel 30 cold and leave 60, so tier 2 left 30 and cancelled twice as much. Tier monotonic for this pair.

**B3, tier gap 2 (no reaction).** Inputs 2 Sun ember (`heat.3` 40), 2 Frost lily (`cold.1` 60). Mass 400, matrix 160+140 = 300. No `heat.3`/`cold.1` reaction was generated, so nothing fires. After: `heat.3` 40, `cold.1` 60, matrix 300 (sum 400). Trace empty. Run: matched.

**B4, order dependence by priority.** Inputs 2 Grave rot (`rot.1` 100), 3 Heartroot (`life.1` 90), 2 Brine salt (`salt.1` 50). Mass 700, matrix 100+210+150 = 460 (sum 700). Both R2 and R3 consume `rot.1`.
- Law A (neutralize first, priority 312 vs 212): R2 extent min(90,100) = 90, so `life.1` 0, `rot.1` 10, matrix 640. R3 extent min(50,10) = 10, so `rot.1` 0, matrix 650. Final `salt.1` 50, matrix 650 (sum 700).
- Law B (inhibit first): R3 extent min(50,100) = 50, so `rot.1` 50, matrix 510, `salt.1` stays 50. R2 extent min(90,50) = 50, so `life.1` 40, `rot.1` 0, matrix 610. Final `life.1` 40, `salt.1` 50, matrix 610 (sum 700).
Same inputs, both conserved, different products: 40 units of life survive under B. Run: matched.

**B5, order dependence by process step.** Inputs 2 Heartroot (`life.1` 60), 2 Dew spirit (`spirit.1` 20), 1 Grave rot (`rot.1` 50). Mass 500, matrix 140+180+50 = 370 (sum 500).
- Without `warm`: R4 never runs. End pass R2 extent min(60,50) = 50: `life.1` 10, `rot.1` 0, matrix 470. Final `life.1` 10, `spirit.1` 20, matrix 470 (sum 500).
- With `[warm 1]`: at warm, R4 `life.1/spirit.1`, products `spirit.1:2`: extent min(60,20) = 20, `life.1` 40, `spirit.1` 20-20+40 = 40. End pass R2 extent min(40,50) = 40: `life.1` 0, `rot.1` 10, matrix 450. Final `rot.1` 10, `spirit.1` 40, matrix 450 (sum 500).
Run: matched both.

**B6, tier cap and a chain I missed.** Inputs 2 Heartroot (`life.1` 60), 1 Sage spirit (`spirit.2` 20), process `[warm 1]`. Mass 300, matrix 140+80 = 220.
- Hand trace: R4 `life.1/spirit.2`: life is the lower side so `life.1:2`, `spirit.2:1`, products `spirit.2:1`, `spirit.1:2`. Extent min(30,20) = 20. I computed `life.1` 20, `spirit.2` 20, `spirit.1` 40 and stopped.
- Scratch run showed a second firing: the new `spirit.1` (40) is a reactant of R4 `life.1/spirit.1` (priority 112, after the first at 121), which fired with extent min(20,40) = 20: `life.1` 0, `spirit.1` 40-20+40 = 60. Final `spirit.1` 60, `spirit.2` 20, matrix 220 (sum 300).
- Lesson: within one pass, a later row sees earlier products. New mass landed in the lower tier (tier cap holds), and feed rows behave as a cascade ordered by priority. Property tests must cover chains (PT5).

## 5. Scale and a per-law budget (IX19, IX20)

Reactions per row and family: with T tiers and allowed gap g, pairs = T + 2(T-1) + ... up to the gap limit; with gap limit 1 that is `3T - 2` (T=3 gives 7, matched). Total = rows x families per row x (3T - 2), plus any hand reactions.

Cost: `react` loops every reaction at every call and skips on `r.after !== after` (SHOWN `:125-127`), called once per process step and once at the end, at most 13 calls (`MAX_STEPS = 12`, `:13,138,157`). Worst case checks = 13 x R.

Measured (a scratch bench, run once on this machine, 300 resolves each, every reaction `after: null`, 12 steps, so only the end pass fires but all loops run): 

| Axes | Reactions | ms per resolve |
|---|---|---|
| 19 | 28 | 0.135 |
| 49 | 400 | 0.500 |
| 97 | 1200 | 1.504 |
| 121 | 3900 | 2.466 |

Other costs: `normalizeMaterial` fills every axis on each material (`craft_materials.js:126-129`), so strata multiply stored axis keys per material (T-c). `validateBatchProduct` re-resolves every product (`:192`), so a per-product validation costs one resolve.

Proposed per-law budget (dial per world, reason GR11): default 512 reactions, 160 axes, with the compile step failing loudly above it. Index reactions by `after` and by first reactant at `defineCraftLaw` and skip reactions whose reactants are all zero (E3). Priorities are generated by the formula in section 4; the family sets the high digits so a family reorder is one number.

## 6. Property tests and one seed sweep (MR34, GR16)

| ID | Property | Failure it catches |
|---|---|---|
| PT1 | Conservation: sum of `composition` equals `mass` for every random batch (existing check `:158`) | A compiled row that does not balance |
| PT2 | No negative amounts, and every `extent` is a non-negative integer | Rounding with `limit` |
| PT3 | Determinism: same inputs, process, law give the same product id; save, reload, validate gives the same (`validateBatchProduct`) | Hidden state in the compiler |
| PT4 | Compile determinism: same rows give byte-identical reactions, independent of row order in the source | Unordered iteration |
| PT5 | Chain closure: no reaction fires more than once per pass; total passes at most `steps + 1` | Cycle runaway |
| PT6 | Order-independence is claimed only for input order and merged duplicates (test already reverses inputs), not for process order or priority | Overclaiming |
| PT7 | Priority swap changes results only for batches where two reactions share a reactant (B4 style); disjoint reactant sets commute | Hidden coupling |
| PT8 | Tier monotonicity: raising the higher side's tier by one never reduces the lower side's cancelled amount, per pair | Bad coefficient table |
| PT9 | Gap 2 inert: a batch of only gap 2 pairs equals its inputs sum | Accidental reaction |
| PT10 | Tier cap: new mass from a feed lands in the lowest input stratum | Uplift leak |
| PT11 | Law-revision rejection: an old product fails validation under changed rows | Silent drift (MR30) |
| PT12 | Budget: compile fails above the reaction and axis budget | Runaway graphs |

Seed sweep for a dominant brew (the held "random-mix dominance" lane, no engine change): generate N=2000 batches by seed from a catalogue sample, each 2 to 5 distinct materials, quantities 1 to 6, 0 to 3 steps, three world seeds. Score each by a stated utility (sum of output values per mass, using the law's `outputs` rows). Report: the distribution of scores (median, p90, p99, max), the share of batches whose score is within 10 percent of the maximum, the winning recipe's structure, and whether one stratum or one op appears in more than 40 percent of the top 1 percent. Pass band (dial): top 1 percent differs from the median by at most a world-set factor and no single recipe shape holds over half of the top 1 percent. Failure signals: a feed cascade (B6) that multiplies a high-value axis; an inhibit that pushes an axis to zero for free; order of two ops that wins every time. Reason: Weibao is the only player, so flatness is the risk, not exploits (IX21).

## 7. Smallest engine edits, ranked

Net-zero main.js impact (AR1) for all of them: each lives in `craft_resolver.js` / `craft_materials.js` / a new pure module; none adds a line to `main.js`, `save_files.js` or `display.js` (INFERRED from the files being imported by `craft_*` and the runtime module only, `grep` of `src` showed `craft_content_frontier.js`, `craft_recipes.js`, `crafting_frontier_runtime.js`, `craft_product_registry.js`, `craft_state.js`; whether `main.js` imports them was not checked). Registration of a new law pack follows the existing frontier pack pattern.

| Rank | Edit | Level | Effort | Done check |
|---|---|---|---|---|
| E0 | No engine edit: a pure `compileRelations` module plus a toy pack with strata axes and tests PT1 to PT5, PT8 to PT12 | Strong | Small code slice, one session | Toy pack of section 4 passes; golden traces B1 to B6 equal this file; a reader exists (an output row that reads the result, GR12) |
| E1 | `defineCraftLaw` stores a content hash of reactions in `ref` or product identity | Balanced | Small | PT11: a changed row with the same revision fails registration or validation |
| E2 | `tier` on material and a `tiered` axis flag; `resolveBatch` stratifies at `:120-122`; composition keys carry the tier | Strong | Medium: also craft_state projections and registry reads | Strata toy rebuilt with authored axes only; saved products from before still validate (MR33) |
| E3 | Bucket reactions by `after`, skip all-zero reactants, enforce a budget | Balanced | Small | Bench at 3900 reactions at most as slow as today; budget test |
| E4 | `limit` per tier gap in data rather than separate rows (optional) | Light | Small | Row count drops with identical products |
| E5 | `present` tag query evaluated on consumed-lot tags, or `minConcentration` on a reaction | Balanced | Small | A tag-only pair and a dilution case have tests; no change for laws that omit the field |

Default: do E0 first, because it proves the claim with no engine edit and is the best done check for the whole proposal. E1 follows because generated rows make silent drift likelier. E2 only if strata axes prove clumsy to author. Dials: world, family set, gap table.

## 8. What I did not check

- Whether `craft_state.js`, `craft_product_registry.js` and the display read `composition` keys by fixed names; strata (T-c, E2) could break them. A single grep for `composition` found no read in `craft_state.js`, and I did not open the other files.
- `craft_recipes.js` recipe matching with strata axes, and `generateRecipe` with tiered families.
- Whether `main.js` imports the craft modules and the AR1 baseline numbers; `npm run check:arch` was not run.
- The E4 rule schema (a draft) and E4B reaction-table details beyond headings; MQ-A beyond the stored-derived tag lines.
- Body ledger and effect-family registration (IX16, IX11), which gate whether outputs matter.
- No test was written or run in the repo; the scratch scripts live outside it. The reaction ordering claim relies on one read of `:64,126-136` plus the scratch runs.
- The bench is one machine, one run, with reactions that never fire (all `after: null`); firing reactions cost slightly more.
- Pill grade and impurity (GT5), canon formulas (GT2) and their interaction with free mixing (IX17, IX18).

## Open questions (none block the proposal)

- Q1: Should the toy pack become a real example law beside `frontier.brew`, or stay a test fixture? Default: test fixture first, because MR32 asks for a reader before a maker.
- Q2: Which worlds use strata at all? Default: none until a world declares tiers (IX5 dial), since a world without tiers uses one stratum and pays nothing.
