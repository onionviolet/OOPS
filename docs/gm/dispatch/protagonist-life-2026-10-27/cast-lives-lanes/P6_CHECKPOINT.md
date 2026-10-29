# P6 checkpoint: cast tier cost

Status: **implemented, below floor; Node performance target met**. Agent-verified at focused and Node fixture scope, not human-reviewed. No commit or push. Coordinator owns integration, full suite and rebuilt desktop browser floor. The live private pack was not edited.

## Authority, ownership and pre-flight

Brief: [P6](P6_TIER_COST_BRIEF.md); [cast-lives card](../CAST_LIVES_CARD.md), PROJECT's current cast-lives direction. Rules AR1-AR16, AD36/43/45, MD3/6, CLR2/10/12, LSD126/138/162. No new product direction or save schema. Existing clock and `simulation.people[id].location` remain the authorities. Tier metadata, indexes, wakes and due batches are derived and unsaved.

Owned runtime: `src/book_world_lotm_cast_host.js`, `src/cast_schedule.js`, `src/wake_queue.js`. Owned tests: `tests/cast_tier_cost.test.js`, `tests/lotm_cast_tier.test.js`, `tests/headless/cast_tier_fixture.mjs`, `tests/headless/cast_tier_equivalence.test.js`. Receipt and prepared `P6_INTEGRATION.patch` are the other owned outputs. Shared `main.js` and `book_world_lotm_domain.js` were edited in scratch only, not in this checkout. Unrelated dirty assets, docs and workers were preserved. No `.git` writes.

Pre-edit checks selected: live-pack exact state/save differential, candidate role whereabouts against the ordinary always-update projection, recurrence overlaps/expiry, observer and explicit-work context wakes, rewind and rejected-plan retry. Failure scenario: a role body moved between schedule boundaries must stay there until its next authored projection; a rejected copy must not consume the next copy's projection at the same clock. Principals/recurring retain their repair path.

Seam: the existing LOTM domain projection now offers `castContext`. The prepared main change filters the existing native context loop through that projection. No new clock, save slice, tick registration, mutation event or import cycle. Core-owner patch surface: one existing main loop changed, **zero main line growth**, two existing domain lines extended. Shared-file integration remains the coordinator's action.

## CLR2 data probe

All three named data probes were populated. Counts are loaded inputs, not extrapolations.

| Input | Expected | Observed | Gate |
| --- | --- | --- | --- |
| Candidate pack people and tiers | 204: 8 principal, 16 recurring, 180 role | Exactly those records; aliases/history leave 8/15/179 enrolled bodies | PASS |
| Candidate places | 89 | 89 | PASS |
| Candidate schedule | inspect actual rows | 77 rows, same as live: 69 once, 3 daily, 5 irregular | Count only |
| Candidate role schedules | cost should reflect actual rows | 15 role records have schedule rows; most new role records are unplaced, not fabricated full lives | Count only |
| Live input | measure actual local pack | 36 records: 8/12/16 tiers; 8/11/15 enrolled bodies; 45 places, 77 schedule rows | Count only |
| Per-boundary cost split | table | Measured below, including separate people projection marks | PASS as Node diagnostics |
| Work per person by tier | table | Recorded below | PASS |
| Cast all-person iterations | list | Recorded below | PASS |

Live pack SHA-256: `2d29bf4ae70a6a79b0fafaab494fa72e05b0c30f99eb250bf48dd42e49e32a55`.
Candidate SHA-256: `2ac83f4a7aa827f17ba5b67f338388fc271d2838e9de6897632dba613780946a`.
Both were copied to private temp fixtures; no `private_packs/` write. One role alias has no distinct body, so the role sample tests 179 bodies, not 180 duplicated identities.

## Changes and tier work

`compileCastSchedule` validates immutable rows once and indexes them by actor. Its whereabouts result is identical to the ordinary API. Its next boundary uses the same recurrence semantics for numeric and named bands, including weekdays, weekly/monthly/term/seasonal/yearly rows and precedence-changing overlaps. Irregular rows remain unplaced. Expired rows cannot queue a wake at the current minute. Hosts rebuild the index with the pack; callers of the ordinary mutable-row API keep its validation behavior.

`wake_queue.hasDue(id, now)` is a non-consuming indexed read. It retains replacement/cancel/drain semantics. The host projects an actor's own rows on that actor's wakes and retains the due role set for same-clock retries after a rejected disposable plan. Role location repair is no longer minute-driven. Principal and recurring physical reconciliation stays on the prior path.

| Tier/condition | Schedule and mechanical work | Facts/contexts | People card |
| --- | --- | --- | --- |
| Principal | Existing reconciliation; indexed schedule wakes | Existing full context behavior | Existing knowledge-gated behavior |
| Recurring | Existing reconciliation; indexed schedule wakes | Existing full context behavior | Existing knowledge-gated behavior |
| Remote idle role | Indexed wake decision; projection/repair at its own boundary; no minute fallback | No full native context between wakes | Skipped before details/memories are constructed |
| Role observed at player's exact place | Same schedule clock | Full live read for the observer | Requires prior learned identity as before |
| Role with explicit work/native binding | Same schedule clock | Full path retained for controllers, programs, work-plan cursors, pursuits, jobs, sessions and pending commands | Same observer/knowledge gate |

Default locality is exact existing place identity. No new radius, observer knowledge, identity reveal or remote live-location text was invented. Learned knowledge and all saved reports remain retained even while a role card is offscreen. Direct action previews still build current facts through their incumbent transaction route; the tier filter does not grant or deny commands.

Cast host all-person loops, retained with their costs explicit:

- Pack load: actor alias resolution, definitions, places, command derivation and schedule index. Initialization, not every minute.
- `projectCastWakes`: all bodies once at initialization/rewind, then due actors and their indexed rows.
- `castSyncDue`: cheap body-repair scan for principal/recurring plus day windows; role bodies are excluded from the repair scan.
- `syncLotmCast`: definition iteration, but role body reads/writes are skipped before lookup unless in the due batch; no role schedule/fact/context build per minute.
- `castSettledPeople`: cheap identity/tier/location filter across pack records, then details/reports for admitted people. `castElsewhere` keeps existing principal behavior. Beat planning may scan source people/schedule rows at an actual beat for witness resolution; it is not a minute inner life.

## Timing and attribution

Method: P5 full-game Node DOM fixture, seed 37, fresh beside enrollment, one ordinary `update_timer(1)` plus settle, then 349 minutes using the existing span/wait driver in one display batch, closed and settled. All normal publications remain enabled. This measures CPU/harness work, **not wall-clock natural game pacing or Chrome performance**. Other sessions and the independent equivalence matrix ran concurrently; single samples are diagnostics, not stable benchmark estimates.

Initial matched instrumented pass, before the final role-repair regression refinement:

| Pack | Before ordinary minute ms | After ordinary minute ms | Before 349-minute wait ms | After wait ms |
| --- | ---: | ---: | ---: | ---: |
| Live | 3536.48 | 2086.62 | 3676.23 | 2754.61 |
| Candidate | 12904.09 | 4356.02 | 10146.47 | 6022.91 |

Candidate/live after ratios: **2.09 minute, 2.19 wait**, above the **1.5 target**. Candidate minute fell about 66%; the target is still open. The final source differential measurements are appended below rather than silently replacing this run.

Additional final-registry diagnostic, `/tmp/p6-final-profile.json`: candidate ordinary minute 4893.84 ms, wait 5929.65 ms. The sample's natural minute had one simulation boundary; the wait had two marked `advanceSimulationBoundary` calls. Context/fact/publication work also occurs outside those boundaries. Exclusive marked time below subtracts marked children, so overlapping inclusive time is not added twice. Unmarked descendants remain charged to their nearest mark. This run predates only the final role physical-repair restriction; no location changed during its idle minute, and it is not substituted for the final source differential.

| Category / mark | Minute calls | Minute self ms | Wait calls | Wait self ms |
| `syncLotmCast` | 1 | 0.199 | 2 | 0.274 |
| `whereabouts` | 0 | 0.000 | 198 | 7.066 |
| `simulationNativeContexts` | 17 | 1703.000 | 18 | 1003.521 |
| `simulationFacts` | 673 | 1565.941 | 675 | 2838.759 |
| `lotmFacts` | 162 | 124.277 | 520 | 369.988 |
| `knownPeopleView` | 4 | 0.681 | 3 | 0.407 |
| `castSettledPeople` | 4 | 1.243 | 3 | 0.866 |
| `renderPublicationPanels` | 1 | 152.937 | 2 | 0.189 |
| `persistExpansion` | 1 | 121.280 | 2 | 109.298 |

`syncLotmCast` includes compiled schedule lookup; the separate `whereabouts` mark is the ordinary resolver used by beat witness/talk consumers. No actor was due during the idle ordinary minute, so compiled actor projection did not run. People projection is measured separately from the enclosing panel. `persistExpansion` self time includes unmarked persistence/validation work and is not a storage-write-only measurement. DOM drawing, durable storage and garbage collection are not separately attributable from these marks.

A separate Node CPU profile (`/tmp/p6-candidate.cpuprofile`) identifies state copying/GC and the broad simulation/world-completion/remainder fact projections among remaining hot work. These are existing all-actor/native projections; skipping their inputs based on cast tier would risk overlooking real effects. F1: role context suppression is a large improvement but does not make total cost proportional only to scheduled cast people. CLR12 next default: profile repeated all-actor fact/validation reads inside one unchanged-input publication/planning frame and state-copy costs, preserve authoritative records, then prove exact state/save equivalence. This is a measured follow-up, not a request to invent sparse authoritative state or remove persistence validation.

## Checks and input identity

The coordinator's full suite/browser floor is not claimed. Earlier pre-refinement evidence remains labelled by its inputs.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_schedule.test.js tests/wake_queue.test.js tests/lotm_cast_week.test.js` | PASS 28/28 during initial edit | Before final role physical-repair regression |
| `node --test tests/cast_tier_cost.test.js tests/lotm_cast_tier.test.js tests/cast_schedule.test.js tests/wake_queue.test.js` | PASS 17/17 before final repair regression | Leaf/observer/expiry slice |
| `node --test tests/cast_tier_cost.test.js tests/lotm_cast_tier.test.js tests/cast_schedule.test.js tests/wake_queue.test.js tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js` | PASS 47/47 on final role-boundary source | Focused only; no full suite |
| `node --test tests/headless/controller_wake_equivalence.test.js` | First run PASS 5/5, four fixtures × both clock modes × original/new controller scheduler | Frozen before final repair refinement; final rerun recorded below; existing span/stepped differences remain reported |
| `YAIRPG_TIER_BASELINE=/tmp/yairpg-p6-before node --test tests/headless/cast_tier_equivalence.test.js` | Pre-refinement PASS 4/4; both packs exact state and save bytes; 179 roles × 21 sample minutes | Final refinement rerun below; candidate fixture stays private |
| `npm run check:arch` | PASS shared and scratch integrated: main 10056/10115, display 6730/6767, saves 310/310; 6 grandfathered main imports, 205 cyclic edges | Zero core line growth, zero new cycle edges |
| `BUILD_OUT=/tmp/yairpg-p6-integrated-build npm run build` in `/tmp/yairpg-p6-final` | PASS, including prepared main/domain patch | Browser bundle not exercised here; final hash below |
| `node scripts/lane_review.mjs` with the nine owned paths as grants and candidates | PASS, 7 source/test paths, 118 private name tokens, zero name/await/outside-grant hits | Final rerun below |
| `review()` on full patched `main.js` and LOTM domain | Baseline and candidate both flag the same existing main name-token and top-level-await file | Inherited full-main flags, not introduced by this patch; review of added-line payload passes with zero hits |
| `git apply --check --whitespace=error .../P6_INTEGRATION.patch` | PASS | Prepared patch only, recheck at coordinator integration |

Build output stays under `/tmp`; shared `dist/` and `index.html` were not used as build output. An earlier isolated build of shared source omitted the main patch and is not the integrated build receipt. Corrected integrated build uses `/tmp/yairpg-p6-final` and the above output path.

Recovery artifacts: `/tmp/yairpg-p6-before` (frozen instrumented pre-P6 source and copied live pack), `/tmp/yairpg-p6-before-candidate`, `/tmp/yairpg-p6-final` (final integrated scratch), `/tmp/yairpg-p6-profile-final`, `/tmp/p6-*.json`, `/tmp/p6-*.log`. The named headless tests create additional temp roots and print their exact locations. These are local fixtures/outputs, not player profiles. No player save was read or changed.

## AD43 floor and remaining gate

| Floor | State |
| --- | --- |
| FLR1 Build | Isolated integrated build passes; final bundle hash below |
| FLR2 Route | Named seeded Node fixture only; fresh-origin rebuilt 1920×1080 browser is coordinator-owned |
| FLR3 Shown | Role card admission tested at projection scope; visible desktop outcome and same-place/remote transitions unverified in browser; mobile deferred |
| FLR4 Used | Existing cast host, native context builder (patch) and known-people consumer cross the changed seams in Node |
| FLR5 Kept | Exact live/candidate state and save-byte differentials; no save schema changes; browser Save/reload/Export/literal Import belongs to coordinator |
| FLR6 Labelled | Implemented, below floor; agent-verified at named fixture scope, not human-reviewed; 1.5× target met at final Node fixture scope |

Coordinator default: review/apply the prepared main/domain patch with the owned runtime/test files, retain the live pack until the combined integration and rebuilt desktop floor pass, and run the full pre-commit suite once. No publication, normal-app adoption, commit or push is authorized by this lane.

## Final source receipt (2026-10-29)

Final owned runtime hashes and prepared integration identity:

| Input | SHA-256 |
| --- | --- |
| `src/book_world_lotm_cast_host.js` | `b72a2db1a46b72cf5687bb458719b584ae368821fd40a67a9b860ad101617005` |
| `src/cast_schedule.js` | `7cd95825174d75754a4c90da2ab1f0a9cb4456859359a22e4bf9c7d40096c3f2` |
| `src/wake_queue.js` | `f1e4fd87adb08ec8cc0109c51382b04d7fc8a46438139d159ca934079f07921f` |
| `src/main.js` | `6e423f8d8b25b0901b6f1dea30333663a63d69edfd293b2847ca4c10d45a7b54` |
| `src/book_world_lotm_domain.js` | `aaa3ba0cccd31850724fe38bd58189664b045636724b2c7a1cf70c658ba2e1da` |
| `bundle` | `e67049e5ee5a8aafbfa8f26c7e99c0af38856db2126dfb9c361b9919adbc8b27` |
| `patch` | `3d315bb9ea1e0ac36a4b9cfe2c1e94b0176f17d467348f646006f5cc804a149e` |

The integrated build's three owned runtime files were byte-compared to the shared checkout after the final role-boundary edit. `main.js`/domain hashes refer to the prepared-patch scratch inputs, not edits to shared files. No runtime source changed after this freeze.

Final focused check: `node --test tests/cast_tier_cost.test.js tests/lotm_cast_tier.test.js tests/cast_schedule.test.js tests/wake_queue.test.js tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js`: **PASS 47/47**. Includes role boundary-only physical repair and rejected-plan same-clock retry. Gap: focused slice, not coordinator's full suite.

Final P6 differential: `YAIRPG_TIER_BASELINE=/tmp/yairpg-p6-before node --test tests/headless/cast_tier_equivalence.test.js`: **PASS 4/4** on final runtime and registry patch. Both packs match exact state and `create_save()` bytes. Fixture outputs: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-tier-equivalence-zFVKSh`. The later added host/body comparison was run separately with `node --test tests/headless/cast_tier_equivalence.test.js`: **PASS 2, SKIP 1** (no baseline env for that invocation). The skip is the already-passing full-game differential; the new check compares actual role bodies, not merely projected `place` results. Its diagnostic gives the exact boundary/adjacent sample count in `/tmp/p6-host-pack-projections.log`.

Final concurrent-load differential timings:

| Pack | Before minute ms | After minute ms | Before wait ms | After wait ms |
| --- | ---: | ---: | ---: | ---: |
| Live | 5122.85 | 4834.95 | 5587.11 | 6369.66 |
| Candidate | 15983.67 | 6113.87 | 17669.81 | 7705.56 |

This run meets 1.5× at 1.26× minute and 1.21× wait, whereas the earlier matched pass did not. Live wait regressed in this one concurrent sample. The budget is **unconfirmed**, not a stable performance claim; final paired measurements after this lane's competing matrix finish are recorded below.

Final owned-path lane review: `node scripts/lane_review.mjs` with the nine explicit grants and paths: **PASS**, 7 source/test paths, 118 private-name tokens, zero name hits, zero top-level-await hits, zero outside grants. `git diff --check` on owned tracked runtime and `git apply --check --whitespace=error` on the prepared patch: **PASS**. The inherited full-main review flags described above remain separate from the clean added-line payload.

Final existing equivalence harness: `node --test tests/headless/controller_wake_equivalence.test.js`: **PASS 5/5**, final owned runtime, all fresh/beside/reading/be fixtures in both existing clock modes. State bytes, save bytes and publication counts agree with original controller polling. Be-span boundary-reduction assertion passes. Runtime 728.11 s. Frozen inputs and private outputs: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-controller-equivalence-OXnFhz`; log `/tmp/p6-controller-equivalence-final.log`. This harness verifies the scheduler with P6 host code; the P6-specific harness separately verifies the prepared main/domain filter against pre-P6 source. Existing fresh/beside/be span-versus-stepped differences are reported, not normalized away.

Final `npm run check:arch` in the integrated scratch: **PASS**, unchanged caps and 205 grandfathered cycle edges. Integrated `BUILD_OUT=/tmp/yairpg-p6-integrated-build npm run build`: **PASS**, bundle `e67049e5ee5a8aafbfa8f26c7e99c0af38856db2126dfb9c361b9919adbc8b27`. Rebuilt desktop browser is unexercised in this lane, per brief.

The candidate host/body sample passed for **179 role bodies at 372 boundary/adjacent minutes**. Only 15 of those role records have current schedule rows; the other bodies are retained without inventing whereabouts or expensive inner lives.

## Final paired Node performance and release

After the final 16-run matrix exited, `/tmp/p6-paired.py` ran the final frozen integrated after/live and after/candidate fixtures in alternating order (live/candidate, then candidate/live). It invokes `node tests/headless/cast_tier_fixture.mjs <frozen-root> beside <output>` four times. All four runs additionally assert exact state and save bytes against the final full differential outputs. Owned runtime/domain files and main-without-harness-exports were byte-compared with the final build manifest: **PASS**.

| Round | Pack | Ordinary minute ms | 349-minute wait ms |
| --- | --- | ---: | ---: |
| 1 | live | 1969.55 | 2526.04 |
| 1 | candidate | 2173.54 | 2755.72 |
| 2 | candidate | 2191.33 | 2706.77 |
| 2 | live | 1983.81 | 2549.08 |

Medians: **live 1976.68 ms/minute, 2537.56 ms/wait; candidate 2182.43 ms/minute, 2731.24 ms/wait**. Candidate/live: **1.104× minute, 1.076× wait**, both below **1.5×**. Both individual paired rounds also pass the relative target. **Node target met**. These are CPU/harness samples with this lane's competing matrix stopped, not a Chrome or natural pacing claim; other sessions remain outside this lane's control. Earlier contended measurements stay visible above and are superseded for the final Node budget by these paired frozen-input samples. Residual global projection/copy costs remain a useful future profiling finding, not an extra gate for this lane.

Evidence: `/tmp/p6-paired.py`, `/tmp/p6-paired.log`, `/tmp/p6-paired-receipt.json`, four `/tmp/p6-paired-<round>-<pack>.json` exact private outputs. No further runtime changes or tests are needed from this lane after the passing final checks. The coordinator owns the full suite and fresh-origin 1920×1080 browser floor with Save/reload/Export/Import and pack adoption. The source slice is still **implemented, below floor** until that integrated browser gate. Human review is optional.

**Ownership released to coordinator.** All P6 worker/test/build/profile/benchmark processes have exited. Only the nine owned files listed above are delivered. Prepared shared-file patch remains unapplied. No commit, stash, reset, force, push, live-pack write, player-save access or normal-app adoption occurred.
