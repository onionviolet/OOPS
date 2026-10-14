# NetHack: implementation proposals, 2026-10-14

All packets are PROPOSALS, not accepted design or implementation. They reuse current systems, require a fresh owner/readiness check and permit repeated reasonable solo-player access. No cross-file ownership or runtime write is granted here. Compatibility decisions belong to a future implementation owner.

## PN1: Explain one useful conversation refusal

Source: NetHack, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/data/dialogues.js; src/components/dialogue_component.js; src/models/dialogue_action.js`.

Behavior: Use an existing actor/action and its real eligibility to select a short reason and an earned alternate reply. Keep every reasonable route reachable after its condition changes. Medium scope; no general dialogue engine.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Preview twice without mutation, commit an eligible exchange once, recheck a lost prerequisite, and retain the exact outcome after save/reload/import.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PN2: Preserve a short recap beside full quest text

Source: NetHack, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/simulation_ui.js; existing Notebook/event content owner`.

Behavior: Attach an authored synopsis to an existing committed milestone, separately from its full passage. Show it in a desktop history panel; reading itself gives no new reward. Low to medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Earn the milestone, close/reopen text and reload; one correct recap remains and no duplicate material reward occurs.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PN3: Keep timer subject and area together

Source: NetHack, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/simulation.js; src/simulation_contracts.js`.

Behavior: Give one existing delayed actor/material job an explicit saved subject and area scope, only if current schema lacks it. Missing or moved subjects pause/refuse instead of silently settling elsewhere. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Save pending work, leave its area, reload and import; settle exactly once at the declared owner or show a stable reason for pause.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PN4: Protect the old artifact on rejected restore

Source: NetHack, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/save_compatibility.js; src/native_storage_transaction.js`.

Behavior: Audit existing candidate publication before changing it. Extend only a concrete uncovered failure: malformed candidate, unknown schema or unresolved actor links. Do not copy NetHack's destructive restore edge.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: A rejected candidate changes neither current state nor last-good save; valid generated save/reload/literal Import retain all relevant identities.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

## PN5: Retain participation beside a voluntary conduct result

Source: NetHack, pinned in [TOOLING](TOOLING.md); evidence in [ASPECTS](ASPECTS.md).

Owner system: `src/nethack_fieldcraft_feats.js; src/frontier_campaign.js`.

Behavior: Reuse current feat receipts for one eligible repeatable activity with not-entered, active, met, broken and withdrawn distinctions. Do not re-add the now-present vial label view or impose a fixed solo-player attempt limit. Medium scope.

Cost and failure: use existing resource, actor-consent, access, clock and storage checks; a preview/refusal must not spend, grant progress or publish a receipt. Do not build a parallel engine.

Persistence: Future owner must reread current state and choose saved-field defaults/migration before implementation. Existing run state must not be retroactively enrolled.

Later observable acceptance: Unentered preview earns nothing; a committed violation affects only that attempt; a later eligible attempt can close successfully and persists exactly.

Exclusions: no copied code/text/assets, global engine rewrite, mobile optimization, forced hunger/death, new prestige or automatic adoption of other inventory families. Source-only checks here do not satisfy that later gate.

