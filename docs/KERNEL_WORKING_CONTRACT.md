# Kernel working contract

*Version 0.6, 2026-11-12 (v0.1 to v0.5 published earlier the same day; changes in the [changelog](#changelog)). Owner: chat K in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md). Module: [`src/kernel_working.js`](../src/kernel_working.js). Contract tests: [`tests/kernel_working.test.js`](../tests/kernel_working.test.js). A proposal under AD56: it widens what every domain can do and every line is an adjustable default. Changes are versioned requests to chat K (MC2); domain chats do not edit the module.*

Not to be confused with `src/working_state.js`, which is the UI busy note for slow page actions.

## What a working is

A **method** is reusable data: typed roles, and ordered steps that each name an operation and say which role fills each of that operation's slots. A **working** is one attempt of a method with its roles bound to actual things. The kernel quotes it, settles each step at its own deadline, keeps a receipt per step with the truth and what the maker observed in separate fields, and saves one versioned record. It names no domain and no world: operations, durations, readers and authority all come from the caller (PFP3).

```
law      = defineWorkingLaw({id, revision, operations: {op: {roles: {slot: kind}, minutes?, settle}}})
method   = {id, revision, law: law.ref, roles: {role: kind}, steps: [{op, bindings: {slot: role}, minutes?, options?}]}
quote    = quoteWorking(law, method, {bindings, facts, at, ports})
record   = beginWorking(law, method, {id, bindings, facts, at})
{record, effects} = settleWorking(law, record, {now, ports})
ports    = {read(ref, at) -> thing | null, authority({working, method, step, op, at, bindings}) -> {ok, reason?}}
settle({bound, facts, options, at, address, step}) -> {ok: true, facts?, effects?, observed?} | {ok: false, reason, observed?}
```

## The five shapes on one page

The comparison that the contract was promoted from (review [F3/A4](audits/CODEX_FOUNDATIONS_REVIEW_2026-11-11.md)). `making_procedure` is included because it already owns timed steps over simulation jobs.

| | `craft_working` (+ `potion_workings`, `book_craft_workings`) | `spell_working` (+ `spellbook_workings`) | `creature_methods` (+ meadow courier, fleece, shell) | `gu_procedures` (+ Keeper procedure, goal search) | `method_program` (+ HP reactions, MOL light) | `making_procedure` (+ cast making, LOTM seer brew) |
| --- | --- | --- | --- | --- | --- | --- |
| **Roles** | Recipe slots with role (consumed, catalyst, solvent) and material selector; lots bound per trial | Dictionary row roles `{name, type}`; `worldRules.target(id)` checks type | Operation `roles: {role: kind}`; step bindings name refs; entity `kind` must match | Recipe roles `{id, kind, minRank, optional}`; binding role to `{id, operator}` | None; each operation has an input and output kind | Agents `{id, role, mode}` with a `requires` rule |
| **Steps** | `{op, level}` or a saved part expanding to steps | `{method, revision, bindings}` expanding to operations | `{op, bindings, options}`, up to 12 | Beats, each a group of roles activated together | Operation ids chained by kind | `{id, minutes, label, condition, agents}`, two or more |
| **Quote** | `compileCraftWorking`: stock check, recipe fit, whole-batch `resolveBatch`, setup | `compileSpellWorking`: bound plan; `nativeSpellSteps` lowers to commands | `planCreatureMethod`: facts threaded, effect intents, evidence | `runGuProcedure`: reserves, activations, effects; `searchGuProcedures` over bindings | `bindMethod`: kind chain check | `compileProcedure`: one timed command per step |
| **Settle** | Host (potion job `readyAt`, `settleWorkshop`) | Native owners run the commands | Host publishes intents | Host publishes debits and effects | World adapter | Simulation jobs; agents rechecked at admission and settlement |
| **Receipt** | `setup` (inputs, process, conditions); `recordWorkingTrial` with observer | None | `evidence: [{operation, bindings}]` | `activations` and `remaining` | None | Actor fact `procedure.<id>.step` |
| **Observed vs truth** | `craft_state` `observe` and `learnCraftWorking` per observer | None | None | `observeGuRefinement` (refinement only) | None | None |
| **Failure** | Throws at quote | Throws at compile | `{ok: false, operation, reason}` | `outcome: 'interrupted'`, reason, attempted funding | Throws | Job refund or keep |
| **Interruption** | Host job only | None | Stops at the failing step | `stopBefore`, `controlFailedAt`, missing role at its beat; held effect expiry | None | Cancellation refunds the unfinished step; finished steps stay facts |
| **Time** | Host minutes per op and level (potion) | None | None | Preparation and development minutes; transition `dueAt` | None | Step minutes sum to the command duration |

**Where two or more agree, and so went into v0 (PFP5):** roles typed by kind and checked against the bound thing (craft, spell, creature, Gu); ordered steps over a world-supplied operation table (all six); quote as a pure forecast with the host publishing effects (craft, creature, Gu); failure as a reason tied to a step (creature, Gu); bound things reread at settlement (Gu, making procedure); finished steps stay settled when a later one stops (Gu, making procedure); step durations as data (potion, Gu, making procedure); observer kept apart from truth (craft, Gu refinement).

**Left in the domains for now:** whole-batch matter resolution (craft), lowering to native commands (spell), binding search (Gu), kind chaining (method program), job refund policy (making procedure).

## Rules (KW)

- **KW1. A law is a table of operations.** Each declares the kinds it acts on and a `settle` rule for one step. World numbers live in the operation data or the method, not in the kernel.
- **KW2. A method is data.** Roles with kinds, ordered steps, an optional duration per step (default: the operation's, else 0) and options. A canon case costs a method row (PFP1). A method is checked against its law's `ref` (`id@revision`).
- **KW3. Roles bind to actual things.** A binding is a reference `{kind, id}`. The record keeps only references; every step reads the current thing through `ports.read(ref, at)`. A thing that is gone or changed kind interrupts that step with cause `binding`. Hosts pass `read`: without it the references stand in for the things and nothing is reread, which is only fit for tests.
- **KW4. A quote is settlement run as a forecast.** `quoteWorking` runs the same steps through the same ports and keeps nothing. It takes the id the working will begin with, so draws and authority see the same step addresses in the quote and in settlement. What the quote shows is what settlement would publish if the world holds (PFP11: an NPC gets the same quote). An actor-scoped quote passes a reader over what that actor knows instead of the truth; settlement always reads the truth, so a wrong belief shows up as an interrupted step, not a hidden one (MC8).
- **KW5. The same result in one jump or many.** Deadlines are absolute minutes from the start. `settleWorking` settles every step whose deadline has passed, in order, each at its own deadline, and never reads the call time. Settling to T once and settling at any partition up to T give the same record and effects (tested for both consumers, plus a mutation check that fails when the call time leaks in).
- **KW6. Every port is asked at the step's time.** Readers and authority receive `at`, the step's deadline. Draws use the step's `address` (`<working>/<step>`) under GR1-GR17. A world that cannot answer for a past time settles its workings up to `nextWorkingDeadline` before it changes a bound thing (KW13).
- **KW7. The record is the save.** `beginWorking` keeps the method snapshot, references, start, deadlines, cursor, facts, status and receipts. Nothing else is needed to continue after a reload.
- **KW8. Interruption keeps what happened.** An operation that answers `ok: false`, a lost binding, a refusal by authority or the host's `interruptWorking` stop the working at that step with a cause and reason. Earlier steps and their published effects stand. Refunds are the domain's policy (making procedure refunds the unfinished step).
- **KW9. What the maker observed is not the truth.** Each receipt has `truth` (facts and effects) and `observed` (what the operation says the maker could see). `viewWorking` shows only `observed`. A failure shows only what its operation or authority answer says was visible (default: nothing beyond that the step stopped); the private reason stays in the receipt's `reason`, outside the view, as `observeGuRefinement` already does. A host's own stop is something the maker saw, so its reason is observed. Knowledge stays with its owners (`craft_state`, `discovery_codex`, MC8); the host writes what was learned through them.
- **KW10. One versioned save shape (OS8).** Records carry `schema: 'kernel.working@1'`. `restoreWorking` migrates through `WORKING_MIGRATIONS` one version at a time, then validates; an unknown version is refused so the owner can keep the original save. Each domain hangs its working records from its own save slice (AR6); the kernel registers no slice of its own.
- **KW11. Effects are intents the host publishes.** Settlement returns `{working, step, at, effect}` rows. The kernel never writes inventory, clocks or saves (AR3). Effect payloads are opaque to the kernel; W's contact layer reads their `kind` when present.
- **KW12. Authority is read at settlement (FG7).** Relationships, offers and permissions answer through `ports.authority` for each step at its time. An offer that has expired blocks the step that needed it. A step that settled while the offer held keeps its receipt after the offer ends; settlement never revisits a settled step.
- **KW13. Settle before the world changes.** When a host moves, spends or removes a thing that a running working binds, it first settles that working to the change time. This is what makes a support leaving partway (PFP7, LT31) land on the right step.
- **KW14. Contract versions.** The contract version is `KERNEL_CONTRACT_VERSION`. A change that alters a record's meaning bumps the schema and adds a migration; a new optional field does not.
- **KW15. Forecast fields.** An operation's answer may add `costs` (rows the host draws from its accounts, W quantities once embedded), `odds` (whole permille for this step) and `cause` (a short code the host turns into words). Quotes list them per step; receipts keep them in `truth`. The kernel does not combine odds: a caller that wants one number multiplies the steps it cares about. Optional fields, so no schema bump (KW14).
- **KW16. A quote has a fingerprint.** `workingFingerprint` hashes the law, method, bound references, starting facts, times, effects, costs and outcome. A host shows a quote, the maker commits to its fingerprint, and `beginQuotedWorking` re-quotes and returns `stale` instead of a record when anything changed. The record keeps the fingerprint and authority receives it at each settled step (not during a quote, where none exists yet). The pattern for standing terms (M's SMK7): terms that change the deal show up in an operation's costs, odds or effects, so they are hashed; the offer owner stores the fingerprint the maker accepted and refuses a step whose record carries another (tested). Rolling back several owners when a settlement fails stays with the host's transaction owner (AR3), as `book_craft_transaction` does today.
- **KW17. The quote an actor can make.** `quoteForActor` takes the actor, the bindings, `known(ref, at)` (what the actor knows of each thing), `knownFacts` (the actor's beliefs about the starting facts), `believedAuthority` (what the actor believes about permissions) and optionally `knowsMethod(actor, method)` (whether the actor knows the method at all; `spell_world_rules`' `knows` and `craft_state`'s `readCraftWorking` by observer answer it today, cause `method-unknown`). Every answer has the same fields; an ineligible one carries `null` minutes and fingerprint. It never reads the truth: a role the actor knows nothing of comes back as `{role, cause: 'unknown'}`, a refusal as the step, cause and reason code. Reasons are data; the host or operation writes the words (PRS). The player and anyone else with the same knowledge get the same quote (PFP11), and a wrong belief quotes as eligible and is then interrupted by settlement against the truth.

### Composed workings (SC6, v0.2)

Module [`src/kernel_compose.js`](../src/kernel_compose.js), tests [`tests/kernel_compose.test.js`](../tests/kernel_compose.test.js). A killer move, a combined spell, a recipe step that runs two processes and a formation are all one working made of other workings.

- **KW18. Slots are interfaces.** `defineComposition({id, revision, roles, slots})` declares each slot by what a filler must bind (`needs: {role: kind}`) and which composite role fills each (`bindings`). Each slot says whether its facts are `shared` (one table, as Gu essence reserves are) or `own` (kept under `part:<slot>`); there is no default, because shared facts collide. `minutes` on a slot is a duration dial for every filler step.
- **KW19. Fillers are chosen at bind time.** `composeWorking(composition, fillers)` takes any method that binds exactly the slot's roles and kinds, so a move or spell can be assembled from parts no book paired (NV2). The result is one ordinary law and method: quote, settle, partition, receipts, the actor quote and saves are the kernel's own, and a composition can fill a slot with another composition.
- **KW20. A filler stays one part.** Its steps are copied as they are, never split. A two-Gu beat settles all or nothing against a cloned reserve; splitting it would spend the first Gu alone (tested). A dictionary method's operations share one native transaction, while repeated casts stay separate steps.
- **KW21. The composite names its fillers.** Operations are `<slot>/<op>` and the law ref lists every filler's law ref, method id and revision, so a saved working restores only against the same fillers; `composedPart(op)` reads which slot a receipt came from.

First consumers, adapters in the test file, owners unchanged:

| Consumer | Composition | Parity check |
| --- | --- | --- |
| G: `resolveGuActivation` per beat | Three-core move, slots `lead` (one Gu) and `pair` (two Gu at once), shared reserves | Same reserves as `runGuProcedure` on the ch. 961 recipe, full and short (enough for Pulling Mountain, not Pulling Water); a move from three Gu the book never paired quotes and runs |
| S: `compileSpellWorking` + `nativeSpellSteps` per dictionary method | Hogwarts bench (levitation, summoning, release) and Cyoria slate (torch, direct light, oblique twice), own facts, one minute per cast | Exactly the native command lists the spell owner produces for the same drafts |

Both run the seven-test contract suite (now [`tests/kernel_contract_suite.mjs`](../tests/kernel_contract_suite.mjs), shared by every kernel test file).

### One identity, several kinds (SC7, SB1, v0.2)

Module [`src/kernel_identity.js`](../src/kernel_identity.js), tests [`tests/kernel_identity.test.js`](../tests/kernel_identity.test.js). A Gu is an item someone holds and a living body; a Beyonder characteristic is a person's remnant, then an item, then a potion input.

- **KW22. One id, several facets.** The registry maps an identity id to facets, `{kind: {owner, key}}`: which owner holds that aspect and under which key (`w.holder` and a holder id, `inventory` and an individual item key, a lifecycle individual, a claim). A kernel binding `{kind, id}` names the facet it needs, so one Gu binds as `body` in a feeding working and as `item` in a loan.
- **KW23. A cross-reference, not an authority (AR3).** The registry copies no count, health, custody or position; owners stay the one writer of their facts. One owner key belongs to at most one identity. Existing owners keep their own ids and are pointed at, not replaced: `item_identity` (what an observer calls the item), `material_lineage` individual and heirloom keys, `creature_lifecycle` individuals, `gu_world_claims` living claims.
- **KW24. Changing kind keeps the individual (MR41).** `changeFacets` removes and adds facets in one change with its time and cause; the history says when the remnant became an item and the item a brew input.
- **KW25. Read through the owners.** `identityReader(registry, owners)` is an ordinary `ports.read`: the facet's owner answers for its key at the step's time, and the answer carries the identity id, the bound kind and the facet. A death removes the body (the W holder) while the item facet still reads. Hosts settle any running working that binds an identity before calling `changeFacets` on it (as KW13). A stack is not one thing: an owner answer with `count` above one reads as absent, so an identity points at an individual key (split a stack first, as `material_lineage` does).
- **KW26. One versioned save.** `kernel.identity@1`, validated on restore (unknown versions and two identities claiming one owner key are refused). Where it lives in the game save is settled at embed (request to W and the integrator below).

### Workings that meet (KB8, v0.3)

Module [`src/kernel_meet.js`](../src/kernel_meet.js), tests [`tests/kernel_meet.test.js`](../tests/kernel_meet.test.js). A hit lands before a killer move's last beat (C); a Counterspell ends a cast in flight (S).

- **KW27. One working can stop another.** `settleTogether(entries, {now, ports, meets})` settles several running records step by step. After each successfully settled step, the caller's `meets({settled, running})` sees that step's effects and the next step of every other running working, and returns interrupts `{working, reason, observed?}`. An interrupted receipt has cause `interrupt` and `by: {working, step}`; the maker sees only `observed`. What counts as a hit or a counter is the caller's rule (C's contest, S's grammar), never the kernel's.
- **KW28. One fixed order.** The next step is the earliest deadline, then the order dial (a readiness, C's K4; lower first, default 0), then the working id. A strike due in the same minute as the pair beat lands first only if its order is lower.
- **KW29. One level, no cascade.** Interrupts apply at the settled step's time and do not call `meets` again. Effects landing on whatever is present, and chains of reactions, are W's contact layer (WSC7-WSC9). Ending an active effect (Nox ending Lumos, S's SQ15) is a W law-field removal, not a kernel interrupt.
- **KW30. The same meeting in one jump or many; each record saves alone.** The set settled to `now` once or in any partition gives the same records and effects (tested, plus a mutation that applies interrupts at the call time and fails). There is no meeting record: each working saves as `kernel.working@1` and the host passes them in again.

### Grammar refs and bounded search (PR2, PR3, v0.4)

Module [`src/kernel_search.js`](../src/kernel_search.js), tests [`tests/kernel_search.test.js`](../tests/kernel_search.test.js).

- **KW31. Frozen with their grammar (PR2, PM7).** A generated method carries `grammar: '<id>@<revision>'`, the ref P's grammar values already use; a composition may carry one too, and each filler's grammar joins the composite law ref. The record snapshots the method, so the ref is saved with it, and the fingerprint includes it. A grammar revision changes only what has not been frozen: the host rebuilds a saved composite from the frozen fillers it stored, and a filler from a newer grammar makes a different law that the old record refuses. An identity may also keep the grammar ref of what generated it (`addIdentity({grammar})`, `identityGrammar`); its frozen values stay with their owners.
- **KW32. Search has a budget per settlement (PR3).** `searchForActor({actor, candidates, known, knownFacts, believedAuthority, knowsMethod, at, budget: {trials, steps}, keep, limit})` quotes candidate workings from what the actor knows. A trial is one quoted candidate; steps count the forecast steps those quotes settle and stand in for a time budget, because wall-clock time would make a reload search differently (PR1). Both are dials per actor; the default is 64 trials and 512 steps.
- **KW33. Same inputs, same search.** Candidates are tried in the given order and the search stops before a trial the budget no longer covers, so options, rejections and `truncated` repeat exactly. The player and every NPC call the same search (PR6); with the same knowledge and the same working ids they get the same result.
- **KW34. Goals and reasons.** `keep(quote)` is the actor's goal (PM3); options are eligible quotes that meet it, and every rejection keeps its reason, including `goal-unmet` (PM4). Where candidates come from (a move search, a grammar, a recipe book, `invention_planner`) is the caller's.

### Oaths that enforce themselves (LR13, v0.5)

Module [`src/kernel_oath.js`](../src/kernel_oath.js), tests [`tests/kernel_oath.test.js`](../tests/kernel_oath.test.js). The first canon case is the Harry Potter Unbreakable Vow (a vow to watch over and protect a named boy, made with a bonder, Half-Blood Prince's opening chapters); the locator is from memory and waits for a source dive before it becomes a fixed point (LR1, LR2).

- **KW35. Authority can attach consequences.** An authority answer that allows a step may add `effects` (published after the operation's own), `costs`, a `cause` and a `breach` mark; one that refuses may add costs and a cause. They join the receipt's truth, the quote and the fingerprint like an operation's KW15 fields.
- **KW36. An oath is data.** `defineOath({id, vower, parties, terms, penalty, enforce, madeAt})`. A term forbids or requires an act, matched by method, operation and who fills which role. The penalty is effects, costs and a cause; the canon Vow's is the vower's death. `enforce` is a dial: `penalize` (the act happens and the price is paid, the canon Vow) or `prevent` (a world whose oath stops the act).
- **KW37. Read at settlement.** `oathAuthority(oaths, {inner, brokenBefore})` is an ordinary authority port layered over any other: other authority decides first, then a step that breaks a forbid term after the oath was made carries the price. The vower's own quote (`quoteForActor` with this as `believedAuthority`) shows the lethal cost line while the act stays eligible; someone who does not know of the oath sees no price, and the price changes the fingerprint.
- **KW38. The price is paid once.** An oath is broken when a receipt carries its breach or a due breach was published; `oathBroken` derives it from those records, with no stored flag.
- **KW39. An undone duty breaks at its deadline.** `dueOathBreaches(oaths, {now, receipts, breaches})` finds require terms with no matching settled act by their deadline and returns the price rows at the deadline minute, so one jump and many give the same rows. The host publishes the effects; the kernel kills no one.

### One descent graph (DG1-DG7, PFP33, v0.6)

Module [`src/kernel_descent.js`](../src/kernel_descent.js), tests [`tests/kernel_descent.test.js`](../tests/kernel_descent.test.js). A recipe has a parent recipe, a spell a teacher, a sword its ore, a sect a founder, an estate its heirs; a bloodline is a query over the same edges.

- **KW40. Typed edges, one writer per kind.** Edges run descendant to ancestor between identity ids: `born-of` (L), `made-from` (F), `refined-from` (F, G, B), `taught-by` (N), `forked-from` (P), `inherited-by` (M, R; names what passed with `via`), `founded-by` (M). The kinds and writers are a table (`DESCENT_KINDS`) a world may extend.
- **KW41. Only observed ancestors (BX3).** Both ends must be identities the registry already holds, so an ancestor nobody has seen is not stored. Kinds that follow time one way (born-of, made-from, refined-from, forked-from) cannot loop; teaching, inheritance and founding can (two masters teach each other).
- **KW42. Walks are fixed-order queries.** `ancestors`, `descendants` and `descendsFrom` walk chosen kinds breadth first, ordered by depth then id, under a depth dial. Blood as a key (BL5) is `descendsFrom` on born-of; a teaching line is the same call on taught-by.
- **KW43. A bloodline is a query.** `bloodline(graph, id)` returns the observed born-of ancestors and what rides with the line (BL6): things passed between its members by inheritance, and teaching among them.
- **KW44. Purity is computed, and the unknown stays unknown (BL3).** `purity(graph, id, judge, {expected})` gives each observed parent an equal share; an unobserved parent slot (`expected` parents per world: 2 for bodies, 1 for a Gu propagated from one mother) or a founder the judge cannot place counts as unknown. The answer is `{matching, unknown, other}`. What purity means in law or prestige is M's; what blood does to a body is L's.
- **KW45. One versioned save** (`kernel.descent@1`) beside the identity registry, rebuilt edge by edge on restore so every rule is rechecked.

Existing owners and their edges (read, not replaced; each owner writes its own kind when it embeds):

| Owner | What it keeps today | Edges |
| --- | --- | --- |
| `lineage_traits.js` | `sire` and `dam` on each bred member (tested) | `born-of` (L) |
| `family_tree.js` | an ended life's heir by `kin` or `apprentice`, names only (tested) | `inherited-by` (M) for both, plus `born-of` for kin and `taught-by` for an apprentice; named ancestors become identities when observed |
| `village_family.js` | parents of each villager in `npc_lives` | `born-of` (L) |
| `material_lineage.js` | process history with inputs in the item key | `made-from` or `refined-from` (F, B) |
| `heir_inheritance.js` | what an ended life left and to whom | `inherited-by` (M) with `via` the item, estate or Gu |

## Save shape (OS8)

```json
{"schema": "kernel.working@1", "id": "strength-reversing-life-and-death.trial", "law": "kernel.test.gu-procedure@1",
 "method": {"id": "...", "revision": 1, "law": "...", "roles": {}, "steps": []},
 "bindings": {"operator": {"kind": "cultivator", "id": "player"}},
 "startedAt": 0, "deadlines": [120, 121, 122, 4442], "cursor": 1, "status": "running",
 "facts": {"reserves": {"player": {"immortal": 6}}},
 "receipts": [{"step": 0, "op": "prepare", "at": 120, "ok": true, "bindings": {"operator": "player"},
   "truth": {"facts": {}, "effects": []}, "observed": {"felt": "focused"}}]}
```

The validator checks the schema, the law, the method against the law, binding kinds, that saved deadlines match the method, and that the count of settled receipts equals the cursor.

**The migration path.** The first entry upgrades `making.procedure-step@1`, the saved progress of `making_procedure` (the actor fact `procedure.<command>.step`, the count of finished steps), into a kernel record at that step. The old owner already published those steps' effects, so migrated receipts are marked `migrated` with empty truth. The making chat calls it when it moves procedures onto the kernel. Compatibility line (MC4): no existing save key changes in this phase.

## Proof in this phase

Two existing consumers run through the contract suite with their own files unchanged; the adapters live in the test file.

| Consumer | Adapter | Canon or source |
| --- | --- | --- |
| `gu_procedures.runGuProcedure` and `finishStrengthReversal` | One kernel step per beat; preparation and development minutes from the recipe | Strength Reversing Life and Death, RI ch. 961 (`strengthReversingProcedure`) |
| `creature_methods.planCreatureMethod` | One kernel step per creature step | Courier-shaped attach and dispatch operations (the meadow courier's own table is module-private) |

Each passes: typed roles and refusals, a pure quote equal to settlement, one jump versus every minute versus random partitions, save mid-run and reload, a bound thing leaving at the same step under any partition, authority lapsing mid-run and a settled receipt surviving the offer's end, and the observed-only view. The Gu adapter's per-beat run spends the same essence as the whole-recipe run.

## What v0 cannot express yet (backlog, by owner)

| Code | Gap | Default proposal | Owner |
| --- | --- | --- | --- |
| KB1 | Gu modifiers that carry from one beat to the next stay inside `resolveGuActivation`, so a per-beat split loses them | G exposes the modifier list as returned facts | G, request to K only if a field is needed |
| KB2 | Whole-batch matter resolution: `resolveBatch` settles the whole process at once, so heat partway through a brew is not a step state (LT31) | B splits resolution per operation and keeps the batch as facts | B |
| KB3 | Costs paid at the start with a refund policy (potion pays at start; making procedure refunds the unfinished step) | v0.2 `costs` at begin plus a per-step refund dial, once B and F both move | K, on request |
| KB4 | Binding search (`searchGuProcedures`, `gu_goal_search`) for invention (P4) | v0.2 bounded search over bindings once a second domain searches | K with G and S |
| KB5 | Two workings competing for one thing (reservation) | Custody owners hold reservations; the kernel only reads | W and the custody owners |
| KB6 | Progress inside a step (rates while far away, SPR28) | W's detail level settles a step as a rate with the same total | W |
| KB7 | Lowering a step to native commands (spell) | Effects stay opaque; S lowers in its own host | S |
| KB8 | One working's settled step interrupting another running working | **Resolved in v0.3** (KW27-KW30) | K |
| KB9 | Quote fields for cost and odds, and a cause line | **Resolved in v0.2** (KW15, KW17) | K |
| KB10 | A law revision bump makes every saved running record of the old revision unloadable; migrations are keyed on schema only | Add law-revision migrations (old revision to new, per law) beside `WORKING_MIGRATIONS` | K, on the first domain that bumps a law (likely B or F) |

## Requests from sibling chats (2026-11-12)

From the shared notes. Covered means v0 already expresses it as data; no kernel change.

| From | Request | Answer in v0 |
| --- | --- | --- |
| A | Actor-scoped pure quote with eligibility reasons, cost, time, odds, cause | Done in v0.2: `quoteForActor` (KW17) with KW15 fields |
| B | A stop that settles completed steps | Covered: KW8 (`interruptWorking`, outside reader, authority); refund policy is KB3 |
| C | K1 several workings in one receipt, K4 ordering across workings | Done in v0.3: `settleTogether` with an order dial (KW27-KW30); each working keeps its own receipt, linked by `by` |
| C | K2 cut partway by an outside input; K3 a role that binds another actor or that actor's running working | Covered: a lost binding or authority refusal interrupts (KW3, KW12); a role of kind `actor` or `working` is ordinary data (KW3) |
| M | A trade working for any two holders, reading standing terms at settlement | Covered: two holder roles and terms through `ports.authority` (KW12); M writes the trade operation |
| F | Re-quote compare and atomic rollback across owners (FBD1), from `book_craft_transaction` | Re-quote compare done in v0.2 (KW16, `beginQuotedWorking`); rollback stays with the host transaction owner (AR3) |
| M | Settlement reads standing terms through the quote fingerprint (SMK7) | Done in v0.2: authority receives the record's fingerprint (KW16) |
| R | A crossing as a working with an optional attempt (risk, caller draw, outcome ladder), keeping the admission quote | Covered: the operation's `settle` owns the ladder and draws from the step `address` (KW6); the quote is kept by the caller |

## Next phase (K)

1. **Embed support.** Answer G, S, C and A as they move leaves onto the kernel; a move between `book_craft_transaction` and `beginQuotedWorking` with F.
2. **Retire one old shape** once its consumers move: `method_program` (three consumers in other chats' files) is the candidate; `spell_working`'s compile step goes once S embeds on the composition adapter above. K deletes nothing in another chat's files without that chat's move or consent.
3. **PFP7 join** with B and G once their leaves run on the kernel.

## Changelog

- **0.6 (2026-11-12).** KW40-KW45 descent graph (`kernel_descent.js`), its own record `kernel.descent@1`.
- **0.5 (2026-11-12).** KW35 authority consequences; KW36-KW39 oaths (`kernel_oath.js`), LR13. Optional fields, no schema change.
- **0.4 (2026-11-12).** KW31 grammar refs on methods, compositions and identities; KW32-KW34 `searchForActor` with a trial and step budget. Optional fields, no schema change.
- **0.3 (2026-11-12).** KW27-KW30 workings that meet (`kernel_meet.js`); `settleWorking` takes `maxSteps`; `interruptWorking` takes `by` and `observed`. Optional fields, no schema change.
- **0.2 (2026-11-12).** KW15 forecast fields, KW16 fingerprint and `beginQuotedWorking`, KW17 `quoteForActor`; KW18-KW21 composed workings (`kernel_compose.js`); KW22-KW26 identity (`kernel_identity.js`). Kernel failure reasons are codes (`role-unavailable`, `not-permitted`) with the role kept as data. No schema change.
- **0.1 (2026-11-12).** KW1-KW14, the record `kernel.working@1` and one migration.
