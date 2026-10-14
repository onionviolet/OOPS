# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: implementation proposals, 2026-10-14

All packets are PROPOSALS, not accepted design or implementation. They reuse current systems, require a fresh owner/readiness check and permit repeated reasonable solo-player access. No cross-file ownership or runtime write is granted here. Compatibility decisions belong to a future implementation owner.

## PC1: Make recurring companion barks quieter and evidence based

Source: Dungeon Crawl Stone Soup, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/simulation_ui.js; actor observation owner`.

Behavior: Choose barks from actual actor state and observed facts, with lower frequency for long-lived companions. Keep random flavor separate from material outcomes. Low scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Visible and unheard variants expose only allowed facts; opening/replaying the log leaves the next simulation draw unchanged.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PD1: Make a failed dialogue option useful information

Source: Cataclysm: Dark Days Ahead, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/data/dialogues.js; src/components/dialogue_component.js`.

Behavior: For one existing earned exchange, show why the option is unavailable and one reasonable way to meet it. Separate preview from commit and retain ordinary exits. Low to medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Condition changes update the reply; repeated preview grants no reward/opinion; commit rechecks current means and saves the outcome.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PC2: Build a useful chronicle from actual receipts

Source: Dungeon Crawl Stone Soup, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/simulation_ui.js; src/frontier_campaign.js`.

Behavior: Filter already-recorded actions into a concise earned chronology with cause, route and outcome. Keep mundane repeat events in history without crowding milestones. Low to medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: A failed preview yields no feat; a settled result appears once, survives reload/import and remains linked to its cause.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PD2: Persist one delayed world event with its actor context

Source: Cataclysm: Dark Days Ahead, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/simulation.js; src/simulation_contracts.js`.

Behavior: Use an existing event consumer and declare skip/coalesce/replay policy. Save due time, subject and context; prevent global work from repeating once per NPC. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Compare split and long steps, then reload/import pending work; outcome follows the declared missed-period policy once.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PC3: Stop a paid plan at a useful function

Source: Dungeon Crawl Stone Soup, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/feature_expansion_work_plan.js; src/feature_expansion_powers.js`.

Behavior: Extend existing work plans with one authored earned-function target. Reuse mastery; pause on lost tools, source or funding. Medium scope, with no new broad XP engine.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Funded real work reaches the function and stops before another reservation; missing funding yields no progress and target state survives reload.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PD3: Preserve dirty state after a failed save

Source: Cataclysm: Dark Days Ahead, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/native_storage_transaction.js; src/save_files.js`.

Behavior: Check existing storage reporting before editing. Add only an uncovered path where failure clears dirty state or announces success. Medium scope because persistence is affected.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Injected storage failure preserves the prior usable artifact, retains unsaved status and produces no success notice; valid save clears it only after publication.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PC4: Give automated work a legible stop reason

Source: Dungeon Crawl Stone Soup, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/feature_expansion_work_plan.js; src/display.js`.

Behavior: Show a named reason when a plan stops for access, tool, result or player-selected milestone. Keep independent laptop detail and history panels. Low scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Every stop has its actual cause and next available action; resumed work spends the declared resources once.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PD4: Distinguish practice from product in the plan view

Source: Cataclysm: Dark Days Ahead, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/feature_expansion_work_plan.js; src/display.js`.

Behavior: Display actual learning goal, tool charges/time and whether a job produces an item. Reuse current crafting/practice owners and functional mastery. Low scope if current data already records the distinction.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: A paid practice action learns through its real consumer, produces no invented item and stops/pauses when its declared goal or blocker occurs.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PC5: Version optional hints separately from earned state

Source: Dungeon Crawl Stone Soup, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/save_compatibility.js; src/simulation_content.js`.

Behavior: If needed, let old explanation cache rebuild without changing actual knowledge, skills or economic receipts. Validate simulation state more strictly. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Unknown hint version does not erase earned capability; unsupported simulation version is rejected while the old artifact stays usable.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PD5: Expose why a resident deferred its work

Source: Cataclysm: Dark Days Ahead, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/feature_expansion_society.js; src/simulation_ui.js`.

Behavior: Project one existing actor's blocked/deferred/finished work status from actual resources, tools, consent and destination. No new utility AI framework. Low to medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Actor lacks a real tool and defers with a reason; another real source satisfies it; work then creates its useful output, with no output on failed polling.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

