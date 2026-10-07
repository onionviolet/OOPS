# Actual office and reference-desk consumer bridge

Scope released: only `src/feature_expansion_book_host.js`, `src/feature_expansion_reference_desk.js` and this directory. Prior roster/research/source/shared files remain read-only. Features parent is the sole registry/native/UI/Ink/save/build integrator. New play is implemented-unverified.

## Native bridge exports

- `readBookNativeInputs(state,{character,locationId})` reads the actual native race/body/position, character total XP and plain native skill progress. Returned body/progression proofs are transient, sequence-bound inputs. Missing actual methods/progress returns no proof.
- `bookNativeContext(state,context,nativeInputs)` clears any prior body/progression proof, then attaches that fresh actual read. Keep `nativeAlive`, native gameplay/equipment/vitals/external owners from the actual existing `backlogNativeContext`.
- `qualifiedOfficeBody(state,context)` distinguishes the actual native human scaffold from a currently controlled clay body. An active clay possession is blocked even if the parked native character still reads human. Missing/wrong sequence/race/location/nativeAlive proof is unknown. A different current simulated body/controller is blocked.
- `qualifiedOfficeSnapshot(before,plan,command,context)` derives the exact roster evaluator snapshot from actual pre-state, staged post-state and live owners. It saves no carrier sheet or eligibility record.
- `assertQualifiedOfficePlan(before,plan,command,context)` returns the original valid staged plan or throws before publication. Non-appointment plans are transparent. Appointment must be the actual `backlog.replacement.accept_office` staged command.
- `createQualifiedBacklogAdapter(base)` preserves the actual injected Backlog adapter and replaces only `commit` and `preview`. The office preview calls the same pure actual base commit and guard used on commit. `base.commit` must already bind root's shared `advancePlan` where relevant.

Required `base` functions: `commit`, `preview`, `actions`, `validate`, `view`, `carrierView`; optional `context`/`stage` are preserved. Signatures remain the existing relay adapter signatures. Preview does not save, publish or mutate live owners.

The office snapshot derives same living/free Eda/Orrin/Bera, exact bodies/controllers/claims/duty, donor willingness and recipient's actual accepted appointment/credential. It compares every actor's source/technique/completion/non-duty resources; simulation powers/faculties/energy/progression/title/condition/other owner domains; native inventory/skills/reputation/equipment/vitals/money; worlds/clock/RNG; custody and actual right/duty transitions. Right/duty cause changes are allowed, their prior identity/status/other fields are retained. No replacement envelope, native patch, alternate inventory publication, XP/grant/unlock/material output or clock/calendar patch is accepted.

Prior private knowledge stays with its observer. Only the actual player appointment report is added. Prior personal axes/memories are retained; only Eda's one actual appointment remembrance may append. It cannot truncate/copy another person's memory. Consequently a full32-memory Eda account that the older native helper would trim cannot pass this stricter admission. The fixed Ink `ink.relay.lastResponse` may change to `office`; every other actor fact remains conserved. Native Backlog validation and Ink cursor validation remain authoritative.

## Exact parent joins

```js
// In the actual backlogContext native read, not from saved eligibility flags:
const context = bookNativeContext(expansionState, existingBacklogContext, {
  character, locationId: current_location?.id,
});
const qualifiedReplacement = createQualifiedBacklogAdapter(actualBacklogAdapter);
const relayHost = createRelayHost(qualifiedReplacement);
const relayInkHost = createRelayInkHost({
  previewReplacement: qualifiedReplacement.preview,
  commitReplacement: qualifiedReplacement.commit,
});
// The same final publication guard catches direct and Ink-routed office plans:
assertQualifiedOfficePlan(expansionState, plan, {id: plan.backlogCommand}, backlogContext());
```

The final guard belongs before native/save publication and before root adds generic item-log publication metadata. Fresh context includes native stock/equipment/vitals/XP as well as actual body proof. Callback preview and commit must receive that same fresh context. A staged plan alone or frozen hypothetical pass flags cannot replace these inputs. Do not route the office action through unqualified Backlog/Ink callbacks while showing a qualified preview.

## Original reference desk exports and registration

`REFERENCE_DESK_IDS`, `referenceDeskDefinitions`, `referenceDeskFacts`, `referenceDeskContext`, `referenceRegistryComparison`, `validateReferenceDeskState` and `createReferenceDeskHost()` are exported. The host exposes `context`, `preview`, `commit`, `presentation`, `validate`.

Merge `referenceDeskDefinitions.commands` and `.situations` into the sole actual simulation registry. The seven stable commands are `subtlety.reference_begin`, `subtlety.reference_registry`, `subtlety.reference_registry_returned`, `subtlety.reference_personal`, `subtlety.reference_texture`, `subtlety.reference_refuse`, `subtlety.reference_return`. The situation is `subtlety.reference_desk`, revision1, original current Frontier/Village discussion, with the existing player/Eda/Orrin/Bera. It stores only causal discussion context, not another office/body/source/stock carrier. No new people, sites, inventory, rights, sources, methods, XP or paid job are registered.

Commands use existing simulation effects/once receipts and native co-location/participants. All cost zero and last zero played minutes. They record attributed knowledge and their own finite completion/facts. Begin also records each present person's own account, so the later meeting has actual remembered knowledge. Quiet texture is a cup and bent slip, with no XP/item/quest reward. Refusal moves no right or debt and closes only this optional comparison.

Use `referenceHost.presentation(state,registry,freshBacklogContext)` in root's original interaction UI, and dispatch its `command:{type:'reference',id,targetId}` through `referenceHost.commit`. `type:'begin'` is also admitted for its explicit opening. Persist the returned staged plan with the existing sole publisher. Load/final validation calls `validateReferenceDeskState`; missing optional desk facts/situation/knowledge are inert. Fresh command context may be layered through `referenceDeskContext` where root's generic projectors need its facts.

`referenceRegistryComparison` is author/integration-only. It invokes the existing `recognizeBookWorld` `lotm1.office` registry algorithm only after an actual earned `backlog.replacement.registry_test` receipt matches the player's actual report/cause/time, actual credential, current actual right and current native body/control. It uses `mode:'source-comparison'` under the explicit original desk. While still appointed it confirms only the actual local right holder. After return, the old report and current Eda-held right differ. It grants neither a canonical Lord of the Mysteries office nor any magical recognition faculty. The personal option uses Bera's actual earned report only and never invokes unsupplied soul/body/magic signatures.

Public presentation contains only original local prose and player-earned attributed records. Do not display the comparison's `authorEvidence`, source title/era, raw carriers, private NPC state or debug result. Village is not a novel world. Broader source profiles remain unactivated.

## Static evidence and deferred gates

Two syntax checks, canonical engine-first imports and static local definition registration pass: seven commands, one situation. No host/evaluator/preview/commit/gameplay action or generated save was invoked. Alternate standalone import hit the existing shared cycle `ink_scene_content.js:117`, `relayIds` before initialization. The established engine-first import succeeds; no shared Ink edit was made.

Parent owns actual global registration, callback/publication joins, current save-reader compatibility and final matched build. Later behavior/save/failure/keyboard/director gates remain deferred: actual preview/commit agreement, wrong/missing native proof, parked clay body, tampered stock/XP/source/equipment/memory, earned versus fabricated reports, same-instance return/current versus historical rights, interruption and once-only ordinary/refusal/follow-up. Prior successful tests/bundles are not proof of this code.
