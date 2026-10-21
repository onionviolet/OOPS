# L2: can the existing resolver carry world dials? (WR3, WR8, one heredity dial)

CHECKPOINT 2026-10-19: Claude lane L2, doc only, read-only on code. Nothing run, nothing
committed, no other file edited. Every row is a **proposal**, not an accepted decision
(WDI40). Evidence labels: SHOWN (read in a file, cited), STATED (a doc says so),
INFERRED (my reading, not executed), MEMORY (none used). Palette:
[WDI1 to WDI40](../../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md); lane rules:
[core audit](../WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md). Line numbers are for
`src/rule_modules.js` unless a file is named.

## 1. Verdict

Default: the resolver carries all three dials as **module selection plus parameter or gate
effects**, with no second evaluator (AR3). Dial: it needs four small edits first, all inside
`rule_modules.js`; a fifth (slot binding) waits for a real crafting consumer. Reason: the
resolver is already pure, ordered, exact-rational and receipt-producing, but it was built for one
consumer and the code says so in four places.

| Dial | Expressible today | Gap | Smallest edit |
|---|---|---|---|
| WR3 substitution | Exact vs functional: yes, by tag query (parent tags imply, PC2-T4). "None": by shipping no module | No slot binding; vetoes cannot be lifted by layer | E5 (held), plus a design default in 3.1 |
| WR8 quality | Exact-or-fail: yes, as a gate. Graded: yes, as banded `replace` effects | Band edges collide (inclusive `gte`/`lte`); no second target. Continuous: no | E2, E4; keep continuous in the domain |
| Heredity step | Latent/expressed/suppressed: yes, as actor tags. Grant: no | Base value is 1, not 0; one target; outputs a factor, not a capability step | E2 with a per-target base |

## 2. What the resolver is today (SHOWN)

- **Facts are an injected map, default closed.** `RULE_FACTS` has five entries (line 11).
  `validateRuleModule` and `compileRuleModules` take `{facts=RULE_FACTS}` (lines 39, 76), so a
  caller can already pass a wider map without editing the file. Types are string, number or
  boolean; ops are `eq`, `gte`, `lte`; `eq` is the sole op for strings and booleans (line 31).
  Facts are JS numbers, so they are compared, not added.
- **Subjects read tags, not facts.** Roles are `input`, `actor`, `station`, `product` (line 44);
  quantifier `some` or `all`; query is a tag tree (lines 33 to 38). Subjects in one module are
  ANDed (line 70). Tags expand through parents (line 83), which gives "functional profile"
  matching for free. Hidden tags make the result unknown to a non-omniscient observer and still
  true for the engine (PC2-T2, GR5/WDI9 shape).
- **Ordering.** `rank` is `[layer index, depth, value, specificity, order]`, layers
  `core < world < region < actor < director` (lines 13, 87, 88). Replacements sort descending, so
  the highest rank wins (line 103). Equal rank with different values throws
  `Conflicting equal-rank replacements.` (line 104). `add`, then `multiply`, then `min`/`max`
  run in fixed phases (lines 106 to 109), so those three are order-independent. Effects are sorted
  by `ref` with code-point compare (line 98), which satisfies SB3 and SB4.
- **One target.** `RULE_TARGET='oral.restore_availability'` (line 12). A `parameter` effect must
  name it (line 51). Resolution does **not** filter parameters by target (line 103 takes every
  `parameter`), so a second target admitted at line 51 would silently blend into the first value.
- **Value algebra.** Parameters are canonical non-negative rationals (line 19), BigInt
  arithmetic with a safe-integer budget (lines 21 to 24), start from `rational(1)` when no
  replacement exists (line 105), and clamp to a floor of 0 (line 108). Result: a dial that means
  "count of steps" or "additive grant" has the wrong neutral element.
- **Gates ignore layers.** `veto` blocks regardless of layer; `permit` clears nothing (PC2-T9); a veto is
  lifted by an `exempt` effect that names the exact refs and a boolean source fact (lines
  52 to 54, 99, 100). A director-layer entry cannot flip a core or world veto (PC2-T14).
- **Hard-coded resolver id.** The literal `village.mix@2` sits at lines 41 (admission), 91 (lock)
  and 112 (receipt). The world-pack layer already treats `resolver` as a text id and gates it on
  an installed feature (`world_pack_manifest.js:123-124`, `world_pack_loader.js:191`), so the
  hard-coded value is the sole thing stopping a second consumer.
- **Receipt.** `{schema, resolver, candidateCount, matched, effects:[{ref,channel,kind,combine,
  status}], value}` (line 112). It has no target, no per-effect value and no pack id.
- **Layer floor is enforced elsewhere.** A profile cannot override below its parent's layer
  (`world_pack_loader.js:181-182`).
- **Consumers.** `mixture_rules.js` builds modules (line 18), makes the context (line 47),
  divides the rational into a float (line 50), stores `ruleReceipt` on the product (line 53) and
  freezes a receipt per settlement (line 63); `validateVillageRuleOwner` compares stored receipt to
  stored product (line 76) and does not re-resolve. `check_rule_pack.js` wraps compile and lock
  (lines 22, 23) and rejects modules from another world (line 21). `main.js` does not import
  `rule_modules.js` (grep, empty).

## 3. The three dials

### 3.1 WR3 substitution policy (exact identity, functional profile, none)

- **Carrier.** A world's choice is **which modules its pack ships**, not a runtime flag: scope
  carries `worldId` (line 42), and `check_rule_pack.js:21` enforces it. Default policy table:
  - Exact identity: a `gate` `veto` on `means` at layer `world`, selector `quantifier:'all'`,
    `query:{not:{tag:'<exact id tag>'}}` for the slot's inputs.
  - Functional profile: no veto; a `parameter` `multiply` (for example `4/5`) on a
    "substitution efficacy" target, selector = functional tag present AND exact tag absent (two
    subjects, ANDed).
  - None: the pack ships neither; the recipe matcher in the domain refuses the substitute.
  Dial: efficacy per world; reason: Weibao's "both, depending on the world" (AD5).
- **Design default that avoids a trap.** Because vetoes cannot be outranked by layer (lines
  99 to 101), a world that wants a looser rule than its genre archetype must not inherit the
  archetype's veto. Default: archetypes ship parameters, worlds that want hard refusal add the
  veto. Dial: an `exempt` effect with a named source fact lets an actor or director entry lift a
  specific veto (the cheat route, WDI15).
- **Missing (INFERRED).** Roles are bags of entities (line 63); the context cannot say which input
  fills which recipe slot, so "this slot accepts the functional tag, that slot needs exact" is not
  expressible. `effect_dsl.js:47-52` shows the repo's older shape: a per-material `substitutable`
  boolean, and costly or consumed materials forbid it. That is an exact/none switch per material,
  a good second consumer to check E5 against.
- **Not the resolver's job.** Which recipe a mix is near (OV2 attractors) is `craft_resolver.js`
  (CRAFTING_ENGINE line 22, STATED); the resolver supplies the policy value or refusal.

### 3.2 WR8 quality model (exact-or-fail, graded, continuous)

- **Exact-or-fail.** A `gate` `veto` on `physical` whose selector holds a fact predicate, for
  example `input.mass lte N`. Expressible today (PC2-T6 shows mass thresholds).
- **Graded.** Bands as `replace` effects on the quality target, each with a `requires` range.
  Trap (SHOWN by reading line 31 and 104): `gte` and `lte` are both inclusive, so a value on the
  shared edge of two adjacent bands matches both, and two equal-rank `replace` effects with
  different values throw. Default: give bands distinct `specificity` (line 46) so one wins, or
  author one band as `gte` and the next as a `not` of the previous. Dial: band edges per world.
- **Continuous.** Not expressible. Values are constants; there is no effect that scales by a fact
  (line 51 takes a literal ratio), and facts are floats, which SB7 warns against summing. Default:
  the resolver supplies the curve's coefficient or tolerance as a parameter, and
  `craft_resolver.js`'s integer output laws compute the dose (AR12 keeps product math local).
  Dial: a scaling combine, if a second world needs it (AR11).
- **Seam check.** `mixture_rules.js:50` already turns the rational into a float for the dose
  multiply, so exactness ends at the consumer. Acceptable for one multiply, a risk if a consumer
  sums many of them (SB7).

### 3.3 Heredity dial (one heritable factor, latent/expressed/suppressed, one capability step)

- **State is not the resolver's.** GHS6 puts expression state in the heredity slice (STATED,
  GENETICS plan line 61); GHS5 says expressed factors grant through body sources
  (`body_progression.js:16`, grants `{capability, amount:1}`, SHOWN). The resolver reads, it does
  not own.
- **Carrier.** The consumer builds an `actor` role whose entity tags include
  `heredity.<factor>.expressed`, `.latent` or `.suppressed` (three tags per factor, registered with
  `TagRegistry`; `latent` may be `visible:'hidden'`, as PC2-T2 does for `sealed`). One module at
  layer `world` (or `region`/`actor` for an in-world pushback, GHS15) selects
  `{role:'actor', quantifier:'some', query:{tag:'heredity.<factor>.expressed'}}` and emits a
  `parameter` `add` of `rational(1)` on a target such as `capability.step.<capability>`. Latent
  and suppressed match nothing, so they grant nothing, which is the GHS6 contract.
- **Decisive worlds.** GHS15's "decisive where lore says why" is a larger `add` value or a
  `multiply`, on a world module, with the pushback as a `region`/`actor` module. `max` caps it;
  the LD5 year-of-idle check is a consumer test (GHS15, STATED).
- **Missing.** (a) The base is `rational(1)` (line 105), so an `add` of 1 gives 2 and the consumer
  would have to subtract; a step target needs a base of 0. (b) The target set is one string (lines
  12, 51). (c) The resolver returns a factor, not a capability change; the consumer maps the value
  to a body source (AR3: capability remains owned by the body pipeline). (d) A negative step
  (suppression with a cost) is unrepresentable, because ratios are non-negative (line 19); model it
  as a lower `max` or a separate cost target.
- **Time.** Expression flips (awakening, trial) are events on the owning clock (GR17); the resolver
  is stateless, so catch-up is the consumer's equivalence test, not the resolver's.

## 4. Edits (smallest change that keeps one evaluator)

| Id | Edit in `rule_modules.js` | Lines | Back-compat |
|---|---|---|---|
| E1 | Take `resolver` from options (default `'village.mix@2'`) at admission, lock and receipt | 41, 91, 112 | Default path byte-identical; `check_rule_pack` and `mixture_rules` unchanged |
| E2 | Replace the single `RULE_TARGET` by an options map `targets:{id:{base}}`, default `{[RULE_TARGET]:{base:rational(1)}}`; `validateRuleModule` checks membership; `resolveRuleEffects` takes `{target}` and filters `params` before replace/add/multiply/bounds | 12, 51, 103 to 109 | A call without `target` resolves `RULE_TARGET` as today |
| E3 | Add `target` and the pack's resolver id to the receipt when `target` is not the default | 112 | Stored village receipts keep their shape (`mixture_rules.js:53,76`) |
| E4 | Put both module refs in the equal-rank message, keeping the `Conflicting equal-rank replacements.` prefix the test matches | 104 | PC2-T8 regex still passes |
| E5 (held) | Optional `slot` on role entities and on a subject; absent slot keeps today's behavior | 44, 63 | Held until a crafting consumer exists (GR12) |

Facts need no edit: pass a wider map through the existing `facts` option, and keep a registry
there (L1's lane owns the governance spec, WDI7).

## 5. Saves and migration

- **Resolver has no slice.** It stores nothing, so E1 to E4 need no migration. Saved artifacts
  are the consumer's: `lawLock` and `ruleReceipt` on village products and receipts in the village
  owner (`mixture_rules.js:53,63`). E3 keeps default receipts identical, which avoids touching
  those (AR6 slices, 2026-10-17 compatibility decision STATED in ARCHITECTURE_RULES line 92).
- **A heredity consumer owns a new slice** (AR6, AR2: a registered domain, `domain_registry.js:17`
  allows `initialState`, `save`, `validate`, `migrate`, `load`). The slice stores factors and
  expression state; the rule pack stores no player state.
- **Revisions (GR10, GR3).** Modules carry `id@revision` and locks list refs (line 91). A pack
  holding two revisions of one id throws (line 78), so a patch that ships `rev 2` cannot sit
  beside a frozen `rev 1` in one pack. The village pattern already handles this: the product
  keeps its own `lawLock`. Default: every new consumer stores a lock with anything the player has
  seen (INFERRED from `mixture_rules.js:39-53`).
- **Dial revision in the address (WDI30).** Changing a world's dial revision must also change the
  generation address for unseen content (GR2, GR10); the resolver is not involved, but the
  generator must read the lock fingerprint (line 91) or the pack revision.

## 6. Ordering and determinism traps

| Code | Trap | Evidence | Default handling |
|---|---|---|---|
| T1 | Second target blends into the first value | Line 103 has no target filter | E2 filters first |
| T2 | Neutral element of `add` is 0, base is 1 | Line 105 | Per-target `base` in E2 |
| T3 | Band edges collide | Lines 31, 104 | Distinct `specificity`, or `not` of the neighbor |
| T4 | Equal-rank throw surfaces at a player action | Line 104; `quote` paths call the resolver | Lint first (7), runtime throw stays as backstop; consumer turns it into a refused quote |
| T5 | Gates ignore layer | Lines 99 to 101, PC2-T9, T14 | Archetypes ship parameters; vetoes opt-in; `exempt` for cheats |
| T6 | Rational to float at consumer | `mixture_rules.js:50` | Keep one conversion per product; avoid float sums (SB7) |
| T7 | Facts are floats compared with `lte`/`gte` | Line 31 | Integer-valued facts for any band edge (GR9 shape) |
| T8 | Same-id revision clash inside one pack | Line 78 | Locks per frozen product |
| T9 | Receipt cannot tell packs or targets apart | Line 112 | E1, E3 |
| T10 | Iteration over role maps or fact keys feeding a result | Line 83 iterates `Object.entries(context.roles)` | The candidates are then sorted by id (line 84), so order does not leak; keep that sort (SB3) |

## 7. Does the equal-rank throw belong in authoring lint (WDI36)?

Default: yes, add a lint at pack admission **and** keep the runtime throw. Reason: the throw
(line 104) depends on the context, so it fires mid-play, possibly while a player holds a quote.
A lint finds the likeliest cases earlier; it cannot decide all overlaps, because selector overlap
over fact thresholds and tag hierarchies is not decidable cheaply.

- Lint rule: for modules in one pack with the same route, scope, layer, depth, value, specificity
  and order, and a `replace` on the same target with different values, report if their selectors
  can overlap. Treat "cannot tell" as a warning with both refs.
- Dial: strictness (warn vs refuse) per pack kind; stricter for world packs, lenient for
  director overlays. Reason: overlays are edited live (WDI16).
- A sweep over generated contexts at dial extremes (WDI38, GR16) catches what syntactic lint
  misses.
- Where it lives: the pack loader already validates shape and layer floors
  (`world_pack_loader.js:181`) and owns diagnostics, so the lint is a loader diagnostic or a
  `scripts/` check; it need not touch `rule_modules.js` beyond E4's message.

## 8. Net-zero registration (AR1)

- E1 to E4 are inside `src/rule_modules.js`, which `main.js` does not import; they add **zero**
  lines to `main.js`, `save_files.js` and `display.js` (INFERRED from the grep and from
  `rule_modules.js` consumers listed above).
- A heredity domain is a separate lane. It needs one registration line through
  `registerDomain` and pays for it by moving a line out (AR1, AR2). A shared **dial registry**
  (L3, held) would need its own line; the same rule applies.
- `npm run check:arch` was not run (see 10).

## 9. Regressions and failure scenarios to add (AD36)

Choose from existing checks first: `tests/rule_modules.test.js` (PC2-T1 to T15, T34, SHOWN) is the
slice for E1 to E4; `check:rule-behavior` maps `tests/mixture_rule_modules.test.js` to AR3/AR7
(`scripts/check_rule_behavior.mjs`, SHOWN) for the village consumer. New cases:

1. **R1 target isolation (E2).** Modules on two targets, one `add 1/5`, one `replace 1/2`;
   resolving each target returns its own value; resolving with no target returns the village
   value unchanged. Fails today by construction (line 51 rejects a second target; line 103 would
   blend).
2. **R2 neutral base (E2).** Heredity fixture: target base 0, one expressed factor gives exactly
   `1`, latent gives `0`, suppressed gives `0`, two expressed factors with `max 1` give `1`;
   shuffled module order gives the same receipt (PC2-T8 style).
3. **R3 band edge.** Two bands sharing an edge value: without distinct specificity it throws;
   with it the higher-specificity band wins on the edge value; document which in the test name.
4. **R4 default receipt identical (E1, E3).** Resolve the village fixture before and after; the
   receipt JSON is byte-equal. Protects `validateVillageRuleOwner`'s stored comparison.
5. **R5 second resolver id (E1).** A lock built with another id validates against the same id and
   fails against `village.mix@2`.
6. **R6 pack-level lint.** Two same-rank `replace` modules with different values and overlapping
   selectors yield one diagnostic naming both refs; non-overlapping tags yield none.
7. **R7 vetoes survive higher layers (T5).** Keep PC2-T9/T14 as-is; add a WR3 case where a
   director `permit` does not lift a world `veto`, and an `exempt` with its source fact does.
8. **R8 save round trip for the consumer, not the resolver.** For the heredity slice (later): save,
   reload, import, then the next resolve gives the same value and receipt (GR16).

## 10. Ranked next steps (at most five)

| Rank | Step | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | E1 and E3: take the resolver id from options; add `target` to the receipt for non-default targets | Strong | Small code slice, own worktree | R4 and R5 pass; `tests/rule_modules.test.js`, `tests/mixture_rule_modules.test.js` and `npm run check:arch` green; no `main.js` diff |
| 2 | E2: per-target base and target filter | Strong | Small code slice, after 1 | R1, R2 pass; PC2-T7 unchanged; heredity fixture in `tests/` uses an `actor` tag, no new module exports a resolver |
| 3 | E4 plus the pack-admission lint (section 7) | Balanced | Small code or script slice | R3, R6 pass; the loader emits a diagnostic naming both refs |
| 4 | Doc: WR3 and WR8 default tables as module recipes (3.1, 3.2), with a band-edge rule and the archetype-ships-parameters default | Balanced | Doc, one session | Linked from the CRAFTING_ENGINE WR section; no blanket claims; names the reader of each dial (GR12) |
| 5 | Check E5 (slot binding) against `effect_dsl.js` materials and the first crafting consumer before building | Balanced | Doc, short | A two-consumer comparison says whether slots belong in the context or stay in `craft_resolver.js` (AR11) |

None of these selects build scope; they wait for Weibao's go (WDI40, L3 held).

## 11. Questions for the owners (none block this file)

- Q1. Does the dial registry (L3) own target ids, or do consumers register targets with the
  resolver (E2)? Default: the resolver holds the map, the registry validates names (one authority,
  AR3).
- Q2. Should continuous quality ever enter the resolver? Default: no until a second world needs it
  (AR11).

## 12. What I did not check

- Executed nothing: no tests, no `check:arch`, no `check:rules`, no build; all behavior claims are
  from reading.
- `address()`, `hash64`, `compareCodePoints` in `gen_kit.js` (canonical key order for `same`).
- `tests/mixture_rule_modules.test.js`, `tests/world_pack*.test.js` and golden receipts, so the E3
  byte-equality claim is INFERRED.
- `tag_store.js` visibility semantics beyond what `rule_modules.js` and PC2-T2 show.
- `body_progression.js` beyond lines 10 to 18, and any heredity code (none found in `src/` by name).
- `craft_resolver.js` and `docs/RULES_INDEX.md`'s router (I used the task's named rules, not the
  router), and GR1 to GR17 beyond the rows cited.
- `scripts/check_architecture.mjs` baselines and whether `rule_modules.js` has a size cap.
- Worktree copies under `.claude/worktrees/`; I read the main checkout, which has
  uncommitted changes elsewhere (git status at session start).
