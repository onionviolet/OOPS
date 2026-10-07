# Scoped Ink cursor release

> Current admission: parent retained content1/2 and compiled revision3 with six scenes, bound the actual nested native callback/commands and released source. [INTEGRATION.json](INTEGRATION.json) and [REFINEMENT_RELEASE.json](REFINEMENT_RELEASE.json) own the current joins/hashes. The release snapshot and revision2 instructions below are historical worker evidence, not current build proof. Gameplay/save checks remain deferred.

2026-10-05. Internal worker `/root/compiler` received exclusive writes only to `src/ink_narrative.js` and this file. Both are released to the Ink parent with this receipt. Parent owns story/content/compiler files; Features owns every shared/native/save/UI/build join. No child, process, file write or pending operation remains under this worker. New behavior is implemented-unverified.

Read live Ink CHECKPOINT, the nested-world steering packet, subtlety INTERFACE, nested-campaign INTERFACE v1 and the actual runtime/content/native/UI callers before editing. The selected nested footprint uses actual hub/destination/mission owners from Features; this runtime supplies only narrative selection, opaque cursor boundaries and staged receipts. It owns no mission, source, stock, payout, XP, body, clock, native location or durable publication.

## Compatibility and saved shape

`INK_NARRATIVE_SCHEMA` remains1. Existing wrapper1 records, optional missing `sceneId` Tidemark default, runtime2.4.0/story21/save10, content hashes, frames, session/revision guards and ordinary no-scope host calls remain supported. Missing narrative state remains null/absent. Loading, validating, reading and rendering never migrate or enroll a scope.

`INK_NARRATIVE_SCOPED_SCHEMA` is2; `INK_NARRATIVE_SCOPE_LIMIT` is32. An explicit first successful scoped staged command creates this wrapper:

```js
state.inkNarrative = {
    schema: 2,
    legacy: priorWrapper1OrNull,
    scopes: [
        {
            schema: 1,
            scope: {id, kind, worldId, instanceId?, missionId?},
            // Complete existing record fields, including explicit sceneId:
            contentId, contentRevision, contentHash,
            runtimeVersion, inkFormat, saveFormat,
            sceneId, sessionId, revision, status,
            startedAt, updatedAt, cursor, frame, receipts
        }
    ]
};
```

This is a shape sketch, not executable fixture data. `kind` is exactly `scene`, `hub`, `destination` or `mission`. All IDs are explicit nonempty strings of at most128characters containing only letters, numbers, underscore, dot, colon, slash or hyphen. No name, location label, source title, actor inference or current mission label creates an ID. A destination needs `instanceId`; a mission needs both `instanceId` and `missionId`; any present mission ID needs an instance. Unknown scope fields or invalid optional IDs reject. The scope's `worldId` must exist in `state.worlds` for saved validation and scoped preview/commit. Native instance/mission existence and permissions require the callback below because this module does not own those domains.

The legacy slot is copied unchanged during that first migration. Later scoped commands retain all unrelated scopes and legacy data from the original state; later ordinary legacy commands update only `legacy`. One scope's completed record may start a new session through its explicit begin/revisit, retaining its last64 scoped receipts. No automatic eviction, retirement, cursor transplantation or scope rebinding occurs. An existing scope ID cannot switch its kind/world/instance/mission or authored scene. A different scene needs its own explicit scope ID. An unrelated scope can retain its active/interrupted boundary while another scope is selected.

Wrapper2 validates every full record, unique scope IDs and current sessions, exact receipt scope/scene binding, a maximum32scopes, maximum1,048,576aggregate opaque cursor characters including legacy, and maximum2,097,152serialized wrapper characters. Existing per-record bounds remain:262,144cursor characters,256paragraphs/32,768total paragraph characters,12choices and64receipts. Scoped receipt IDs may use up to384characters and include scope ID/session/revision/response; ordinary legacy IDs retain their160character bound. Saved formats and content identity must match retained assets before opaque load. A safe saved response boundary must still reproduce the exact saved choice frame; completion must match the absence of choices.

## Public API and tokens

Existing functions retain their signatures: `validateInkNarrative(state)`, `commitInkNarrativeAction(state,registry,request,context,host)`, `previewInkNarrativeAction(state,registry,id,context,host)` and `inkNarrativeView(state,registry,context,host)`.

`validateInkNarrative(state)` returns the validated wrapper1 record, wrapper2 container or null. Wrapper2 deliberately has no top-level active status/frame/session. New `getInkNarrativeRecord(state,host = null)` returns the selected exact scope record, the legacy record for an ordinary host, or null. It validates before selection and never moves a legacy cursor into a scope. Main or another caller that needs `.status/.frame/.sessionId` must use this helper with the same concrete host rather than inspect wrapper2 as if it were wrapper1.

`inkNarrativeRequest(state,id,host = null)` extends the previous API with an optional third argument. Fresh tokens always include `expectedSequence` and `expectedClock`. A supplied host adds `sceneId`; a scoped host adds `scopeId` and the complete normalized `scopeBinding`. Existing selected records add session/revision. `inkNarrativeView` already supplies this concrete host when generating its UI token, so the current UI retains its captured displayed token without a new widget API.

Scoped commits require exact token scope ID/binding/scene, input clock, input sequence and selected session/revision. A new scope rejects another record's session token. An ordinary host rejects scope tokens; old no-scope tokens without `expectedClock/sceneId` remain accepted under their original sequence/session/revision checks. Fresh ordinary tokens check those new fields when present. Native host preview and commitment still recheck actual current circumstances after token validation.

## Required actual native scope bridge

A scoped host supplies explicit `host.scope`, explicit `host.sceneId`, existing `observe/preview/commit`, and this pure synchronous callback:

```js
host.validateScope(state, registry, scope, context, binding)
// Returns an observer-safe current quote:
// {scope: exactScopeBinding, visible: boolean, eligible: boolean, reasons?: string[]}
```

`scope` is a copied normalized binding, not a writable game owner. The returned `scope` must match it exactly. A Promise, missing callback, missing/changed binding or malformed quote fails closed. No native scope is inferred from a scene label or registered definition. Features must bind the callback to the actual initialized instance, mission issue/acceptance/arrival/outcome/extraction/settlement stage, issuer jurisdiction, current actual location/participant/body/controller, actor consent/life/access/busy/native support and applicable command permissions. Those checks must use current native/domain state and earned observer-safe explanations; a narrative cursor or saved eligibility flag cannot grant permission or a payout.

The callback is called before native action preview and before staged commitment. It also checks pause using `{id:'ink.cursor.pause',kind:'narrative'}` and resume using the host's actual begin binding. This lets the admitted native bridge specify legal interruption away from a participant without inventing another travel/body owner. The existing `host.preview` still checks real command costs and native eligibility; `host.commit` must return a distinct sequenced pure staged plan. Main alone persists and publishes the entire plan/cursor envelope once. Narrative continuation still runs only on that staged candidate, after host acceptance; no Ink external callback owns a resource or reward.

The runtime validates only world-map existence structurally. The callback is a required native consumer, not a delivered native instance/mission implementation. Exact nested action IDs and callback binding remain with Features/Ink parent; no nested scene activates merely because this scoped container exists.

## Joined clock and content retention

Ordinary hosts retain the no-time-advance rule by default. Only a code-level admitted host with `allowJoinedClockAdvance === true` may return a safe nonnegative monotonic common-clock advance. That host uses the existing joined native/global/Chronicle planner and calendar/save validators; the flag is not a saved narrative field or request permission. No narrative timer, subjective clock or offline advancement is added. Fresh expectedClock still checks the input boundary. Narrative `startedAt/updatedAt` and receipt timestamps use the accepted staged plan's final clock; pause/resume keep the existing same-clock cursor-only plan.

Supported scene IDs are read from each actual artifact's `yairpgInk.sceneIds`. Those lists require nonempty unique bounded IDs. Retained v1 without the list supports only `tidemark.negotiation`; historical revision2 without the list supports `tidemark.negotiation` and `relay.office`. Later content revisions require an explicit list. Unsupported scene IDs block both begin/revisit preview and commitment.

Current imports retain immutable v1 plus current revision2. At this static snapshot v1 identity is `sha256:ae0be8ab54ef5d062fb651cd7cd070b122ecaf9f79fc9f9ac00cf730a72a6a1f`; current R2 is `sha256:2eceb76c13cc1c3e856203f84d6349d98e9e5a963e0f7c7e6afa2555eeb76a65`, with the two explicit scene IDs. These are observed content identities, not new hardcoded runtime pins. Before parent replaces current R2 with nested R3, parent must archive the finalized R2 JSON and add that immutable asset to the runtime's `contentByHash/INK_CONTENTS` imports after this writer release. Keep both exact earlier identities and their scene lists. Unknown content remains a recoverable rejection retaining already paid host effects; no implicit cursor migration or replay occurs.

## Static release evidence

Performed after the joined-clock change: Node syntax check; cold ESM import of runtime exports and actual JSON metadata; memory-only browser esbuild with zero warnings/55inputs; exact source-map correspondence for all31local bundled source contents. No shared bundle or filesystem output was written. No `Continue`, choice selection, validator-state fixture, runtime save/load, unit, browser, gameplay, failure, keyboard, regression or director check was executed. Runtime import constructs the existing throwaway validation Story objects without continuing them. These checks establish source/import/link correspondence only.

Observed SHA256 inputs/output at that check:

| File | SHA256 |
|---|---|
| `src/ink_narrative.js` | `4c24ba90a253031bf33249bfb7729f6b59ddaf94d2a624a75858b86fa62b6d5e` |
| `src/ink_scene_content.js` | `7b738cdebb33c382651118c5168664b25e32f5b844135f553ca6e8d9f4bde795` |
| `stories/feature_wave.json` | `12ac8ccdca19c8e4c6b63fe79210efc4e267e4b1953b2c4c3b18a038e4876486` |
| `docs/gm/feature-wave/ink/content/feature_wave_v1.json` | `edcc739418595110cf6800d3f1befefec9248f79f0c2545f2d6174a9ca4b9462` |
| `docs/gm/feature-wave/features/nested-campaign/INTERFACE.md` | `5e47ff33f767f4b64476ce4723153ac8b46ee09e275129a972053c5b4fb53347` |

Required next joins: actual scoped native callback/commands/observer variables, compiled nested scene IDs and retained R2 asset, main's same-host read/token/commit selection, expansion/save validation through the one publisher and Features' final current-build correspondence. Later gates must cover independent partial scopes, wrapper1-to-wrapper2 explicit migration, old-content interruption/resume, wrong instance/mission/scene/clock tokens, live host changes, once-only settlement, clock advancement/failure retention, departure/return/revisit, observer privacy and director fiction/pacing. Preserve all private saves and existing native/domain histories.
