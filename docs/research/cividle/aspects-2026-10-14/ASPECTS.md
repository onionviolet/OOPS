# cividle: aspect backfill, 2026-10-14

## Corrections

No contradiction of the prior bounded core-loop findings was found at the identical revision. Qualify F15: the deserializer computes expected/actual checksum metadata and returns the parsed save; rejection depends on callers. Legacy transport fields explicitly bypass mismatch comparison. A checksum is not authentication. In-flight goods are refunded into a cloned save, not settled in the live city by serialization.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: absent.

No authored NPC conversation graph found in inspected definition/logic families. Shown: ChatPanel is player multiplayer communication, and tutorial steps are instruction records. A player chat history is not NPC dialogue or relationship AI. This scoped absence does not certify every network feature.

Sources: [ChatPanel.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/ChatPanel.tsx); [Tutorial.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/logic/Tutorial.ts); [definitions](https://github.com/fishpondstudio/CivIdle/tree/e15fe039ed5c0794df05e52258bc9663761a140a/shared/definitions)

PROPOSAL: Keep multiplayer-like notices separate from an NPC conversation record. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: partial.

Shown: named historic people/cities, tutorial milestones, patch notes and rebirth history frame civilization progress. No story campaign journal was found in inspected core; all wonder flavor/localization remains unread.

Sources: [PatchNotes.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/definitions/PatchNotes.ts); [Tutorial.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/logic/Tutorial.ts); [RebirthConfirm.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/RebirthConfirm.tsx)

PROPOSAL: Use a dated local achievement record without inventing witnessed scenes. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A03 Implementation architecture

Status: covered.

Shown: shared TypeScript definitions/logic, React client UI, Pixi render utilities and RPC/server surfaces. Tick caches/multipliers are rebuilt; transient transport/source caches differ from saved city/meta. Author data mixes registries and closures. Server implementation is inventory-only.

Sources: [package.json](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/package.json); [Update.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/Update.ts); [TickLogic.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/TickLogic.ts); [ClientUpdate.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/logic/ClientUpdate.tsx)

PROPOSAL: Derive visible bonuses from named sources in the existing simulation. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A04 Save and persistence

Status: covered.

Shown: JSON Map/Set replacer/reviver, city/options split, cloned transit refunds and wyhash metadata. Deserialize calculates checksum without throwing on mismatch and exempts two legacy transport shapes. MigrateSavedGame repairs shapes and uses flags for some one-time repairs. BrowserStorage wraps IndexedDB transactions. Global queues writes and selects Steam compressed file, mobile preferences or browser IndexedDB; local load returns parsed state or null on failure. Complete RPC checksum handling/corruption recovery remains partial.

Sources: [GameStateLogic.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/GameStateLogic.ts); [MigrateSavedGame.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/MigrateSavedGame.ts); [BrowserStorage.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/utilities/BrowserStorage.ts); [Global.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/Global.tsx); [SaveCorruptedPage.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/SaveCorruptedPage.tsx)

PROPOSAL: Declare transit snapshot policy and review checksum mismatch behavior at every loader. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Shown: deterministic source planning and priority production, not individual NPC planners. Sources are indexed by material, distance and current storage order. Multiplayer/server and conquest behavior remain unread.

Sources: [TransportSourcePlanner.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/TransportSourcePlanner.ts); [Update.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/Update.ts)

PROPOSAL: An institutional production queue can use explicit priorities without claiming autonomous worker lives. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: covered.

Shown: tile/city panels, research/rebirth pages, resource/storage views, progress/tutorial modals and chat windows. Selection-dependent pages differ from global flow totals. Actual desktop rendering/accessibility remains untested.

Sources: [ui](https://github.com/fishpondstudio/CivIdle/tree/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui); [BuildingStorageComponent.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/BuildingStorageComponent.tsx); [TutorialModal.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/TutorialModal.tsx)

PROPOSAL: At 1440x900, keep local work and city totals in separate useful panels. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: covered.

Shown: TypeScript registries mix data with callbacks; startup asserts enforce recipe/unlock consistency, while a fixpoint derives tier/prices. No public mod load-order API established.

Sources: [BuildingDefinitions.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/definitions/BuildingDefinitions.ts); [CalculateTierAndPrice.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/CalculateTierAndPrice.ts); [Config.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/Config.ts)

PROPOSAL: Add author-time recipe reachability checks to the technology owner if selected. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A08 Balance and numbers

Status: partial.

Shown: input-value price propagation, exponential tech/level costs, harmonic in-run people and permanent-copy level costs. These are balancing rules, not measured wait times. Happiness and all wonder interactions remain unread.

Sources: [CalculateTierAndPrice.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/CalculateTierAndPrice.ts); [RebirthLogic.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/RebirthLogic.ts); [TechLogic.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/TechLogic.ts)

PROPOSAL: Expose marginal cost and source-labelled diminishing bonuses. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A09 Time and scheduling

Status: covered.

Shown: absence time is bounded across server/client timestamps; selected share is normal-tick replay and rest is Warp reserve. Planner reset clears current tick sources, while distance caches have separate invalidation. Exact all invalidation callers remain partial.

Sources: [Bootstrap.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/Bootstrap.tsx); [RPCClient.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/rpc/RPCClient.tsx); [TransportSourcePlanner.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/TransportSourcePlanner.ts)

PROPOSAL: Keep absence policy and cache freshness separate; no YAIR offline policy change follows. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: covered.

Shown: tutorial entries bind text/video/DOM selector to a current/target predicate. Research unlocks controls such as priority and stockpiling. UI tips are driven by actual progress, not a timer alone.

Sources: [Tutorial.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/logic/Tutorial.ts); [FeatureLogic.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/FeatureLogic.ts)

PROPOSAL: Tie instruction completion to an actual action result. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: covered.

Shown: corruption page, tutorial videos, tracked source flags on bonuses and single ordered stall reason. Playback, localization and accessibility behavior are unrun.

Sources: [SaveCorruptedPage.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/SaveCorruptedPage.tsx); [Tutorial.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/logic/Tutorial.ts); [TickLogic.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/logic/TickLogic.ts)

PROPOSAL: Show the source of a multiplier and distinguish work stopped from work disabled. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Shown inventory: cities, wonders, traditions/religions, Great People, Age Wisdom, market/RPC/chat and achievement surfaces. Only selected city/meta paths were previously covered. Full trading, upgrades, conquest and server validation remain unread.

Sources: [CityDefinitions.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/definitions/CityDefinitions.ts); [UpgradeDefinitions.ts](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/shared/definitions/UpgradeDefinitions.ts); [ChatPanel.tsx](https://github.com/fishpondstudio/CivIdle/blob/e15fe039ed5c0794df05e52258bc9663761a140a/src/scripts/ui/ChatPanel.tsx)

PROPOSAL: Treat a local institution and its durable rewards as distinct from city reset state. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## Remaining scope

Server/RPC save rejection joins, network trade/conquest, all wonder/upgrade/happiness effects and transport invalidation callers remain unread. No install adds static evidence.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
