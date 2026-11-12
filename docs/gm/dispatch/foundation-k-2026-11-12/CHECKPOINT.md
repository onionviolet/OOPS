# Chat K · Kernel, checkpoint 2026-11-12

## Phase 6 (2026-11-12): one descent graph (DG1-DG7, PFP33)

Merged master at 4c476b518. Contract v0.6, KW40-KW45.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: 70 focused kernel tests (working 24, compose 20, meet 5, identity 5, search 5, oath 6, descent 5)
review: diff-scoped
surface: new leaf src/kernel_descent.js with its own record kernel.descent@1; reads lineage_traits and family_tree in tests only
```

- Typed edges descendant to ancestor between observed identities, one writer per kind (`DESCENT_KINDS`), no loops on time-ordered kinds, fixed-order walks, `bloodline` (ancestors plus inherited holdings and teaching among members), `purity` as `{matching, unknown, other}` with unobserved parent slots counted as unknown, `descendsFrom` for blood as a key.
- Tested over the real `lineage_traits.breed` pedigree (three generations) and `family_tree.extendLineage` chronicles (kin heir and apprentice); the other three owners' mappings are a table in the contract.

DC answers (one line each): carried by identities and edges (DC1); varies by kind and writer (DC2); spreads by the owners' own events (DC3); improved by the owners (breeding, teaching) not the graph (DC4); hidden ancestry is simply not stored until observed, and queries report unknown (DC5); magic adds edges through the owners' workings (DC6); canon families are lore rows first (BX4, LR1) (DC7); purity in law is M's (DC8); edges only, far populations as L's frequencies (DC9); the player reads lines, holdings and purity with their unknown share (DC10).

PFP2 counts (kernel scope): canon cases as data 4 before and 4 after; bespoke modules 0 and 0; working shapes 6 before, 5 after (S retired the old spell plan shape).

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_*.test.js` | 70/70 pass | Owners do not write edges yet |
| `npm run check:arch`, `npm run check:rules` | pass | |
| Full `npm test` | not run | Integrator (MC7) |

Could not express: a false or hidden parentage (BL8) needs N's known-versus-true layer on top: the graph holds what is true and observed, N holds who believes which edge. Far ancestry stays L's trait frequencies (GN8).

Requests: L, write `born-of` from `lineage_traits` and `village_family` at embed and fold `creature_lifecycle` inheritance (OA5) onto it; F and B, `made-from` and `refined-from` from `material_lineage` history; M, `inherited-by` from `heir_inheritance` and heirlooms, `founded-by` for sects; N, `taught-by` and the known-versus-true layer for parentage (BL8); P, `forked-from` for recipe, spell and move variants.

**K done check (plan table), now met on master 0d745f584 plus this branch:**

- *One contract that two domains run on with their focused tests passing:* met. Domain modules on the kernel: `spell_working` and `spell_law` (S), `agency`, `agency_wild`, `agency_household` (A), `craft_assembly` (F), `gu_working_law`, `gu_essence_line` (G), `market_trade` (M), `progression_path` (R), `living_workings` (L), `brew_law` (B), `contest` (C). Passing here: `agency`, `craft_assembly`, `gu_coverage`, `gu_working_law`, `market_foundation`, `progression_path`, `spell_grammar`, `spell_working` (95 of 112 across the twelve files).
- *One old shape retired:* met by S, which moved spellbook drafts onto the kernel and deleted `compileSpellWorking` and `nativeSpellSteps` (c0df2923d). K's adapters moved to S's `spellDraftCommands` in this phase. Working shapes in `src`: 6 before, 5 after.
- *A time-partition and reload test in the kernel's own suite:* met since phase 1.

**Failures outside K seen in this phase (for the coordinator, not caused by K):** 17 of 112 tests in `brew_law` (1), `contest` (8), `contest_consumers` (7) and `living_foundation` (1) fail on master 0d745f584. Every one is W's new effect-kind vocabulary refusing an undeclared kind: `heat_released` (B), `contest.blow` and `contest.settled` (C), `living.harm` (L reactor). K changed no existing `src` file this phase. Request: B, C and L declare their effect kinds in their packs' `publishes` or composeSubstrate `effectKinds` (W's fix), or W relaxes the check for packs not yet migrated.

Next phase (K): the plan's K done check is met; further K work is on request from embedding chats (G's MS4 moves on `composeWorking`, A's search consumer, owners writing their descent edges). `method_program` remains a candidate for a second retirement when its owners move.


## Phase 5 (2026-11-12): LR13 oaths that enforce themselves

Merged master at 9a804f1ac (plan section "Lore first, inheritance beyond genes, and a depth checklist"). Contract v0.5, KW35-KW39.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: 65 focused kernel tests (kernel_working 24, kernel_compose 20, kernel_meet 5, kernel_identity 5, kernel_search 5, kernel_oath 6)
review: diff-scoped
surface: new leaf src/kernel_oath.js; authority consequences in src/kernel_working.js
```

- **KW35.** An authority answer can attach effects, costs, a cause and a breach mark to the step it allows or refuses.
- **KW36-KW39.** An oath is data (terms that forbid or require an act, a penalty, an enforce dial), read as authority at settlement. Breaking a forbid term settles the act and attaches the price (canon Vow: the vower's death); the vower's own quote shows the lethal cost line while the act stays eligible; the price is paid once, derived from receipts; an undone required act breaks the oath at its deadline, the same in one jump or many. The `prevent` dial covers worlds whose oaths stop the act instead.

DC answers for oaths (DC1-DC10, one line each): carried by a relationship between vower, parties and bonder (DC1); varies by terms and price per oath (DC2); does not pass on, the vower carries it (DC3); not improved, only made or broken (DC4); hidden from anyone who does not know of it, so their quote shows no price (DC5); magic is the enforcement itself, its price the penalty (DC6); canon fixed point is the Vow's lethal price, locator pending a source dive (DC7); society's view of oaths is M's (DC8); one record per oath, derived state (DC9); the player reads the price in the quote and chooses (DC10).

PFP2 counts (kernel scope): canon cases as data 3 before, 4 after (the Vow pattern as an oath row; locator pending); bespoke modules 0 and 0; working shapes 6 and 6.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_*.test.js` | 65/65 pass | No host calls the kernel yet |
| `npm run check:arch`, `npm run check:rules` | pass | |
| Full `npm test` | not run | Integrator (MC7) |

Could not express: an oath whose term reads intent or a state of mind rather than an act (the canon Vow's "protect" is judged by the magic itself); v0.5 matches settled acts and deadlines only. Making the oath (the bonding ritual) is an S working; the oath record it produces is this shape.

Requests: S, the vow-making ritual as an S working that outputs a `defineOath` row; A, pass `oathAuthority` of the oaths an actor knows as `believedAuthority` so NPC choices weigh the price; M, contracts and sworn bargains can reuse `defineOath` with non-lethal prices; source dive owner, confirm the Vow's locator before it is a fixed point.

Next phase (K): support G's MS4 move rebuild and A's search consumer; retire an old shape when its consumers move.


## Phase 4 (2026-11-12): PR2 grammar refs, PR3 search budget (milestones MS1-MS7)

Merged master at 700ed2f39 (plan section "Making all achievable"). Contract v0.4, KW31-KW34.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: 59 focused kernel tests (kernel_working 24, kernel_compose 20, kernel_meet 5, kernel_identity 5, kernel_search 5)
review: diff-scoped
surface: new leaf src/kernel_search.js; optional grammar fields in kernel_working, kernel_compose, kernel_identity
```

- **PR2.** Methods, compositions and identities keep `grammar: '<id>@<rev>'` (P's ref format); filler grammars join the composite law ref and the fingerprint. A saved generated move restores against the frozen fillers and refuses a newer grammar's law.
- **PR3.** `searchForActor` quotes candidate workings from the actor's knowledge under `{trials, steps}` per settlement (steps stand in for time so reloads repeat, PR1); same inputs give the same options, rejections and truncation for the player and NPCs (PR6); goals via `keep`, reasons kept for every rejection (PM3, PM4).
- **MS4 readiness.** Composed workings (SC6, KW18-KW21) are on master already and ready for G's 23 canon moves; `tests/kernel_adapters.mjs` holds the Gu beat adapter G can copy.

PFP2 counts (kernel scope): canon cases as data 3 before and 3 after; bespoke modules 0 and 0; working shapes 6 and 6.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_*.test.js` | 59/59 pass | Adapters in tests; no host calls the kernel yet |
| `npm run check:arch`, `npm run check:rules` | pass | |
| Full `npm test` | not run | Integrator (MC7) |

Could not express: a wall-clock time budget (deliberately replaced by a step budget, PR1); where candidates come from stays the caller's (P's grammar, G's move search).

Requests: W, store a generated holder's grammar ref with its frozen values in the holder's pack slice (PR2), matching `grammar: '<id>@<rev>'`; P, keep the ref format stable, since K pins it in saves; G, MS4 moves can start on `composeWorking` now.

Next phase (K): support G's MS4 move rebuild and A's search consumer; retire an old shape when its consumers move.


## Phase 3 (2026-11-12): workings that meet (KB8)

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: 54 focused kernel tests (kernel_working 24, kernel_compose 20, kernel_meet 5, kernel_identity 5)
review: diff-scoped
surface: new leaf src/kernel_meet.js; settleWorking maxSteps and interruptWorking by/observed in src/kernel_working.js; adapters moved to tests/kernel_adapters.mjs
```

Contract v0.3, KW27-KW30. `settleTogether` settles several records in one fixed order (deadline, order dial, id); after each settled step the caller's `meets` hook may interrupt other running workings at that step's time, one level, no cascade. First consumers through the shared adapters: a C-shaped strike that lands before the three-core move's pair beat (the lead beat's essence stays spent) and a Counterspell that ends the Hogwarts bench cast before the summoning. Same result in one jump, every minute or random partitions; each record saves alone mid-meeting and the meeting continues the same.

PFP2 counts (kernel scope): before 3 canon cases as data, after 3 (no new canon; the meeting is new mechanism); bespoke modules 0 and 0; working shapes in `src` 6 and 6.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_working.test.js tests/kernel_compose.test.js tests/kernel_meet.test.js tests/kernel_identity.test.js` | 54/54 pass | Adapters in tests; no domain host calls the kernel yet |
| Mutation: interrupts applied at call time | 2 tests fail as they should (C case, partition); reverted | |
| `npm run check:arch`, `npm run check:rules` | pass | |
| Full `npm test` | not run | Integrator (MC7) |

Could not express: an interrupt that itself provokes another (a counter to the counter) needs W's cascade, by design (KW29); refunds for what an interrupted step had reserved stay the host's policy (KB3).

Requests: C, the contest runner can call `settleTogether` with its own `meets` and readiness as the order dial; S, Counterspell on `settleTogether`, and Nox/Finite on W law-field removal (SQ15), not K.

Next phase (K): support G, S, C and A embeds; retire `method_program` or `spell_working`'s compile step when consumers move; PFP7 join with B and G.


## Phase 2 (2026-11-12): actor quote, composed workings, identity

Branch `claude/fdn-k-kernel-a28c4b`, merged master at ea6a170dd (fast-forward) before work. Contract now v0.2 ([changelog](../../../KERNEL_WORKING_CONTRACT.md#changelog)), KW1-KW26.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: 48 focused kernel tests (kernel_working 23, kernel_compose 20, kernel_identity 5) over Gu, creature, spell and W consumers
review: diff-scoped
surface: new leaves src/kernel_compose.js and src/kernel_identity.js, extended src/kernel_working.js; zero registration lines; imports only basics.js and the kernel
```

What landed, one commit per item:

| Item | Commit | What |
| --- | --- | --- |
| A's actor quote, KB9, F's FBD1 re-quote, M's SMK7 | 48c0e1ae2 | `quoteForActor` (KW17) reads only what the actor knows and believes, reasons as data; operations may add costs, odds, cause (KW15); `workingFingerprint` and `beginQuotedWorking` refuse a stale quote, authority gets the fingerprint at settlement (KW16) |
| SC6 composed workings, G and S first consumers | 8ddcaecef | `kernel_compose.js` (KW18-KW21): slots by interface, fillers chosen at bind time, a filler stays one part, shared facts an explicit choice, composite ref names its fillers. G parity with `runGuProcedure` (full and short reserves) and a move from Gu the book never paired; S parity with the spell owner's exact native command lists in both worlds |
| SC7 one identity, several kinds | this commit | `kernel_identity.js` (KW22-KW26): id to facets to owner keys, no copied state, facet changes with history, read through owners as an ordinary `ports.read`; tested against a real W `createWorld` holder |
| Retire one old shape | not done, rescoped | No consumer of any old shape has moved yet (all embed phases are still ahead), and PFP5 says retire once consumers move. `method_program` stays the candidate; `spell_working`'s compile step is next once S embeds on the composition adapter |

PFP2 counts, before and after phase 2 (kernel scope):

| Count | Before | After | Note |
| --- | --- | --- | --- |
| Canon cases running as data through the kernel | 1 | 3 | Strength Reversing (also as a composed move), the Hogwarts bench draft (levitation, summoning, release), the Cyoria slate draft. The courier delivery is courier-shaped test data, not canon, so it is not counted |
| Bespoke scene modules added | 0 | 0 | |
| Separate working shapes in `src` | 6 | 6 | None retired; see rescope above |

Checks:

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_working.test.js tests/kernel_compose.test.js tests/kernel_identity.test.js` | 48/48 pass | Adapters live in tests; no domain host calls the kernel yet |
| `npm run check:arch` | pass | |
| `npm run check:rules` | pass (pre-existing warnings only) | |
| Full `npm test` | not run | Integrator, once per wave (MC7) |

What the rules could not express (new this phase): a beat split across parts changes canon outcomes, so KW20 forbids splitting a filler (recorded as a rule, not a gap); composition is sequential only, so two composed workings that run at once against each other need KB8; an identity registry can point at a counted stack only after the stack is split to individual keys.

Requests (coordinator relays):

| To | Request |
| --- | --- |
| W | SC7 agreement for OS8: (1) a W holder keeps its single kind, and an identity carries its other kinds as facets owned elsewhere; (2) at embed, the identity registry is one namespaced slice beside W's substrate slice, registered through the domain registry by the first embedding domain. Permitted default, not a requirement: an identity id may equal the W holder id it points at (the facet key already records the holder id). Confirm or counter in W's checkpoint |
| G | Move killer moves onto `composeWorking` with beats as fillers (the test adapter in `tests/kernel_compose.test.js` is a starting point); keep cross-beat modifiers in mind (KB1) |
| S | Move combined spells onto `composeWorking`, one dictionary method per filler (adapter in the same test file); then `spell_working`'s compile step can retire |
| A | `quoteForActor` is ready; pass `known` and `believedAuthority` from the actor's knowledge owners (MC8) |
| Owners of `hp_potion_reactions`, `mol_light_research`, `feature_expansion_ui` | Consent for K to move them off `method_program` onto a kernel method, or move them yourselves, so the shape can retire |

Review fixes (same phase, separate commit): `quoteForActor` takes `knownFacts` and an optional `knowsMethod`, returns one uniform shape; odds join the fingerprint; the SMK7 pattern is tested with an offer owner that refuses a different fingerprint. Tests now 49/49.

Next phase (K): KB8, one working's settled step interrupting another (C and S ask; PFP5 met; M's trade does not need it), then retirement as consumers move, then the PFP7 join with B and G.

K done check status (plan table): "one contract that two domains run on with their focused tests passing" waits on G, S or L embedding in their own files; "one old shape retired" waits on the same; "a time-partition and reload test in the kernel's own suite" is met.

## Phase 1

Owner plan: [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md), chat K. Branch `claude/fdn-k-kernel-a28c4b`, fast-forwarded to the wave start 9bbc51363 before work.

## Phase result: kernel working contract v0 published

- Contract doc: [KERNEL_WORKING_CONTRACT](../../../KERNEL_WORKING_CONTRACT.md) (v0.1, KW1-KW14, backlog KB1-KB10, the one-page comparison of the five shapes plus `making_procedure`, answers to sibling requests).
- Module: `src/kernel_working.js` (imports only `basics.js`; names no domain or world).
- Contract tests: `tests/kernel_working.test.js` (17 tests: a seven-test suite per consumer, a Gu equivalence check, the migration and a quote-versus-settlement draw check).
- Registered: RULES_INDEX register and router rows; AREA_GUIDE start-here row.
- Not registered in `main.js`, `save_files.js` or `display.js` (AR1); no save key changed (MC4 compatibility line: unchanged).

Two existing consumers pass the contract with their own files untouched (adapters in the test file): `gu_procedures.runGuProcedure` + `finishStrengthReversal` on the ch. 961 Strength Reversing recipe, and `creature_methods.planCreatureMethod` on courier-shaped operations. Both pass the time-partition (one jump, every minute, random partitions) and the save-reload-continue tests. Agent-verified, not human-reviewed. No browser pass: nothing player-facing changed and no player journey crosses the module yet (AR10: "engine ready", not integrated).

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: 17 focused kernel contract tests over two consumers (time partition, reload, interruption, authority, observed view, migration, draws)
review: diff-scoped
surface: new leaf src/kernel_working.js; zero registration lines, no imports beyond basics.js
```

## PFP2 counts (kernel scope)

| Count | Value | Note |
| --- | --- | --- |
| Canon cases running as data through the kernel | 1 | Strength Reversing Life and Death as a method row over the recipe |
| Bespoke scene modules added | 0 | |
| Separate working shapes in `src` | 6 (unchanged) | `craft_working`, `spell_working`, `creature_methods`, `gu_procedures`, `method_program`, `making_procedure`; plus the kernel. Retirement is the next phase |

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/kernel_working.test.js` | 17/17 pass (after the review fixes: quote uses the working's own id for draws; failure reasons stay out of the maker's view, checked by a unique token) | Adapters live in tests; domain hosts do not call the kernel yet |
| Mutation: settle at call time instead of step time | 4 tests fail as they should (quote, partition, authority x2); reverted | One mutation only |
| `node --test tests/creature_methods.test.js tests/craft_working.test.js tests/kernel_working.test.js` | 28/28 pass | Consumer files unchanged, so this is a sanity run |
| `npm run build` | pass | |
| `npm run check:arch` | pass (main.js growth -1 from the wave, others 0) | |
| `npm run check:rules` | pass; warnings pre-existing (TMR1 in `book_world_hp_exams.js`, a stale private_packs glob) | |
| Full `npm test` | not run | Integrator runs it at merge (MC7) |

## What the rules could not express

See KB1-KB10 in the contract: law-revision migrations (KB10), cross-beat Gu modifiers, per-operation matter state in a brew (LT31), start-of-work costs with refund policy, binding search, reservations, rates inside a step, lowering to native commands, several workings settling together, quote cost/odds/cause.

## Next phase (K)

1. Retire one old shape: `method_program` (consumers `hp_potion_reactions`, `mol_light_research`, `feature_expansion_ui` belong to other chats; needs their move or consent).
2. v0.2 on request: KB3 + KB9 (costs, odds, cause on the quote) when A and B embed; KB8 when C and M both need joint settlement.
3. PFP7 join with B and G once their leaves run on the kernel.
