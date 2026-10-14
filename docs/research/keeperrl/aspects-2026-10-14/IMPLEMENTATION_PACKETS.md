# KeeperRL: implementation proposals, 2026-10-14

All packets are PROPOSALS, not accepted design or implementation. They reuse current systems, require a fresh owner/readiness check and permit repeated reasonable solo-player access. No cross-file ownership or runtime write is granted here. Compatibility decisions belong to a future implementation owner.

## PK1: Teach queued work and completed work as different steps

Source: KeeperRL, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/simulation_content.js; src/feature_expansion_work_plan.js`.

Behavior: For an existing workshop slice, separately teach scheduling, paid settlement and actual use. Highlights point at existing controls rather than replacing the layout. Low to medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: A queue can complete the scheduling step, but only paid output and actual use complete later steps; save/reload/import retain the correct stage.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PK2: Let one small chat perform a real useful exchange

Source: KeeperRL, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/data/dialogues.js; src/models/dialogue_action.js; src/feature_expansion_society.js`.

Behavior: Use current actor access and consent, a resource/service consumer and an honest time cost. Friendly/hostile presentation never bypasses eligibility. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: A refused/out-of-range exchange spends nothing; valid execution changes useful state once; revisiting and reload do not repeat settlement.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PK3: Show a worker's next useful task and blocker

Source: KeeperRL, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/feature_expansion_society.js; src/simulation_ui.js`.

Behavior: Extend an existing resident panel with next eligible task and reason for waiting. Preserve actual stock/custody and consent rules; no parallel controller. Low to medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Lost tool or funding pauses before growth/output; restored means permit the declared job and its result persists.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PK4: Keep run receipts separate from profile unlocks

Source: KeeperRL, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/frontier_campaign.js; src/save_compatibility.js`.

Behavior: Audit existing receipt lifetime before adding anything. One earned accomplishment can have run context and optional retained profile recognition with separate compatibility/default rules. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Reset only the selected run layer; retained recognition has real provenance and cannot be earned by preview/importing malformed data.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PK5: Expose resource and actor detail together on desktop

Source: KeeperRL, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/display.js; docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

Behavior: Use laptop width for current resources, worker state, selected job and aftermath at comfortable text size. Proposed target viewport 1366x768; mobile optimization deferred. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: A future authorized UI owner rebuilds and plays at 1366x768, checking routine actions and readable panels; source reading here is not visual proof.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

