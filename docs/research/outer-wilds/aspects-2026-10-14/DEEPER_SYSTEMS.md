# Outer Wilds, community New Horizons contracts: deeper systems

Ranked by payoff for original YAIR work. Prior-documentation status is local to the previous game dossier; no exhaustive search of all other live lanes is claimed. Source inspection does not establish behavior in a running build.

## D1 Additive conversation composition

Coverage: New, prior lane centered on ship log. Locator: `DialogueBuilder.cs:80-239; dialogue_schema.xsd; dialogue.mdx`. [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs).

The builder indexes existing nodes by Name. A patch with an existing name merges only its DialogueOptionsList; an unmatched name appends a node. Added choices go at the start so the existing exit remains last. A later pass replaces ReuseDialogueOptionsListFrom and reports invalid nested reuse. That is a narrow composition rule, not general semantic merging. YAIR original authoring should validate reachability, namespace collisions and option order, and preserve effect ownership when attaching a new topic.

PROPOSAL owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.

## D2 Profile extension persistence

Coverage: New, prior lane read OWML storage. Locator: `NewHorizonsData.cs; PlayerDataPatches.cs`. [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/External/NewHorizonsData.cs).

Custom signal knowledge, unread fact IDs, popup receipts and talked-to-character records are partitioned by game-profile name. Vanilla SaveCurrentGame and ResetGame hooks synchronize this sidecar. An exception during load creates a replacement extension file; no version field or proven atomic write is visible here. This is useful as a negative acceptance case: a missing profile or damaged extension must not accidentally attach another life's discovery or silently erase rejected bytes. Vanilla persistent dialogue conditions still belong to PlayerData, not this sidecar.

PROPOSAL owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.

## D3 Reactive conditionals

Coverage: New subsystem beyond prior reveal builder. Locator: `ConditionalsManager.cs; ConditionalsHandler.cs`. [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Components/Conditionals/ConditionalsManager.cs).

Four event families schedule evaluation at the end of a frame, because recursive GlobalMessenger dispatch is unsafe. Checks combine all/any loop conditions, persistent conditions and facts, then optionally invert. Effects set/unset flags and reveal facts while comparing current values to reduce repeated writes. Consecutive reactive passes are capped at 120 and logged. This is reactive authored content, not NPC intelligence. A YAIR queue should settle causal effects before publishing views, detect conflicting rules and preserve pending work when it reaches a budget.

PROPOSAL owner: `docs/worlds/CAMPAIGN_FRAMEWORK.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.
