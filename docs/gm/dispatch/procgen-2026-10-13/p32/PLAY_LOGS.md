# AO2: optional local session observations

2026-10-14. **PROPOSAL ONLY.** Extends [root AO2](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#ao-content-math-and-playtest-data). [P18 metrics](../p18/METRICS.md) owns measurement definitions; [P28 taste](../p28/TASTE.md) and [P22 feedback](../p22/FEEDBACK_LOOP.md) own deliberate ratings/bookmarks and gameplay taste controls. P32 adds log transport/retention/signal boundaries, not another feedback schema or automatic preference engine.

## AO2.1: default off, two independent choices

Offer **Record this session locally** and, separately, **Use deliberate feedback for taste suggestions**. Both default off; neither requires the other. Logging refusal leaves game behavior/next draw/save bytes unchanged. A visible indicator, Pause/Resume, retention status and log-only Clear/Export controls make the choice inspectable. Never auto-upload, call analytics/model/CDN endpoints, cloud-sync, attach an export to a bug report or read the source library. Local processing needs no remote LLM.

Default recording can be an in-memory ring. Optional durable log-only IndexedDB has a distinct database name/schema, with at most 10,000 records or 5 MiB encoded log data for a first prototype; oldest unbookmarked observations expire by selected retention. These are storage tuning proposals, not gameplay limits. Bookmarks remain under their P22 owner; the logger retains safe reference labels only, not a duplicate permanent comment store. Delete/export operates only on this ring/database, never a save, backup, character or bookmark. User-triggered file export stays on this machine; no automatic transfer or account integration. A separate local companion/file-backed route remains an option if browser quota isolation is needed.

Same-origin IndexedDB still shares browser resource/quota pressure. Distinct naming alone is not isolated quota. Keep durable logging optional, small and discardable; catch quota/failure, pause recording, and preserve ordinary game operation. Do not reserve capacity by reading or deleting native save keys. Default memory mode avoids persistent quota contention. Independent database/storage-policy review is a future gate, not permission to patch save code.

## AO2.2: one-way safe event input

Consume a purpose-built observer-safe event/projection stream after normal durable gameplay publication. Never invoke `create_save`, import/export handlers, save decoders, private save paths, localStorage save/backup keys, native inventory truth, sealed source objects or full DOM snapshots. If an observer stream does not exist, implement it through the selected UI/event owner later; the logger cannot substitute private save inspection. Main's `src/main.js:5189-5197` serialization and `src/save_files.js:185-215` guarded persistence are explicit excluded routes.

Proposed allowlisted log row:

```text
logSchemaRevision, loggerRevision, randomLogSessionId, sequence,
elapsedActiveSessionMs, visibilitySegment, safeSpeedSegment?,
knownWorldLabelOrOpaqueSessionScope, observedContentPublicRef?,
contentRevision?, knownSemanticFamily?, expressionRevision?,
kind: exposed | chosen | skipped | bookmarked | explicitRated |
      viewOpened | viewClosed | sessionPaused | performanceAggregate,
knownChoiceCode?, feedbackRevisionRef?, explicitLearningChoice?,
activeDwellBucket?, coverageOrDroppedReasonCode?
```

Session IDs use logger-local randomness independent of gameplay streams; they are not player/save identifiers. Unknown private IDs cannot simply be hashed into export: small candidate spaces are reversible. Use only approved public IDs after discovery or fresh session-local opaque labels with no exported reverse map. Never record seeds, RNG receipts, true traits, undiscovered family/count, latent chronology, material composition, exact purse, player name, free text, raw source prose, page URL/query or error stacks. If a known label itself reveals a sealed truth, omit it and retain only allowed ID/route/status under the seal policy. Do not automatically log typed intent/comment text.

An exposure is once per actually learned occurrence/utterance, not each render, scroll or repeated panel open. A generated but unseen event belongs to a synthetic P18 trace, not Weibao's seen-content log. Replayed log delivery deduplicates using the observer-safe occurrence/version token. Log/session counters live outside saves. Clearing logs must not clear in-game seen/repetition memory or redraw content.

## AO2.3: skips and dwell are diagnostics, not votes

| Signal | Safe use | Unsupported interpretation |
|---|---|---|
| Explicit more/less/favorite with learning choice | P28's normalized known-tag evidence, via P22 feedback revisions | A bug mark is not dislike; favorite without learning choice is not a training vote |
| Skip/decline/automatic expiry | Compare burden, response reach and reasons already shown | Dislike of genre/person; willingness/morality; missed text might simply be idle |
| Active visible dwell | Length/reading-flow diagnostic with visibility/focus and interruption coverage | More time means enjoyment; background tab time means reading |
| Bookmark without rating | Review-worthy moment and locally navigable known reference | Automatic positive taste, or proof that a bug is desired |
| Performance aggregate | Counts/time buckets for selected UI/domain work; dropped log count | Frame delay means boredom or game-time absence |

Active dwell begins after a visible event view is shown, stops on hidden/blur/close, and is bucketed (for example <5 s, 5-30 s, 30-120 s, >120 s). Unreliable focus or interruption is unknown/censored, not zero. Logging cadence never awards XP or supplies game time. Session duration and game-clock duration remain separate per P18 M0. Sparse observation counts are diagnostics about these sessions, not demographic or personality conclusions.

Feed safe aggregates into P18's existing measurements with an explicit **personal opt-in observational** label, observation window, clock segments, missing coverage and sample count. These logs cannot establish unseen pool eligibility, exact selection probabilities, cause conservation, long-run seed fairness or save growth. Use synthetic P18 runs for those. Human feedback and natural logs complement source QA; neither replaces it.

## AO2.4: taste suggestions without touching saves

The logger and local analyzer have no game write capability. They can display “You deliberately marked three warm everyday moments for tuning” with known feedback references, plus a reversible suggested profile. Silence/passive behavior contributes no preference weights. No inference of health, relationships, morals or personal traits. All legal genres/options remain reachable under P28's positive exploration floor and world laws.

**Integration contradiction:** P28 AD1.4 proposes save-backed taste settings/revisions; AO2 requires logs never touch saves. Keep them separate: log/analyzer reads safe feedback and produces advice only. If Weibao later deliberately applies a suggested setting, the existing authorized game-setting owner performs its normal durable command, validates/stamps it and affects future uncommitted selections. That separate handler may save its own setting; the logger still cannot read/write saves. Until such a handler is selected and proven, suggestions have no gameplay effect. No mutable external log file silently changes draw interpretation after reload; pending cast/text/terms stay frozen. Local-log deletion does not reverse past gameplay.

P22 bookmarks or P28 settings can exist in the game without enabling this log. Conversely, logs can report repetition with taste learning off. If a selected bookmark owner is save-backed, capture only its published safe projection after its own user command; do not create bookmarks from a logger action or merge imported logs into gameplay state. This preserves the direct no-save-touch boundary while leaving explicit future taste controls reachable.

## AO2.5: acceptance and failure behavior

All future gates OPEN: disabled recording produces zero log storage/network/gameplay effects; enabled recorder has zero save-key/file/decoder access; log write/quota/export failure leaves ordinary play/draws untouched; queue is bounded/asynchronous and drops diagnostic rows with a coverage marker rather than blocking gameplay; clear/export targets only logs; no external request on recording, analysis or export; known-only fields and sealed ID/status review; duplicate delivery and hidden/blur dwell cases; reload changes no gameplay due solely to external logs. A strict allowlist and capability-limited API make these observable checks, not privacy promises based only on UI text.

At 1366x768 and 1600x1000, future UI should keep ordinary actions visible beside compact recorder controls and a readable local review pane. Mobile optimization deferred. Save/reload/export/import compatibility belongs to the selected gameplay owner's proof, using synthetic fixtures; logger checks use spies without opening Weibao's actual saves. Human usefulness/taste acceptance remains separate. No logging was enabled or personal session data collected by P32.
