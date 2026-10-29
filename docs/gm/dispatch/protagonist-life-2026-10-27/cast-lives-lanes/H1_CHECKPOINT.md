# H1: acts on objects at a place

## Resume 1, 2026-10-29: native saving after an act

**Prepared fix; coordinator integration still required.** The coordinator applied
`H1_INTEGRATION.patch` and reported a 1920×1080 Chrome run on bundle `5189b254`:
the be panel displayed eight controls with quotes and disabled reasons, and the
pre-action save reloaded. Clicking the first act then blocked saving. That report
supersedes the older statement below that the host-view patch was unapplied; its
browser result is pre-fix evidence, not a successful post-fix journey.

**Cause.** A pending H1 job is JSON-serializable and was registered with the
simulation registry, but `validateLotmState` looked up admitted jobs only in
`lotmCommands` and `castWalkCommands`. The real native persistence path rejected
its command definition with `Tingen work differs from its exact admitted
definition.` The native save guard then blocked later saves. The earlier pure
simulation JSON test did not pass through this owning validator.

**Fix.** [H1_SAVE_INTEGRATION.patch](H1_SAVE_INTEGRATION.patch) adds the live
`castObjectCommands` definitions to the existing Tingen save validator's exact
lookup. It preserves the existing revision, actor, costs and effects checks.
`src/book_world_lotm_state.js` is outside this lane's grant, so the patch is
prepared and checked, not applied in the shared checkout. The coordinator must
apply it before building the combined candidate. No separate save field,
additional save owner or command bypass is introduced.

**Compatibility decision.** Pre-H1 be saves remain valid. Missing object seed
markers and facts initialize additively on cast sync; existing facts are kept,
and no past act or receipt is invented. A synthetic pre-H1 native save was
loaded, stepped and saved with an existing fact retained. A queued H1 job must
still have its matching private pack and matching admitted definition; the
missing-pack pending-job policy remains open as recorded below.

| Check | Result and gap |
| --- | --- |
| `node --test tests/place_acts.test.js` | PASS, 5 tests. The new synthetic full-game Node DOM fixture applies the prepared patch to a disposable candidate and exercises pending save/reload, completion, Save/reload, literal Export/Import, rejected altered job and pre-H1 additive seeding. No browser UI proof. |
| Private real-pack fixture `node /tmp/h1-native.mjs` | PASS through pending save/reload, completion, save/reload and literal Export/Import, no captured errors or save block. The disposable source copy had temporary test-only exports for the harness; it did not use a real player save. |
| `BUILD_OUT=/tmp/yairpg-h1-save-build npm run build` in `/tmp/yairpg-h1-native` | PASS after removing temporary test exports. Frozen isolated candidate includes the two-line validator patch; SHA-256 `8cb932df6576c09359823f9d27b768b7d2d5c877df14ca0a75ca5426fd255c9a`. Not browser-exercised. |
| `npm run check:arch` in `/tmp/yairpg-h1-native` | PASS: main -55, display -37, saves 0 growth; 6 grandfathered imports and 205 cyclic edges. |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_SAVE_INTEGRATION.patch` | PASS against shared checkout; no shared validator edit made. |
| `node scripts/lane_review.mjs` with explicit H1 grants and candidate paths | PASS: 4 source/test files, 118 private names, zero name hits, top-level awaits or outside-grant paths. |

Resume input hashes: `H1_SAVE_INTEGRATION.patch` SHA-256
`933aac9b5fbee538b2d65e3b5473a50113b8c8a9513fabce3c6e3f5cdc1c01cb`;
`tests/place_acts.test.js` SHA-256
`3d73d90331010e23026befd939cf3d71502647cc92c0cd25f51ff4ea68855a8e`.
The earlier hashes and check rows below are historical evidence of the earlier
candidate, not current identity.

**FLR1–FLR6:** isolated candidate built (FLR1); fixture route exercised (FLR2);
pre-fix desktop rendering was coordinator-verified, but post-fix browser remains
pending (FLR3); act/receipt consumers exercised in the fixture (FLR4); native
Save/reload/Export/Import passed in the patched synthetic and private fixtures
(FLR5); result is agent-verified, not human-reviewed and **below floor** until
the coordinator applies the patch and runs the rebuilt desktop journey (FLR6).
The coordinator also owns the full pre-commit suite and replay scoring.

---

## Original H1 receipt, before resume 1

2026-10-29. **Implemented, below floor.** Agent-verified focused engine/host fixture,
not browser-verified or human-reviewed. No commit, staging, reset, stash or push.
[Brief](H1_HOUSEHOLD_ACTS_BRIEF.md). Rules applied: AR1-AR16, AD6-AD8, AD36,
AD38, AD43, AD45, CLR1-CLR13, SUI1-SUI19, RPT1-RPT12. Design fit: LSD17,
LSD30, LSD40, LSD103-LSD125, LSD156. Latest user direction and PROJECT's
lead-first summary agree with this bounded be-seat slice. Broader household
simulation, other seats, exact-minute fidelity and G2 noticing remain outside it.

## Ownership and change surface

Writer scope is released for coordinator review/integration after this receipt.
The primary shared checkout was used; unrelated generated, research and concurrent
source edits were preserved. HEAD at verification: `8c27af02beae82aadf916ca6b560b53902e6a4c2`.

| File | Change | Publication |
| --- | --- | --- |
| `src/place_acts.js` | World-neutral command adapter, additive seeding, quote projection, exposure hook and settlement receipt projection | Public, name-free |
| `src/book_world_lotm_cast_host.js` | Registers pack acts through simulation; seeds existing owners in be; schedules pending receipts through the existing host tick; publishes after persistence | Public, name-free additions |
| `src/book_world_lotm_ui.js` | Things-at-hand disclosure in the existing place service, description, quoted minutes/cost and visible blocked reason | Public, name-free additions |
| `tests/place_acts.test.js` | Synthetic simulation journeys and regressions | Public, synthetic |
| `private_packs/lotm-cast/cast.json` | Added `householdActs` field, schema 1: seven object rows and nine act rows with locators and qualified fills; other fields retained | Private; do not stage |
| `H1_INTEGRATION.patch` | Prepared hunks for unowned `src/book_world_lotm_host.js`: be-view offers, saving/asleep block, active object-job display | Public; prepared, **not applied** |
| `H1_CHECKPOINT.md` | This receipt | Public, IDs and paraphrases |

No edits to `main.js`, `simulation.js`, `expansion_engine.js`, display or save
writers. One new leaf import in the owned cast host, zero core registration lines,
zero new import-cycle edges. Existing simulation commands own quotes, costs,
reservations, interruption/refund, clock progression, effects and knowledge.
The patch is necessary for the panel to receive `objectActs`; this build does
not yet expose the new controls through the normal be view.

Target: populated **1920×1080** desktop be panel. Visible outcome: things at the
current place have an effect-first description, minutes, actual input cost and a
blocked reason; accepted work has a progress row after integration. Mobile is
deferred. No new panel, CSS or alternate navigation owner.

## CLR2 data probe and CLR1 source check

| Gate | Expected | Observed | Result |
| --- | ---: | ---: | --- |
| `missing verb` receipts in private `v1-be-replay-2026-10-29/run1.json` | 8 | 8 | PASS |
| Existing owner inventory before adding a seam | list | Below | PASS |
| Source-rejected actor assignment (non-gate) | 1 | 1 | Excluded: `lr.lotm.main.005#2` |

Existing owners examined:

- **Objects at places:** `src/book_world_lotm_cast_host.js` (cast locations in
  simulation.people), `src/simulation_effects.js` (world/actor facts and explicit
  observation). No ordinary-object registry was present in this cast pack.
  Objects therefore use namespaced facts in the existing world owner.
- **Shared stock:** `src/home_household.js`, `src/home_household_content.js` use
  simulation actors/resources and funded native jobs; `src/household_fortunes.js`
  is a separate original group-rule model, not this flat's pantry. Reused an
  existing cast household member's resource map for portions, without a new purse.
- **Containers:** `src/structured_container_runtime.js` owns powered identified
  native inventory compartments. Its source/energy/title requirements do not
  describe ordinary furniture. The drawer keeps the pack object's containment
  and exposure in world facts, without creating a second native inventory.
- **Washing/condition facts:** `src/status_care_content.js`,
  `src/status_care_facts.js`, `src/condition_facts.js` have no ordinary blood/linen
  washing owner. Used existing actor facts for the cosmetic body/shirt condition
  and world facts for the towel and room; no wound treatment or health grant.
- **Meter/fee:** `src/book_world_lotm_kit.js` native-money resource effect,
  `src/simulation_effects.js` reservation/settlement and `src/money.js` purse seam.
  Payment uses the same native-money effect as existing paid commands; no second
  money writer, currency or household-purse copy was added.

Read the cited paragraphs in the existing private `shard_s1_ch001-003.txt`,
including the rejected actor assignment. No acquisition or web source needed.
Object/stock terms, prices, counts and text are private pack data. Handling times,
portion division, retained case handling and exposure scale are labelled fills.
The reverse container action is a mechanism-derived fill, not a canon event.

## Replay targets (candidates, not newly scored successes)

| Replay row | Private act suffix | Expected coverage after integration/browser verification |
| --- | --- | --- |
| `lr.lotm.main.001#3` | `household_inspect` | Inspect the local arrangement, actor knowledge |
| `lr.lotm.main.002#1` | `household_pay` | Quoted native payment, fixture supplied |
| `lr.lotm.main.002#2` | `household_light` | Supplied fixture turns on |
| `lr.lotm.main.003#2` | `household_wash` | Body/shirt cosmetic condition, wet towel |
| `lr.lotm.main.003#3` | `household_clean` | Ordered trace removal and retained object |
| `lr.lotm.main.003#4` | `household_check` | Unload/count/reload fold, observed counts retained by the actor |
| `lr.lotm.main.005#1` | `household_eat` | One portion consumed from actual shared stock |
| `lr.lotm.main.005#5` | `household_store` | Held object moved into furniture, reduced observer exposure |

All IDs above have the `book.lotm.` command prefix. `household_take` reverses
storage and has no replay-success claim. **The replay score remains 0/18 in its
existing receipt.** Its private mapping was not edited. The mapping's row order
is not new source authority; storage and breakfast retain their cited source
ordering when replay is revised. Washroom travel/earned place knowledge remains
a separate replay gap; the lane's private host probe used named fixture moves.

## Save and seat ramifications (CL220)

No new envelope/domain schema or save writer. Added values use existing world
facts (`household.opening.*`, `place.act.seed.*`, `place.act.reported.*`), actor
facts/resources, simulation knowledge and standard queued jobs. Seed markers
prevent replenishing consumed stock on reload. Missing rows on an older be save
are initialized additively on its next host sync; existing values are preserved.
That is the compatibility decision for this slice, not reconstruction of actions
already performed in an older build. New object state stays serializable through
existing owners. Tests exercised a JSON state round trip and validation, **not**
the native Save/reload/Export/Import route.

Four original starts and beside: no new controls or seed fields from this slice,
even at the same coordinates; offers are be-scoped. This was checked for all five
profiles in the private fixture probe. A later other-seat consumer can reuse the
same rows with its own access/presence guard. Missing-pack lives remain read-only
under existing behavior; pending household jobs with the pack removed have not
been verified and need a future dormant-definition policy if that route is added.

Known bounds and expected refactor: this is a descriptor adapter over existing
simulation predicates/effects, not a new interaction language. Shared portions
are one resource on an existing household member; NPC meals/purchases and broader
group economics remain future consumers. Count text has explicit content guards
and observation effects, so changed contents refuse rather than report the old
count; a later generalized counting consumer should format variable contents.
G2 can read `objectNoticeability`'s exposure and containment; actual observer
search/detection, noise and sister reaction are not implemented here. Receipt
projection keeps the latest occurrence of each act in the knowledge owner; a
future bulk/offline repeat driver may need a per-occurrence report stream.
Pack regeneration must retain/produce the new `householdActs` field; the unowned
pack builder was not edited. The coordinator should preserve these private rows
when reconciling concurrent pack-generation work.

## Checks and input identity

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/place_acts.test.js` | PASS, 4 tests: all operation quotes/effects/receipts; stock/exposure; refusal atomicity; lost support; explicit counted observation | Synthetic fixture; no DOM/browser |
| `node /tmp/yairpg-h1-probe.mjs` | PASS: private pack validation, nine real pack commands quoted/committed/settled through host; existing `host.tick()` publishes Reports; four original starts and beside have no offers or seed fields | Fixture location moves; prepared view patch not applied; not a natural/browser journey |
| `BUILD_OUT=/tmp/yairpg-h1 npm run build` | PASS; isolated output | Built before host integration patch; no browser claim |
| `npm run check:arch` | PASS; main -59 lines, display -37, saves 0 growth; 6 grandfathered imports, 205 cycle edges | Shared checkout baseline; no new edge |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_INTEGRATION.patch` | PASS | Check only; coordinator applies/reconciles it |
| `node scripts/lane_review.mjs --grant <each owned path> <same explicit paths>` | PASS; 4 src/test paths, 118 private names, 0 name-hit files, 0 top-level-await files, 0 outside grants | Explicit seven-path candidate; unrelated checkout edits excluded |
| Full `npm test`, `check:rules`, desktop browser/native persistence | Not run by lane | Coordinator's combined candidate gate; rules/index unchanged |

Exact ownership review command (executed after the final focused test update):

```sh
node scripts/lane_review.mjs \
  --grant src/place_acts.js \
  --grant src/book_world_lotm_cast_host.js \
  --grant src/book_world_lotm_ui.js \
  --grant tests/place_acts.test.js \
  --grant private_packs/lotm-cast/cast.json \
  --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_CHECKPOINT.md \
  --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_INTEGRATION.patch \
  src/place_acts.js src/book_world_lotm_cast_host.js src/book_world_lotm_ui.js \
  tests/place_acts.test.js private_packs/lotm-cast/cast.json \
  docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_CHECKPOINT.md \
  docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/H1_INTEGRATION.patch
```

`git diff --check -- src/book_world_lotm_cast_host.js src/book_world_lotm_ui.js`
passed; the checkpoint's relative Markdown link check passed. Neither check
exercises gameplay or persistence.

Build SHA-256: `7ca11c5920907c4dac2a333a5b93b494790fdf3fbf5220ae4c758ac8912b9878`
(`/tmp/yairpg-h1/dist/bundle.js`). Source identities:

| Input | SHA-256 |
| --- | --- |
| `src/place_acts.js` | `e4b6f280a760acdec8f933c7fe8748117d2deb38e6f71b3004be2a64e12d2ef4` |
| `src/book_world_lotm_cast_host.js` | `f5d56b20792e2b51b5695b28d0e8defcffcb9a2b4a927f3fbc64b5fbfde84c9a` |
| `src/book_world_lotm_ui.js` | `e3571b96698056ce5e2567aae7d23d231a689e7cc91a31448212b2588cb8c7e9` |
| `tests/place_acts.test.js` | `c38ab3635b8c706f7231400604dc16fb9672677fc57b47a6c1603d5103af5dfd` |
| Private pack | `2d29bf4ae70a6a79b0fafaab494fa72e05b0c30f99eb250bf48dd42e49e32a55` |
| Temporary private fixture probe | `33892de8c6b91a1f738801b55c460a7ed92d491226c69a4732fa649839742267` |

## AD43 floor

| Floor | Receipt |
| --- | --- |
| FLR1 Build | PASS on the bundle hash above; integration patch not included |
| FLR2 Route | PARTIAL: synthetic engine and private host fixtures; natural route and rebuilt 1920×1080 browser pending coordinator |
| FLR3 Shown | IMPLEMENTED-UNVERIFIED: description/cost/blocked UI; host view patch awaits integration and browser |
| FLR4 Used | PARTIAL: stock, fixture, condition, observation, container and report consumers exercised; G2 detection consumer deferred |
| FLR5 Kept | PARTIAL: JSON round trip and simulation validation pass; native Save/reload/Export/Import pending |
| FLR6 Labelled | Built and agent fixture-verified, not browser-verified or human-reviewed; **implemented, below floor** |

Coordinator's remaining authoritative gate: apply/reconcile `H1_INTEGRATION.patch`,
rebuild the combined candidate, exercise the eight replay targets through visible
1920×1080 controls (including the existing washroom-route gap), and native
Save/reload/Export/Import. Update the private replay mapping/receipt only from
that evidence; do not count the fixture as fidelity or overwrite the old score.
