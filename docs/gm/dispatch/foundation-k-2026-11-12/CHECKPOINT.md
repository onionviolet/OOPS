# Chat K · Kernel, checkpoint 2026-11-12

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
