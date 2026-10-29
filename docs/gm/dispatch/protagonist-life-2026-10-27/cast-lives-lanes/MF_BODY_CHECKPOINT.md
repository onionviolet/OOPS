# BD1: body, sleep and meal bridge

Status: **implemented, below floor**. Agent-verified synthetic engine/native
fixtures, not human-reviewed. No shared integration patch applied, canon rows
adopted, commit, staging or push. Ownership released to the coordinator after
checks below. [Brief](BD1_BRIEF.md), [audit L7](MF1_AUDIT.md), related
[H2](H2_CHECKPOINT.md), [D2](D2_CHECKPOINT.md), [T2](T2_CHECKPOINT.md).

## Direction, probe and seam

F1: PROJECT.md and USER_VISION retain the lead-life main line, mechanisms before
bulk review, canon data private, order/window fidelity and broader world scope.
This lane changes no accepted decision. Applies AR1-AR16, AD36/38/43/45,
CLR1-CLR13, LSD139; MD1-MD3 remain proposed modularity guidance. MR5/MR29 govern
stock conservation and existing owners; no food-making resolver is introduced.
The explicit BD1 grant names `cast_body_adapter.js` and this checkpoint, resolving
the older MF1 proposed `cast_care_adapter.js`/`MF_CARE_CHECKPOINT.md` filenames.
Its reference to L4 is a brief typo: the behavior mandate is L7.

F2: source probe found existing native beginSleep/endSleep ports, native recovery
in main.js, simulation resource reservations/refunds, job participants and exact
saved-definition validation. H2 waking/rest is fact-owned, not native sleep.
The reviewed private rows in
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`
include waking, interrupted sleep, ordinary food handling and shared meals without
per-person amounts, plus dream/other-body cases outside this slice. They were
read as paragraph paraphrases, not treated as command authority. No acquisition,
source wording or identities are copied into public outputs. Missing `bodyCare`
is expected to create zero commands; this is tested. No named count gate failed.
Target 5-15 candidate steps is the audit estimate, **0 new source rows verified**.

F3: public adapter and tests are synthetic/name-free. Existing simulation owns
clock, actor resource stocks, command admission, participant reservation,
completion support/refund, receipts and save storage. Existing native sleep owns
sleep flag and physiological recovery. No new state slice, clock, RNG/draws,
transaction owner, stock seed, nutrition amount or recovery rate. The single
location authority remains `simulation.people[actor].location`; dream movement
is not an effect offered here. No new import cycles or core-owner growth intended.

D1: default native sleep/recovery and conserved stock; dials are supported duration,
participants, allocation detail, authored continuing requirements and native
recovery rates; reason is physiology, co-presence and actual household supplies.
Known amounts charge existing stocks once. Unknown food quantities stay null and
record the supported meal observation without decrementing a guessed amount or
inventing a split. Missing stock metadata is unknown, not an assertion of free
food. Unknown ordinary care/meal minutes are projected as null and settle as an
immediate supported event, without advancing a fabricated duration. Timed sleep
needs a positive supplied duration (source-supported or explicitly labelled fill)
for its wake boundary. Recovery still follows the existing native owner.

## Pack contract for the row lane

Optional **`pack.bodyCare = {acts:[...]}`**. `defineBodyCare` returns ordinary
simulation commands; source metadata is retained in the private row, not published
by this adapter. The reviewed-row merger must add a `bodyCare` producer/validation
branch later; its source is outside BD1's grant and has not been changed.

| Field | Schema / behavior |
| --- | --- |
| `id`, `kind`, `label`, `report` | Stable ID; kind `sleep`, `wake`, `meal`, `care`; nonempty supported label/report |
| `description` | Optional practical description, default report |
| `place` | Optional resolved native pack place ID; absence adds no location gate |
| `minutes`, `minutesBasis` | Optional nonnegative integer and metadata; null/missing unknown; sleep needs positive duration, wake is immediate |
| `participants` | Optional actor-ID array; includes acting body automatically; native co-presence and occupancy apply |
| `food` | Optional meal array `{owner,key,amount}`; existing actor resource owner/key; amount positive finite number or null/absent. Aggregate amount stays aggregate; no per-person shares inferred |
| `requires` | Optional supported native predicate, not an empty requirement array. No inferred prior evidence/stage gate |
| `ownerNeeded` | Optional named missing owner; writes `actor.body.ownerNeeded.<id>` fact, without invented body effects |
| `source`, `sourceStepId`, `sourceStepIds`, `locator` | Optional private provenance; JSON-safe values |

Synthetic examples (also exercised in the focused test):

```json
{"bodyCare":{"acts":[
  {"id":"fixture.sleep","kind":"sleep","place":"fixture.place.home","label":"Sleep","minutes":4,"minutesBasis":"fixture duration","report":"You wake after resting."},
  {"id":"fixture.wake","kind":"wake","place":"fixture.place.home","label":"Wake","report":"You regain wakeful movement."},
  {"id":"fixture.meal","kind":"meal","label":"Share a meal","participants":["player"],"food":[{"owner":"player","key":"fixture.food","amount":3}],"report":"You share the meal."},
  {"id":"fixture.taste","kind":"meal","label":"Taste the meal","food":[{"owner":"player","key":"fixture.food","amount":null}],"ownerNeeded":"nutrition and portion owner","report":"You taste the shared meal."}
]}}
```

Known consumption and unknown portions use the same native knowledge receipt
`body.care.<id>`, including actual participants and food amounts/nulls in its
observation basis. Knowledge/fact predicates can consume these receipts; care
without a physiological owner produces the named owner-needed fact, not a
fabricated recovery result. Ordinary native sleep restores actual health/stamina;
interruption cancels the pending job without its completion receipt. Explicit wake
cancels supported sleep and commits its wake receipt in one persistence plan,
then ends native sleep. An H2 awake fact cannot replace the native sleeping flag.

## Prepared integration and compatibility

A1: coordinator applies/reconciles [BD1_INTEGRATION.patch](BD1_INTEGRATION.patch).
Shared source was read-only. Its hunks touch:

| Prepared path | Registration / change |
| --- | --- |
| `src/book_world_lotm_cast_host.js` | Import adapter, optional field read in deriveCast, `castBodyCommands`, quote wrapper, **one existing registry command-list site** |
| `src/book_world_lotm_host.js` | Import commands/offers, context sleep fact, body quotes/jobs, sleep/wake/cancel/tick integration, narrow saved-sleep restore port |
| `src/book_world_lotm_state.js` | Existing owner checks and exact pending-command lookup; exact body completion-support comparison |
| `src/book_world_lotm_domain.js` | Existing command table exposes `restoreSleep` |
| `src/main.js` | Replace existing `start_sleeping()` restore call with domain restore attempt and legacy fallback; one line replaced, **zero growth**, no new top-level registration |
| `src/book_world_lotm_ui.js` | Existing actions area: Rest and meals disclosure with description, cost, duration, blocked reasons |
| `src/perspective_controls.js` | `body-care` in-world inventory tag |
| `tests/perspective_controls.test.js` | Matching body-care family expectation |

F4: native persistence fixture initially exposed generic restore calling
`start_sleeping()`, which refuses an occupied actor, including the saved sleep
job itself. The prepared domain restore command recognizes the already-validated
body sleep job while restoring and invokes the existing native beginSleep port.
The legacy restore fallback remains at its existing main.js site. No validator or
occupation bypass is added for unrelated work. Main.js and native joins remain
coordinator-owned prepared hunks, not direct shared edits.

No new save shape/migration. Old saves lacking body rows retain existing values;
current pending jobs require the matching pack definition and exact costs,
effects, revision, actor and completion support. Pack-loss recovery is unchanged.
Fixture applies the patch in a disposable source copy **unless reverse-check is
clean**, in which case it tests live integration; perspective tests are copied
and patched there too. Future concurrent host context changes can require the
coordinator to rebase the patch, as the brief anticipates.

Target UI is the existing populated **1920x1080 desktop** place panel, with an
in-world Rest and meals disclosure showing the supported action, stock cost,
time/unknown time and blocked reason. Mobile optimization deferred. Headless DOM
checks establish reachability/perspective, not desktop layout proof.

## Checks and floor

Input: shared HEAD `d7eea04e02e2027c6be5f5302456ccbd97c31053` plus these
owned leaves and patch, copied with concurrent shared source into a disposable
candidate. Shared work outside BD1's five grants is not claimed. Tests copy
source/scripts, perspective test and synthetic pack; no player save is accessed.

| Command / input | Result | Gap |
| --- | --- | --- |
| `node --test tests/cast_body_adapter.test.js` | PASS 6/6, 70.96 seconds. Native registry JSON, silent absence, quote purity, stock reservation/conservation, absent-food failure, participant loss/refund, unknown portions, native-vs-fact waking, interruption, real UI, pending/settled validator and tamper rejection, native sleep restore/early wake/recovery and literal Export/Import | Synthetic/headless fixture, no new canon rows or desktop proof. Forward patch path exercised; already-integrated reverse-clean branch is implemented but not exercised in this run |
| `node --test tests/perspective_controls.test.js` in disposable patched copy (invoked by focused test) | PASS; new family inventory/tag assertion included | Headless/static inventory, not desktop layout |
| `BUILD_OUT=/tmp/yairpg-bd1-build node build.js` in disposable patched copy (invoked by focused test) | PASS, bundle SHA-256 `22678b6f30175604ede04a583bcdddbb5cea8c0456680bf42cb93d992db78231` | Built candidate, not rebuilt desktop-browser exercised; shared outputs untouched |
| `npm run check:arch` in shared checkout | PASS; main -51, display -37, save writer 0 vs baseline; 6 grandfathered imports, 205 cycle edges | Shared source, before integration |
| `node scripts/check_architecture.mjs` in disposable patched copy (invoked by focused test) | PASS; same main/display/save counts, imports and cycle edges | Confirms prepared candidate adds zero growth/cycles |
| `git apply --check --whitespace=error docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/BD1_INTEGRATION.patch` | PASS | Coordinator may rebase after another host lane lands |
| `node scripts/lane_review.mjs` with the five exact BD1 grants and paths | Raw scanner FAIL: 2 code/test files, 2896 private names, 1 name-hit file, 0 top-level await, 0 outside grant | Manual exact-name scan: adapter has zero hits; test's sole hit is generic `World` matching existing helper property `I.world`. No canon identity/content added. Scanner result remains FAIL, not relabelled PASS |
| Scoped `git diff --check` and Python owned-file whitespace/local-link check | PASS | Prepared context whitespace preserved; new-file whitespace and local links checked separately |
| Full `npm test`, `npm run check:rules`, rebuilt fresh-origin 1920x1080 browser | Not run by lane | Coordinator combined gate; rules/index unchanged |

Earlier failed runs were corrected: disposable copy omitted the perspective test
path; then native pending sleep restored as awake because the generic native
sleep start rejects occupied actors. The final passing fixture exercises the
narrow prepared restore route and actual health recovery without weakening the
validator. A broad read-only path search was interrupted after the relevant
private path was found in RV7; it produced no data and has ended. No test worker
is intentionally retained.

| Floor | Evidence / remaining gap |
| --- | --- |
| FLR1 Build | Patched disposable build passes; bundle hash above |
| FLR2 Route | Synthetic named native fixture clicks real place actions from a fresh fixture life; no natural source route or rebuilt desktop route |
| FLR3 Shown | Headless description, stock cost, wake refusal and perspective disclosure checked; 1920x1080 visual proof remains |
| FLR4 Used | Existing stock is depleted/refunded, native health recovers, sleep/wake changes native occupation and permits later meal actions; observation/fact receipts support subsequent native predicates |
| FLR5 Kept | Real pending meal Save/reload/Export/literal Import, pending sleep Save/reload, settled sleep/meal Save/reload/Export/literal Import; exact saved cost/support tampering rejected. No new save slice. Browser persistence remains coordinator proof |
| FLR6 Labelled | **Implemented, below floor**; engine/native-headless fixture agent-verified, not human-reviewed |

Remaining authoritative gameplay gate: coordinator applies/reconciles this patch
and performs the rebuilt fresh-origin **1920x1080** sampled journey on the
combined candidate, with persistence. Human review is optional. Coordinator owns
combined pre-commit gates and commits; BD1 has not committed or adopted content.

Known limits/expected extension: hunger/fatigue clocks, quantified nutrition,
ordinary-care recovery, dream situation/observer agency and other-body induced
sleep require their named native owners. Unknown food/need effects remain facts
with owner-needed attribution, not fabricated results. Source row ingestion and
native resource-stock binding belong to the later reviewed-row lane. The leaf
is replaceable behind `defineBodyCare`/`quoteBodyCare`; no new global framework.


| Frozen owned input | SHA-256 |
| --- | --- |
| `src/cast_body_adapter.js` | `e1539d4afd3ea757eae7228d50ffb1b0ccb04b39385cb1ab3c096b354b876d02` |
| `tests/cast_body_adapter.test.js` | `ec77418731c513327153fbd820158e8e9300f174874a6833b70316f0de871b82` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/BD1_INTEGRATION.patch` | `d9c42784fd9f142e198213a72ab99ed9e92b6ad7ae8556bce487a33e2db97181` |

## Resume 1: integrated fixture repairs

The original receipt above records the pre-integration handoff. The coordinator
has since applied BD1's prepared integration to the live source. In this resume,
`tests/cast_body_adapter.test.js` and the explicitly granted
`tests/cast_exchange_adapter.test.js` copy and exercise that live source, following
[TH1](TH1_CHECKPOINT.md); neither fixture probes or applies a prepared patch.
CU1 was already integrated in HEAD `8fc6cb700`; its old reverse-check failed
because later host hunks changed context, then its stale forward patch failed.
No native UI, validator, tampering or Save/reload/Export/Import assertions were
removed. The body fixture now builds under its own disposable directory: its
previous fixed `/tmp/yairpg-bd1-build` retained dangling asset symlinks from a
removed earlier fixture, causing the reproduced `build.js` exit 1.

The existing integrated `body-care` in-world perspective tag and the matching
`tests/perspective_controls.test.js` expectation were checked and retained; no
additional edit was needed. Rules: AD36, AD43, CLR9, CLR13, AR7, AR10; this is a
fixture repair, not new gameplay or browser evidence.

| Command / input | Result | Gap |
| --- | --- | --- |
| `node --test tests/cast_body_adapter.test.js` before repair | FAIL 5/6: native fixture's build exited 1 at its reused output path | Reproduced; build directory had symlinks to a deleted fixture |
| `node --test tests/cast_exchange_adapter.test.js` before repair | FAIL 3/4: stale CU1 patch failed to apply to the live integrated host | Reproduced; no runtime regression established |
| `git apply -R --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/BD1_INTEGRATION.patch` | PASS against live source | Confirms BD1 was already integrated at this check |
| `node --test tests/cast_body_adapter.test.js tests/cast_exchange_adapter.test.js tests/perspective_controls.test.js tests/place_acts.test.js` | PASS 16/16, 71.48 seconds; both native persistence fixtures and perspective inventory passed | Synthetic/headless; no rebuilt desktop journey |
| Disposable fixture build and architecture checks, invoked by combined test | PASS for both; main -51, display -37, save writer 0 growth, 205 grandfathered cycle edges | Fixture builds; no browser proof |
| `git diff --check -- tests/cast_exchange_adapter.test.js tests/perspective_controls.test.js src/perspective_controls.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF_BODY_CHECKPOINT.md` | PASS | Tracked-file whitespace only; body test and checkpoint were untracked at this check |

Input: shared HEAD `01ff3a31b7ced96401936c3a5499de26b2ad4d50` plus live dirty
integration and these fixture edits. Body test SHA-256
`41a2a64c763ed4bd7b4b795137285c31b2ca9aa0a8d88cfde65f175b74ad1eb9`;
exchange test SHA-256
`893d0c5b0b89dbb3a0ee27883714588a58641fbf37e7177dce9c23c779d55e6b`.
No commit. The combined candidate's rebuilt 1920x1080 browser journey and
coordinator's remaining gates remain open; human review is optional.
