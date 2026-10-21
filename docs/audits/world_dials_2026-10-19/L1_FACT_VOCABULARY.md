CHECKPOINT: L1 fact vocabulary governance, 2026-10-19, doc only. Output file written; nothing else edited, committed, switched or pushed. Everything below is a proposal, not an accepted decision (WDI40).

# L1: Governance for the open rule-fact vocabulary

Lane of the [world dials audit](../WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md). Answers palette rows
[WDI7, WDI8, WDI9, WDI17, WDI24, WDI33](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md).
Rules applied: AR3, AR8, AR12 (architecture), GR5, GR10, GR12 (generation), AD7, AD38 (RULES_INDEX),
GHS5 (genetics plan). Evidence labels: SHOWN (read in code or doc this session), STATED (a doc says so),
INFERRED (my reading), MEMORY (none used).

## 1. What exists today

| Finding | Evidence |
|---|---|
| `RULE_FACTS` is a frozen map of five names to a JS type: `procedure.process` string, `input.mass` number, `source.ready` boolean, `station.owned` boolean, `evidence.witnessed` boolean | SHOWN `src/rule_modules.js:11` |
| A predicate can name a fact present in the `facts` map passed to `validateRuleModule`; the type check is `typeof value === facts[fact]`, `gte`/`lte` need `number` | SHOWN `rule_modules.js:30-31` |
| `validateRuleModule` and `compileRuleModules` already take a `facts` option, defaulting to `RULE_FACTS`; `world_pack.js` forwards `options.facts` | SHOWN `rule_modules.js:39,76`, `world_pack.js:40,93` |
| Two facts have a live producer outside tests: `procedure.process` and `input.mass` come from `mixture_rules.js` | SHOWN `src/mixture_rules.js:47`. The other three were not found outside `rule_modules.js` and tests (grep of `src`) |
| `source.ready` is read as an exemption's `sourceFact`; `evidence.witnessed` gates consequence proposals in the resolver; `station.owned` has no resolver read I could find | SHOWN `rule_modules.js:54,99,111`; INFERRED for `station.owned` |
| A missing fact is "unknown", not false: `known` is false and the rule is unmet with a reason | SHOWN `src/rules.js:25-29` |
| `context.facts` is caller-owned and carries no observer; knowledge enters through subject tags, where `tagFacts` omits hidden tags so the query is unknown | SHOWN `rule_modules.js:59-70`, `tag_store.js:80-114` |
| Tag definitions already carry `id`, `kind`, `parents`, `revision`, `visible` (`open` or `hidden`); saved definitions stay the read authority and a revision change is reported as a diagnostic, not silently applied | SHOWN `tag_store.js:38-47,201-232` |
| Body state reaches rules as hand-written facts: `body.handsTender`, `body.callused`, `body.marked`, derived by `bodyFacts(state)` from simulation conditions and `people.player.body` | SHOWN `body_progression.js:65-70` |
| Body sources carry `id`, `revision`, `kind:'trait'`, `origin` (inherited, trained, acquired) and `grants` of capabilities | SHOWN `body_progression.js:16-18` |
| GHS5 proposes constitutions as body sources with `origin:'inherited'` through the capability pipeline (MT1) | STATED `docs/GENETICS_AND_HERO_START_PLAN_2026-10-17.md:60` |
| The five-fact map is a different thing from the tag fact space (`subject.tag.<id>`), which `compileTagQuery` builds on the fly and `validateRuleModule` checks against a `TagRegistry` | SHOWN `rule_modules.js:33-38,44` |

Reading: the system already has two fact channels. Scalar facts are a closed type map. Tag facts are an
open, registry-governed set with revision and visibility. The proposal below borrows the tag registry's
discipline for scalar facts instead of inventing a third mechanism (AR3, AR11).

## 2. The fact registry: shape

**Default.** One immutable `FactRegistry`, built like `TagRegistry` (frozen, revisioned, rejects typos
and cycles). `validateRuleModule({facts})` receives the registry's `{name: type}` view, so the existing
option is the seam and no second evaluator appears (palette ACCOUNT FOR NOW, AR3).
**Dial.** One registry per world pack overlaid on a core registry (GR8), when a world needs a fact no
other world reads. **Reason.** A fact with one reader in one world should not widen core.

### 2.1 Entry fields

| Field | Meaning | Default | Dial and reason |
|---|---|---|---|
| `id` | Dotted name `<namespace>.<noun>[.<qualifier>]`, lowercase | Required | Qualifiers deepen as a domain grows |
| `revision` | Positive integer, as tags | 1 | Bumps on any change to meaning, type or unit |
| `type` | `boolean`, `number`, `string` (today's three), plus `enum` with a closed value list | `boolean` | `number` needs `unit`; `enum` replaces free strings so a typo is a validation error |
| `unit` | For numbers: `mass.g`, `count`, `ratio`, `minutes` | Required for numbers | Rational-valued facts are not proposed; resolver values stay rationals, facts stay JS numbers (INFERRED from `rule_modules.js:31`) |
| `kind` | `mechanism`, `identity` (see 3), `derived` | `mechanism` | `identity` needs a stated reason |
| `owner` | The one module that produces the value (AR3), named by registry id (`src/domain_registry.js`) | Required | Ownership transfer is a revision with a note |
| `producer` | `owner` function or projection that supplies the value in a context | Required | See 2.3 |
| `source` | `truth` or `knowledge` (see 4) | `truth` | `knowledge` facts name the knowledge key they read |
| `consumers` | List of dials or resolvers that read it | At least one (GR12) | Empty list fails the coverage lint (section 8) |
| `status` | `active`, `deprecated`, `retired` | `active` | See 7 |
| `since` / `deprecatedBy` | Revision at which it appeared; replacement id | `since` required | |
| `reason` | One line: why this fact exists in mechanism terms | Required | Lints reject a reason that just restates the id |

### 2.2 Namespace and ownership: one authority per fact (AR3)

Namespaces follow the owner domain, not the world. A world selects which facts its modules may read; it
does not own the meaning.

| Namespace | Owner (proposal) | Examples | Notes |
|---|---|---|---|
| `procedure.*` | Making/crafting domain (MR rules) | `procedure.process`, `procedure.station.heat` | Describes the step being taken, not the product's name |
| `input.*` | Making domain, over the item model | `input.mass`, `input.burns`, `input.ingestible` | Mechanism properties of materials in the step |
| `station.*`, `tool.*` | Making domain, over custody/ownership | `station.owned`, `tool.edge`, `station.heat.max` | Maker facts, section 6 |
| `maker.*` | Making domain, reading skill and mastery owners | `maker.skill.level`, `maker.mastery.process.<id>` | Section 6 |
| `body.*` | `body_progression.js` / body-health domain | `body.handsTender`, `body.constitution.<trait>.active` | Section 5 |
| `source.*` | Whichever domain holds the permission (institution, world law) | `source.ready` | The shape `sourceFact` already uses for exemptions (SHOWN `rule_modules.js:54`) |
| `evidence.*` | Knowledge/observation domain | `evidence.witnessed` | Gate for consequences (SHOWN `rule_modules.js:111`) |
| `world.*` | World pack loader | `world.dial.<id>` read-backs | Dial values exposed as facts when another dial needs to read them (rare; see 9) |
| `actor.*`, `location.*` | Existing `evaluateRule` contexts | Not in this registry | The older `rules.js` facts (`actor.body.enrolled`, `location`) belong to the command layer and stay there |

**Default** one owner per id, enforced by a lint that fails if two registry entries share an `id` or if
two modules claim `producer` for it. **Dial** an owner may delegate computation to a helper module; the
registry still names one owner. **Reason** AR3. A fact written by two modules drifts, and a receipt
could not say which meaning applied.

### 2.3 Producers: how a fact gets into `context.facts`

**Default.** A fact producer is a pure function `(state, ids) -> value` registered next to the fact,
modeled on `bodyFacts(state)` (SHOWN `body_progression.js:65-70`). The route builder (for example the
`mix` route in `mixture_rules.js:47`) names which facts it supplies. A fact not supplied is unknown, and
unknown fails the predicate closed with a reason (SHOWN `rules.js:25-29`).
**Dial** a route may supply a subset; a rule that needs an unsupplied fact fails admission for that
route rather than at play time (see 8, check C3). **Reason** a rule that cannot evaluate is dead prose.

## 3. Mechanism facts versus name facts (AD38, WDI8)

AD38 says things work by how they work, whatever the label (SHOWN `docs/RULES_INDEX.md:201`). In the
fact vocabulary that becomes a classification, not a ban.

| Class | Test | Examples | Default stance |
|---|---|---|---|
| Mechanism fact | Describes what the thing does, is, or can bear in the step, measurable or checkable by the world's law | `input.burns`, `input.ingestible`, `input.mass`, `station.heat.max`, `body.palms.callused` | Preferred; the registry's normal case |
| Identity fact | Says which designated thing it is: a lineage, a canon item, a title, a rank | `input.id`, `body.constitution.<canon_name>.active`, `maker.guild.member` | Allowed when identity is the mechanism (a lineage carries a bloodline; a guild member holds a permit) and `reason` says so |
| Name fact | Matches a label, category word or display string to decide behavior | `input.name eq "healing herb"`, `item.category eq "potion"` | Rejected at admission; a shim path exists (below) |

**Default** facts of kind `identity` carry a `mechanismReason` naming what the identity stands for in
the world (an inherited vessel, a license). **Dial** worlds whose law is genuinely lineage-bound (a
bloodline art that the line alone can use) mark the fact `identity` with that reason. **Reason** AD38
rejects a permission list, not identity that is itself the mechanism.

### Lint idea for name facts (proposal, `check:rules` family)

Static checks on the registry and on rule modules, runnable without play:

1. **N1 type check.** A `string` fact with no `enum` list and a name matching `*.name`, `*.label`,
   `*.category`, `*.title` or `*.display*` fails. Free strings invite label matching.
2. **N2 value check.** A predicate that compares a string fact to a value that appears as a display label
   in item, recipe or tag content tables is flagged for review. The label corpus is the same one
   `check:rules` already loads for content (INFERRED; I did not read `check:rules`).
3. **N3 category-as-permission.** A rule module whose `selector.requires` contains just `eq` tests on
   identity or enum facts, with no mechanism fact and no tag query, is flagged. That pattern is an
   allow list in rule form (GR7: tags admit; the owning law resolves).
4. **N4 label rename test.** Run the golden fixtures with every item label replaced by an opaque id.
   Outputs must match. A diff means a name fact leaked into a predicate. This is the cheapest and most
   direct AD38 test.
5. **N5 coverage by mechanism.** Each `identity` fact needs a `mechanismReason` of at least one sentence
   and a second mechanism fact in the same module, or a waiver note in the registry entry.

**Default** N1, N3, N4 block; N2, N5 warn. **Dial** warnings become blocks per world once the corpus is
stable. **Reason** N4 catches what static rules miss; the others keep authors honest earlier.

## 4. Truth versus knowledge (GR5, WDI9, AR8)

GR5: the generator writes truth; a projection writes what the player knows (SHOWN
`GENERATION_FOUNDATION_RULES_2026-10-14.md:35`). AR8: world truth resolves effects even when unknown;
shown reasons use observer knowledge (SHOWN `ARCHITECTURE_RULES.md:39,80-83`).

### 4.1 The flag

| Value | Meaning | Who reads it |
|---|---|---|
| `truth` | The value is what the world is. Resolves effects. | `resolveRuleEffects` and every outcome calculation |
| `knowledge` | The value is what a named observer knows or perceives (a stage of a knowledge key, a perception band) | Explanation, preview, watch lists, NPC reasoning for that observer |

**Default** `truth`. A `knowledge` fact is allowed in `selector.requires` by default for modules of kind
`institution_policy`, `learned_technique` or `cheat_overlay` (a guild bans what a guard has seen; a
technique needs the performer to understand). It is rejected for `world_law` and `generated_law` modules,
because a law must not change when an observer learns something (AR8, AD7).
**Dial** a world where belief is mechanism (a faith world, where a rite works if the celebrant believes)
registers the belief as its own `truth` fact owned by the actor domain, with a reason. **Reason** that
keeps the flag honest: belief that moves outcomes is truth about the actor, not knowledge about the world.

### 4.2 How a predicate reads knowledge for an observer

Today `matchRuleModule` takes one `observer` option and applies it to subject tags (SHOWN
`rule_modules.js:59,65`). Scalar facts have no observer. Proposal:

1. **Two evaluations, one module.** The resolver evaluates a module against truth facts for the
   outcome. For the receipt shown to a player, a second pass evaluates the same predicate against a
   fact map projected for the observer. The outcome does not use the second pass.
2. **Projection function.** Each `knowledge` fact has `producer(state, observerId)`. Absent knowledge
   returns no key, so the fact is unknown, which evaluates to unmet with a reason (existing semantics,
   SHOWN `rules.js:25-29`). Hidden tags already behave this way (SHOWN `tag_store.js:108-113`).
3. **Truth facts shown to an observer.** A truth fact is displayed when its registry entry names a
   `knowledgeKey`, and then up to the stage that key has reached. Otherwise the explanation says
   "unknown" rather than a value or a fabricated one. Sealed secrets surface by ID, route and
   status (AGENTS.md sealed secrets).
4. **Explanation text.** The receipt lists refs (SHOWN `rule_modules.js:112`). The explanation layer
   maps a ref to prose through the observer projection; it does not print the predicate's truth fact
   value for an observer who cannot read it. Dial values leak the same way (WDI35), so the same filter
   applies to dial read-backs.
5. **Safety boundaries** may use truth (AR8). They are a consumer role, declared on the dial's coverage
   row (section 8), not a property of the fact.

**Default** one projection per observer role (player, NPC by id, institution). **Dial** an omniscient
director view reads the truth pass, behind the dev flag already used for seed visibility (SB15).
**Reason** the director inspector (WDI16) then shows both passes side by side without a third store.

## 5. Constitution and body facts (WDI17, WDI20, WDI21, GHS5)

Body sources already exist and are the producers. The registry does not duplicate them (AR3).

| Rule | Proposal |
|---|---|
| Source-derived presence facts | For each registered body source `s` (SHOWN `body_progression.js:16-18`), the body domain derives `body.source.<id>.active` (`boolean`, `truth`). One derivation, no hand-written fact per trait |
| Capability facts | For each capability (SHOWN `bodyCapabilities`, line 20), `body.capability.<id>` as `number` (`unit:count`), derived with the capability's `stacking` rule (the pipeline owns stacking; the registry only names the fact) |
| Condition facts | `body.condition.<id>.active` as `boolean`, derived from `intensity > 0` and `expiresAt` the way `current()` does it (SHOWN `body_progression.js:66`) |
| Origin facts | `body.source.<id>.origin` as `enum {inherited, trained, acquired, ...}` so a dial can treat inherited and acquired alike or differently without a name test (WDI20, G11) |
| Existing hand-written facts | `body.handsTender`, `body.callused`, `body.marked` stay as they are: they belong to the commands layer (`rules.js`) and are not in this registry until a rule module needs them. When one does, it registers as a `derived` fact with the same owner |
| Constitution traits | A constitution is a body source (GHS5). Its mechanism facts come from the capabilities it grants, not from its name. A world that wants a predicate on the constitution itself registers `body.source.<id>.active` as `identity` with `mechanismReason` |
| Knowledge side | `bioDetail` and `bioVisible` (SHOWN `body_progression.js:16,22`) already model what the observer can read. A `knowledge` projection for body facts reuses them and adds no second flag set |
| Physics dials | A physics dial reads `body.capability.*` (WDI21), not a constitution name |

**Default** 1 derived fact per source/capability/condition id, produced by one function in the body
domain. **Dial** a world may restrict which source kinds emit facts (heavy-handed worlds may emit just
capabilities). **Reason** the number of registry entries then tracks the content tables, with no
hand-maintained list to drift (AR3).

## 6. Crafting maker facts (WDI24, WDI25, WDI23)

Maker facts are facts of the actor, tool and station for one step, produced by the making domain over
the owners of skill, custody and mastery. Wording follows MR and WR rows (SHOWN
`docs/CRAFTING_ENGINE.md:105-114` for WR1 to WR10).

| Fact (proposal) | Type, unit | Owner | Read by (dial) |
|---|---|---|---|
| `maker.skill.<domain>.level` | number, count | Skill/XP owner | WR8 quality model, WR2 operation availability |
| `maker.mastery.<process>.rank` | number, count | Mastery owner (WDI26) | WR2, WR8: mastery rewrites process through an actor-layer module |
| `tool.<slot>.edge` / `tool.<slot>.capacity` | number, per tool kind unit | Custody/items owner | WR6 apparatus requirements |
| `station.<kind>.present` | boolean | Making domain over location | WR6 (the live `station.owned` is the closest existing fact, SHOWN `rule_modules.js:11`) |
| `station.<kind>.heat.max` | number, `temp.c` or world-relative unit | Making domain | WR2 (heating steps), WR6 |
| `input.<property>` | by property (`burns`, `ingestible`, `mass`) | Items owner, via tags where the property is presence-only | WR3 substitution: the functional profile is a set of mechanism facts, not an ID |
| `maker.body.<capability>` | number | Body domain (re-exposed, not re-owned) | WDI24 fire-touched body changes a heating step through one predicate on `body.capability.*` |
| `drinker.tolerance.<substance>`, `drinker.side_effect.<id>.active` | number / boolean | Body domain | WDI25 (substance meets the drinker's body, G36) |

**Default** a maker fact carries the step's context, not the product's name. WR3 (substitution) is
therefore expressed as a profile of `input.*` mechanism facts that a substitute must satisfy (exact
identity is the identity-kind case, allowed with a reason). WR8 (quality model) reads
`maker.skill.*`, `maker.mastery.*` and `tool.*` facts and returns a dial through the existing
`parameter` effect.
**Dial** WR3 setting per world: exact identity, functional profile, or none (SHOWN
`CRAFTING_ENGINE.md:107`). **Reason** the three settings differ in which facts the predicate reads.

**Resolver limit I did not resolve here (belongs to L2).** `RULE_TARGET` is one string and parameters
require `channel:'physics'` (SHOWN `rule_modules.js:12,51`), so a quality dial and a substitution dial
need targets the resolver does not yet admit. This doc registers the facts; it adds no target.

## 7. Mapping the five existing `RULE_FACTS`

| Existing | Proposed id | Type, unit | Kind | Source | Owner | Reader today | Notes |
|---|---|---|---|---|---|---|---|
| `procedure.process` (string) | `procedure.process` | `enum` seeded from the Village process list (needs list; INFERRED from `mixture_rules.js:47`) | mechanism | truth | Making domain | Village mix rules (SHOWN `mixture_rules.js:47`) | Free `string` becomes enum under N1. Enum values are a revision-controlled list |
| `input.mass` (number) | `input.mass` | number, `mass.g` (unit unconfirmed; INFERRED, source of `base.mass` not read) | mechanism | truth | Items/Making domain | Village mix rules | Unit must be confirmed from the producer |
| `source.ready` (boolean) | `source.ready` | boolean | mechanism | truth | Domain holding the permission | Exemption `sourceFact` (SHOWN `rule_modules.js:54,99`) | Likely better named per source (`source.<permission>.ready`); the exempt module already names its fact, so a rename is possible with a deprecation entry |
| `station.owned` (boolean) | `station.owned` | boolean | mechanism | truth | Making domain over custody | None found in the resolver (INFERRED) | Candidate for `station.<kind>.present`; fails GR12 until a reader exists. Flag, do not remove |
| `evidence.witnessed` (boolean) | `evidence.witnessed` | boolean | mechanism | **knowledge-adjacent** | Knowledge/observation owner | Consequence proposals (SHOWN `rule_modules.js:111`) | Reads whether an in-world witness exists. As an engine fact it is truth about the witness; an observer's belief about it is a separate knowledge fact. The resolver reads truth, correctly |

**Default** all five keep their ids at registry revision 1 so no existing module changes
(`world_pack.test`/`rule_modules.test` fixtures use the same strings, SHOWN `tests/rule_modules.test.js:7`).
**Dial** renames follow the lifecycle in section 8. **Reason** the first slice should be behaviorally
neutral (AR9).

## 8. Fact lifecycle and saves

| Action | Default procedure | Dial and reason |
|---|---|---|
| **Add** | New entry at `revision:1`, `status:active`, at least one `consumer`. Admission refuses an entry with no reader (GR12) and refuses a duplicate id | A fact may land one release before its reader if it is marked `staged` and the coverage check lists it as a warning, not an error (a window of one revision) |
| **Change meaning, type or unit** | Edit by adding a revision instead of in place. Add `id@rev+1`, keep the old revision readable | The old revision stays resolvable while any saved rule lock references it (below) |
| **Rename** | Add the new id; the old entry becomes `deprecated` with `deprecatedBy`. A read alias maps old to new for validation; producers write the new id | An alias lives at least until every shipped rule lock that names the old id is retired or re-locked |
| **Deprecate** | `deprecated` entries still validate, and the lint warns on new modules that use them | Auto-convert with a pure, listed mapping |
| **Retire** | `retired` fails admission for new modules; existing locks still load (saved definitions are the read authority, as with tags: SHOWN `tag_store.js:201-203`) | Retirement without a mapping needs a note in the world's compatibility record |
| **Saves** | Rule locks already record `refs` of `id@revision` and a fingerprint (SHOWN `rule_modules.js:89-92`). The registry adds `factRefs` (`id@rev`) per module so a lock names the exact fact meanings it was validated against | AR6: a save slice changes with a migration or an explicit compatibility decision. The 2026-10-17 decision currently allows dropping old state (STATED `ARCHITECTURE_RULES.md:37`); this proposal assumes migration is cheap and still provides it |
| **GR10 revisions** | Seen consequences freeze (GR3); unseen futures take the new revision; receipts record fact revisions with the module refs | A patch that changes a fact's meaning is a revision, so addresses carry it (WDI30) and unseen generation is re-derived, never the seen past |
| **Idle catch-up** | A fact read during catch-up uses the same producer and revision as live play | GR17: equivalent segmented processing keeps the same draws and facts |

Deprecation leaves a frozen value unchanged. A saved receipt keeps its old fact refs, which is why the
registry keeps retired entries readable.

## 9. Dial coverage list template (WDI33, GR12)

A dial with no reader is dead prose (GR12). Template for the coverage list the registry lint reads, one
row per dial. The rule from the palette: no empty reader cell.

| Dial id | World(s) | Fact(s) it reads | Consumer (module and function) | Truth or knowledge | Observer role shown to | Default | Range | Reason and cost | Test (GR16) |
|---|---|---|---|---|---|---|---|---|---|
| `<namespace>.<name>` | `world.id` or `core` | `fact.id@rev`, ... | `src/....js#fn` or rule module id | `truth` / `knowledge` | player / NPC / institution / director | value | min to max | in-world reason and cost | seed sweep, golden, save/reload/import |

Lint (proposal):

| Check | Fails when | Level |
|---|---|---|
| C1 reader | A registered dial or fact has an empty `Consumer` cell | Block |
| C2 producer | A fact in a rule module has no producer in the route that evaluates it | Block |
| C3 route supply | A module requires a fact its route does not supply (`mix` supplies `procedure.process`, `input.mass` today; SHOWN `mixture_rules.js:47`) | Block at admission |
| C4 single owner | Two entries or two producers claim one id | Block |
| C5 observer | A `knowledge` fact appears in a `world_law` or `generated_law` module (section 4.1) | Block |
| C6 shown filter | A dial read-back reaches a UI/explanation path with no `knowledgeKey` or observer role | Block (WDI35) |
| C7 stale | A `deprecated` fact used by a module newer than the deprecation | Warn |
| C8 name facts | Section 3, N1 to N5 | Block/warn as listed |

**Default** the coverage list is generated from the registry plus the world pack, then diffed against a
checked-in snapshot. **Dial** worlds in draft may carry unread dials marked `draft`; they do not ship.
**Reason** unread dials otherwise accumulate silently as authors add settings.

## 10. Smallest first slice and done check

**Slice S1: governed registry, behavior-neutral.** Proposal; no build is selected (WDI40,
AGENTS.md consistency gate).

1. A `FactRegistry` module beside `tag_store.js` containing the five existing facts at revision 1 with
   type, unit, kind, source flag, owner id, consumers and reason (section 7). It exports the same
   `{name: type}` map `RULE_FACTS` exposes, so `validateRuleModule(..., {facts})` and `world_pack.js:93`
   run unchanged (SHOWN option exists).
2. Admission lint C1 (reader), C4 (single owner) and a stub of N4 (label-rename test on the Village mix
   fixtures) wired into `npm run check:rules`.
3. One dummy-free second fact, chosen from an existing producer, to prove the open seam (AR11): the
   natural candidate is a body-derived fact (`body.condition.body.sore_hands.active`), because
   `bodyFacts(state)` is already a producer (SHOWN `body_progression.js:65-70`) and the second case is
   in a different domain.
4. Seam: registered through the domain registry (`src/domain_registry.js`, AR2) with at most one
   registration line per hot file, paid for by moving one out (AR1). Not yet verified that this
   registration is possible without a `main.js` line; check before dispatch.

**Done check (all must hold):**

- `npm run build && npm test`, `npm run check:arch` and `npm run check:rules` pass; `check:rule-behavior`
  maps the new lint codes.
- Every existing rule-module and world-pack test passes unchanged (neutrality, AR9).
- A seed sweep over the Village mix (GR16) returns identical outputs before and after, and a golden
  snapshot on three seeds matches.
- Save, reload and import of a rule lock reproduces the same `refs`, `fingerprint` and next resolved
  value; the lock additionally lists `factRefs`.
- N4 passes: relabelling every Village item to an opaque id leaves resolved values unchanged.
- C1 fails on a deliberately unread fixture fact and passes on the five-plus-one registry.
- Net change surface (AR13): one new module, no edit to the resolver's logic beyond reading the
  registry's map.

**Not part of S1 (deferred):** opening more resolver targets (L2), the `knowledge` second pass and
explanation layer (section 4.2), per-world overlays, maker and constitution facts beyond the proof fact,
and any UI. Each needs its own go (palette L3 held).

## 11. Open questions

1. **Q1 Unit of `input.mass`.** Which unit does the producer use (grams, an abstract count)? Needed for the
   registry unit.
2. **Q2 Who owns `procedure.process`'s value list.** The making domain or the Village mixture content?
   Needed to turn the free string into an enum.
3. **Q3 Does `station.owned` have a reader?** I found none in the resolver. If not, S1 flags it under C1
   as staged or removed.
4. **Q4 One registry or one per pack.** Proposal is a core registry plus pack overlays (GR8). Depends on
   the scale plan's overlay format (WDI12, WDI39); this doc does not choose.
5. **Q5 How `knowledge` facts attach to the existing knowledge keys** (`stage: seen / understood`, SHOWN
   `body_progression.js:28,41`). Does the knowledge owner expose a stable `(actor, key) -> stage`
   function the projection can call?
6. **Q6 Whether `identity` facts need a lint on count** (many identity facts in a world may signal an
   allow list). Threshold unset.
7. **Q7 Interaction with L2.** Section 6's WR3 and WR8 need targets the resolver does not admit
   (`rule_modules.js:12,51`). L2 owns that answer; if it differs from my reading, sections 6 and 10 move.

## 12. What I did not check

- Whether `npm run check:rules`, `check:rule-behavior` or `check:arch` currently pass, or how they are
  implemented. No command was run; code and docs were read without running anything. I did not check whether the dirty
  working tree (`.codex/config.toml`, `dist/*` and several docs show as modified) affects these files.
- `src/check_rule_pack.js`, `src/effect_dsl.js` and `src/domain_registry.js` (not read). Claims about
  registration, the lint harness and `check:rules` are inferences from the task text and AR2.
- Other producers of `RULE_FACTS` names under `src` beyond a grep of five names; my grep
  (`--include` flags failed once, then I used a broader search) found none outside `rule_modules.js`,
  `mixture_rules.js` and tests.
- How `order()` ranks layers in practice and the resolver id literal (L2 and WDI37).
- The Village process list and item tag content, so N2 and N4 are untested ideas.
- Crafting engine details past the WR table (`CRAFTING_ENGINE.md:105-114`), MR rules and GHS5 beyond
  its table row, and any sealed-secret files.
- Remaining sections of `RULES_INDEX.md` (router) and GR beyond GR1 to GR17 text read above; the
  AD36 verification wording was taken from `AGENTS.md`.
- Whether an existing doc already defines a fact registry under another name (a repo-wide search was not
  run beyond the grep above).
- Duplicate or prior proposals in `docs/emergent/E4_TAGS_AND_RULES.md` (linked from the generation rules,
  not read).

Everything above is a proposal for Weibao's review; no code, save format or priority is changed.
