# P7 checkpoint: all-actor read cost

Status: investigating, not complete. No commit. Reservation: `src/main.js` existing frame/context loops, `src/simulation.js`, facts/context modules identified by profiling, `src/book_world_lotm_cast_host.js`, focused system tests and this receipt. Other `src/cast_*` modules are excluded. Coordinator owns full suite and rebuilt desktop browser floor.

Authority: [brief](P7_ALL_ACTOR_COST_BRIEF.md), [card](../CAST_LIVES_CARD.md), PROJECT's lead-first direction. Rules AR1-AR16, AD36/43/45, MD3/6, CLR2/10/12. Optimization changes neither life depth nor pack content. Existing simulation people location and existing clock remain authoritative. No new saved cache or schema.

Pre-edit checks: freeze current source and both private packs in `/tmp/yairpg-p7-before{,-candidate}`; measure the P5/P6 ordinary minute and 349-minute wait; compare exact state/save bytes and sampled observer-visible facts/role whereabouts. Regression scenario: an idle remote role becomes observed or starts work between clock boundaries, and a direct preview must see current inputs. Unknown dependency revisions retain eager behavior. No clock-wide caching assumption.

Owned source files were clean at initial inspection. Shared unrelated changes remain untouched. Runtime seam: existing context-map construction and read-only frame copies; no new tick registration, save owner or import cycle intended.

## Implementation and measured correction to the brief

F1: The brief's profile predates P6's final paired result. The end of [P6](P6_CHECKPOINT.md#final-paired-node-performance-and-release) already records candidate/live ratios 1.104 minute and 1.076 wait. The current source has its tier filter integrated. P7's initial profile confirms idle remote roles have **zero full native context or simulation-fact builds** in the ordinary minute. Adding another role cache would retain values nobody requests and would need dependency revisions not supplied by the native owners. Under CLR12, explicit role reads remain eager outside a proven read-only frame. Principals and recurring retain their admitted contexts and behavior.

F2: The remaining all-person work includes `worldCompletionNativeContext` scanning every body's vitals inside repeated facts/context normalization. `worldCompletionContext` also normalized twice and copied the entire accumulated fact dictionary at every dependency stage. That copying dominated the measured world-completion context chain. No sparse authoritative state or save-validation shortcut was introduced.

D1: `src/world_completion_facts.js` now reuses the derived body-vitals map through the incumbent `readFactsFrame` port. The key includes state identity, explicit state invalidation revision and frame lifetime, with the incumbent clock/sequence discriminators as extra guards. It is not a clock-wide cache. Effects suppress reuse through `withFactsMutation`; changed states and direct reads outside the frame build eagerly. Caller-provided native/staged vitals still override body defaults. Each caller gets its own map, preserving the prior nested owner-reference semantics.

D2: Normalize once per world-completion context and accumulate dependency facts in a single caller-owned dictionary. Dependency order, namespace filtering and input isolation remain intact. `src/main.js` reads common native/location/care/home/inventory/weather snapshots once per existing context build, rather than once per admitted actor. Actor contexts and their facts remain distinct; shared native inputs are read-only snapshots. This reduces duplicated snapshots inside subsequent state/context copies without changing their owners or invalidation lifetime. Main's existing frame/context loops are the entire main change: **zero line growth**, no registration or new import.

D3: No `src/cast_*`, simulation scheduler, cast host, private pack, saved schema, clock, RNG or location owner changed. This is a measured optimization of the inherited selective-role path, not a new cast-depth design or a claim of constant-time whole-book simulation.

## CLR2 probe and callers

Frozen live pack: 36 records, 34 enrolled cast bodies (8 principal, 11 recurring, 15 role). Candidate: 204 records, 202 enrolled cast bodies (8 principal, 15 recurring, 179 role), 89 places. Aliases/historical rows are not fabricated duplicate bodies. Input SHA-256: live `2d29bf4ae70a6a79b0fafaab494fa72e05b0c30f99eb250bf48dd42e49e32a55`; candidate `2ac83f4a7aa827f17ba5b67f338388fc271d2838e9de6897632dba613780946a`. Both copied to scratch; originals were not edited.

All-person and single-actor callers:

| Caller/port | Work requested |
| --- | --- |
| `buildSimulationNativeContexts` | Scan enrolled IDs for incumbent tier admission; build contexts for admitted actors. Role admission checks observer locality, due boundaries, native binding and explicit work |
| Native gameplay adapter, realm/destination joins | Native-bound actors and their existing enrolled residents |
| Nested, book-world, remainder, causal, lore and world-completion context joins | Enrich admitted context entries; known subsystem residents may be added through their existing joins |
| `worldCompletionNativeContext` | All simulation-body vitals, then caller overrides; now one derived map per unchanged publication revision |
| `simulationFacts` and `buildSimulationFacts` | One supplied actor/target per call. Commands, support, controllers, events and panels request these explicitly. No all-role facts loop exists in the measured minute |
| `simulation.js` controller/program/job/event boundaries | Actor-specific `contexts[id]`, with current staged external/gameplay/vitals/equipment; unknown dependency lifetimes remain eager |
| Main's `persistExpansion`, `advanceChroniclePlan`, simulation advance, structured/campaign/pocket views and panel readers | Request the native map; many only consume player facts plus projected equipment/vitals maps |
| Main's explicit planning frame / publication frame | Reuse the map inside the existing unchanged read phase, returning the incumbent mutable or top-level/facts copies. No lifetime extension here |

[P3's direct-call inventory](P3_CHECKPOINT.md#direct-simulationfacts-callers-and-inputs) remains applicable. The new harness exports `p7Contexts` in scratch only; no test port was added to public runtime.

Candidate ordinary-minute profile, same marks before/after. Inclusive times overlap and are not additive. Other sessions remain outside this lane's control.

| Read / actor tier | Before calls | Before inclusive ms | After calls | After inclusive ms |
| --- | ---: | ---: | ---: | ---: |
| `simulationNativeContexts` aggregate | 17 | 762.09 | 17 | 399.36 |
| Actual native-map builds | 10 | 691.75 | 10 | 327.94 |
| World-completion context, player | 18 | 28.42 | 18 | 13.13 |
| World-completion context, principal | 88 | 150.95 | 88 | 65.91 |
| World-completion context, recurring | 165 | 289.19 | 165 | 122.03 |
| World-completion context, role | 0 | 0 | 0 | 0 |
| World-completion context, other | 99 | 177.04 | 99 | 80.47 |
| `simulationFacts`, player | 672 | 672.27 | 672 | 681.79 |
| Actual facts builds, player | 150 | 481.19 | 150 | 483.47 |
| `simulationFacts`, other | 1 | 6.68 | 1 | 6.66 |
| Actual facts builds, other | 1 | 6.61 | 1 | 6.61 |
| `simulationFacts`, principal / recurring / role | 0 | 0 | 0 | 0 |

The context tier rows measure the expensive final normalization per admitted actor, not the entire multi-domain pipeline for that actor. Other includes original-world/system residents. These are per-minute aggregate counts, not one build per actor: 11 world-completion map joins each enrich the incumbent contexts. During the wait, role world-completion contexts run twice on each side at actual observation/due work; they are not blanket-suppressed. Role fact calls remain zero during the timed wait.

Per idle remote role in that minute: 10 cheap admission checks, **zero** full context builds, **zero** full fact builds; role admission across all 179 bodies costs 0.98 ms before and does not dominate. The all-body vitals scans still visited those roles despite their absence from the admitted context map; the added scan counter and final paired timings are recorded below. Gate inputs are populated, not assumed from P6's older hot-work totals.

Diagnostic artifacts: `/tmp/p7-profile-tiers-before-valid.json`, `/tmp/p7-profile-tiers-after.json`; instrumentation exists only in `/tmp/yairpg-p7-profile-*`. An attempted scratch refresh failed because destination symlinks already existed; its uninstrumented output is discarded. The named valid profile directories were newly created before instrumentation.

## All-body read counter and final paired Node timings

The counter instruments the actual filter's body-vitals property probes, not an extrapolation from entry calls. Each filter checks every body once; bodies with vitals are subsequently read again while constructing the map. Counter output: `/tmp/p7-profile-body-{before,after}.json`.

| Body tier | Minute probes before | Minute probes after | Wait probes before | Wait probes after |
| --- | ---: | ---: | ---: | ---: |
| Role | 159489 | 84667 | 189561 | 140694 |
| Principal | 7128 | 3784 | 8472 | 6288 |
| Recurring | 13365 | 7095 | 15885 | 11790 |
| Other, including player | 8910 | 4730 | 10590 | 7860 |

The 179-role idle minute's probes fall from 891 to 473 per role. These are cheap vitals-presence reads, not full actor facts/contexts. The residual scans are retained eagerly in unversioned planning/effect phases. That remaining linear work, plus state/save copying, means this is **not** a claim that the entire game scales only with observed actors. A future reduction needs a native-owner revision port or a narrowed consumer contract; clock or tier alone is insufficient. This is the CLR12 default, not a new gate for the coordinator.

`python3 /tmp/p7-paired.py` runs the original P5/P6 fixture eight times, two rounds with reversed order, over frozen before/after roots from `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-context-equivalence-AS1ScM`. Every run asserts exact state and save equality against the independent differential outputs. All normal publications stay enabled. Seed 37, beside fixture, span dial, one ordinary minute plus 349-minute wait. No browser pacing claim.

| Pack | Before minute median ms | After minute median ms | Before wait median ms | After wait median ms |
| --- | ---: | ---: | ---: | ---: |
| Live | 2131.40 | 1403.55 | 2473.97 | 1950.21 |
| Candidate | 1962.40 | 1442.94 | 2508.63 | 2148.02 |

After candidate/live: **1.028× ordinary minute, 1.101× wait**, both within **1.5×**. Live minute improves 34.1%, candidate minute 26.5%; wait improves 21.2% and 14.4%. These are two-sample medians amid other sessions, not stable machine benchmarks. Before-candidate minute being faster than before-live is additional evidence of timing noise, not negative actor cost. No speed gain is attributed to reducing role facts or admission counts: those were already suppressed by P6.

Evidence: `/tmp/p7-paired.log`, `/tmp/p7-paired-receipt.json`, `/tmp/p7-paired-<round>-<phase>-<pack>.json`. The separate final differential uses `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-context-equivalence-ThSVjO`; it passed after replacing the exploratory source-rewriting fixture with the delivered standalone fixture. Timings in its log are independent single samples, not substituted for the paired medians.

## Checks, review and input identity

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/world_completion_actor_context.test.js tests/facts_frame.test.js tests/lotm_cast_tier.test.js` | PASS 13/13 on final runtime source; initial actor test file version | Includes existing frame on/off headless differential; preceded the two added actor regressions |
| `node --test tests/lotm_cast_tier.test.js tests/simulation_frame.test.js tests/world_completion_actor_context.test.js` | PASS 14/14, delivered source/tests | Same-clock revision invalidation, mutation fallback, direct eager freshness, staged override precedence, input isolation, role work/observation and existing frame contracts; focused only |
| `YAIRPG_CONTEXT_BASELINE=/tmp/yairpg-p7-before node --test tests/headless/cast_context_equivalence.test.js` | PASS 3/3, final standalone fixture | Both packs: exact expansion state/save bytes; all admitted actor fact digests at 3 journey samples; every enrolled role's full eager facts and whereabouts at 7 sampled clocks; same-clock observation/body promotion. Named scratch fixture, not browser play |
| `node --test tests/headless/cast_tier_equivalence.test.js` | PASS 2, SKIP 1 | 179 role bodies × 372 boundary/adjacent minutes plus ordinary schedule projections; pre-P6 source differential intentionally skipped without its env, P7 before/after differential passed separately |
| `python3 /tmp/p7-paired.py` | PASS 8 exact state/save comparisons; final ratios 1.028× / 1.101× | Node DOM harness timing, not browser/natural pacing |
| `npm run check:arch` | PASS: main 10056/10115, display 6730/6767, saves 310/310; 6 grandfathered main imports, 205 cyclic edges | Zero main line growth, zero new cycle edges |
| `BUILD_OUT=/tmp/yairpg-p7-build npm run build` | PASS, bundle SHA-256 below | Isolated output, no shared dist/index edit; browser not exercised by this lane |
| `node scripts/lane_review.mjs` with the six delivered paths as explicit grants/candidates | Whole-main inherited flags: one name-hit file and one top-level-await file, zero outside grants | Frozen before/main has exactly the same flags; no inherited code edited to silence them |
| `GIT_DIR=/Users/weiwei/code/yet-another-idle-rpg/.git node /tmp/p7-review.mjs` | PASS changed main function and all 4 other source/test files: zero private-name/await/outside-grant hits | Reports frozen full-main inherited flags separately; uses read-only Git metadata |
| `git diff --check -- src/main.js src/world_completion_facts.js tests/world_completion_actor_context.test.js` | PASS | New harness/checkpoint checked separately for whitespace and links |

Build: `a65096b3b7005c1e40c907c78b5581d86e894cfe02a3be28cee4ff69875212b7`.
Runtime identities: main `a7f39a6359d1838b8033c8774d9389a9f76395382307609c11418302a333021d`; world-completion facts `cd0016fb1f778316e052abaf8ada8fe8e56593b716a3ce44622cf477ba6181bd`. Test/harness hashes: `/tmp/p7-final-manifest.json`. Source hashes matched the frozen after fixtures, excluding scratch-only exports in main. Logs: `/tmp/p7-focused-{initial,final}.log`, `/tmp/p7-equivalence-final.log`, `/tmp/p7-role-boundaries.log`, `/tmp/p7-{arch,build,review-final}.log`.

## Delivery floor and release

Status: **implemented, below floor; Node target met**. Agent-verified at focused and Node-fixture scope, not human-reviewed.

| Floor | Receipt |
| --- | --- |
| FLR1 Build | Isolated production build passes, bundle hash above; not browser-proven |
| FLR2 Route | Named seed-37 fresh native life and ordinary beside enrollment through the Node DOM UI; rebuilt 1920×1080 browser belongs to coordinator |
| FLR3 Shown | No player-facing text, cost or feedback change; exact facts compared, browser presentation unexercised |
| FLR4 Used | Existing native context consumers, command/support facts and world-completion chain use the optimized paths |
| FLR5 Kept | No persistence/schema change; exact `create_save()` bytes match both packs; browser Save/reload/Export/Import retained for coordinator |
| FLR6 Labelled | Agent-verified named fixtures, not human-reviewed; not installed, committed or deployed |

Delivered files: `src/main.js`, `src/world_completion_facts.js`, `tests/world_completion_actor_context.test.js`, `tests/headless/cast_context_equivalence.test.js`, `tests/headless/cast_context_fixture.mjs`, this checkpoint. No prepared patch needed; all runtime edits are within the brief's grant (the profile points to the world-completion facts/context module). No private pack edit or player-save access. No commit, stash, reset, force or push attempted.

Remaining authoritative combined gate: coordinator's full suite and rebuilt fresh-origin desktop browser floor with the relevant save checks. This lane adds no human-approval gate. Ownership is released for the six delivered paths once the final local integrity check below is recorded; no worker/build/profile/benchmark process remains running.

Final integrity: **PASS** owned source/test hashes, new-file whitespace, receipt links, changed-line `git diff --check`, and both unchanged original pack hashes. Existing whole-main trailing whitespace was preserved; the check covers introduced lines instead. All recorded tool sessions exited successfully. **Ownership released to coordinator.**

Concurrent-source note: final comparison with the frozen pre-P7 tree finds the two owned runtime changes plus `src/cast_topic_talk.js`, edited by another session and left untouched. The differential intentionally freezes unrelated dependencies on both sides, so it proves P7's slice independently of that concurrent change. The build/architecture receipts describe their check-time inputs; the coordinator must use its combined current candidate for the full suite/browser gate. No whole-current-tree equivalence claim is made.
