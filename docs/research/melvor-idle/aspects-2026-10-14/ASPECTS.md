# melvor-idle: aspect backfill, 2026-10-14

## Corrections

No fresh executable contradiction is claimed. Prior hosted v1.3.1/script12097/data528 remains historical evidence, not a current client pin. Fresh official declarations match the prior typing hash but cannot re-prove hosted implementation order, Township wave behavior or death/resource exceptions. The hosted page failed, alternate public page and wiki API returned 403, so route switched to official declaration source without further retry variants.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: partial.

Stated by declarations: lore books and tutorial descriptions exist. No conversation tree, speaker/portrait/relationship schema established here; combat event narration bodies inaccessible. Do not mark dialogue absent merely because the API lacks one class. Exact text IDs/conditions remain unread.

Sources: [lore.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/lore.d.ts); [combatManager.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/combatManager.d.ts); [tutorialIsland.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/tutorialIsland.d.ts)

PROPOSAL: Keep a gated known-lore shelf and a separate conversation owner. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: partial.

Stated: LoreBook has title/media/unlockRequirements; Lore registers books, updates unlocks and reads lore. This is a requirement-gated lore interface, not proof of current story paragraphs or call order.

Sources: [lore.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/lore.d.ts); [requirements.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/requirements.d.ts)

PROPOSAL: Recheck actual known requirements when presenting a readable document. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A03 Implementation architecture

Status: partial.

Stated: Game implements Serializable/EncodableObject and an event emitter, namespaced registries, data package registration, passive tickers, online/offline loop and render queues. Custom elements appear throughout declarations. Current executable initialization, engine/dependency versions and performance behavior unread.

Sources: [game.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/game.d.ts); [gameEvents.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/gameEvents.d.ts); [namespaceRegistry.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/namespaceRegistry.d.ts)

PROPOSAL: Reuse stable IDs and the common publisher; declarations are an interface reference only. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A04 Save and persistence

Status: partial.

Stated: SaveWriter extends BinaryWriter and has a header, numeric/string namespace ID maps, version-returning decoder, namespaced object lookup and old-format compatibility methods. SaveGameHeader includes version/character/mode/offline action/timestamp; import returns Promise<boolean>. Unknown namespace lookup can return an ID string. Current bytes/compression/corruption handling/autosave ordering and migrations require executable bodies.

Sources: [saveWriter.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/saveWriter.d.ts); [save.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/save.d.ts); [game.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/game.d.ts)

PROPOSAL: Preserve unresolved content identity and show import metadata before replacement. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Stated: monster/character/combat state interfaces and timed actions. They do not establish autonomous NPC lives or current enemy decision order. Every body/AI policy unread.

Sources: [monsters.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/monsters.d.ts); [character.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/character.d.ts); [combatManager.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/combatManager.d.ts)

PROPOSAL: Keep enemy combat controller claims separate from world NPC simulation. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: partial.

Stated: character select and offline progress elements expose snapshots and result messages. Many menu classes are custom HTML elements. Current DOM/CSS/layout and keyboard use unread.

Sources: [game.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/game.d.ts); [game.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/game.d.ts); [characterSelectMenus.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/characterSelectMenus.d.ts)

PROPOSAL: At 1440x900, use separate action, support and actual settlement views if selected. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: partial.

Stated: namespace registries, package APIs and mod context surfaces. Actual dependency order, overlap warnings, patch blacklists and mod storage behavior only have older dossier evidence; they were not reverified by signatures.

Sources: [mod.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/mod.d.ts); [namespaceRegistry.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/namespaceRegistry.d.ts); [game.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/game.d.ts)

PROPOSAL: Validate references and missing content without creating a second inventory/publisher. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A08 Balance and numbers

Status: partial.

Stated: mastery/skill/modifier/formula interfaces. Exact current balance formulas, RNG/pity and production payment ordering inaccessible. Prior values must be refreshed if a packet selects them.

Sources: [skill.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/skill.d.ts); [modifiers.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/modifiers.d.ts); [utils.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/utils.d.ts)

PROPOSAL: Keep recipe mastery and currently supported modifiers distinct. Owner: docs/worlds/ABILITY_AUTHORING.md.

## A09 Time and scheduling

Status: partial.

Stated: TICK_INTERVAL is 50 ms; MAX_OFFLINE_TIME is 86400000 ms in declarations. Online/offline loops, timers and snapshots are explicit interfaces. Actual 24-hour processing and error/stop/death order require bodies; constants alone do not prove behavior.

Sources: [game.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/game.d.ts); [combatManager.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/combatManager.d.ts)

PROPOSAL: Separate declared cap from proven offline settlement. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: partial.

Stated: TutorialTask uses event matching/counts; TutorialStage is namespaced/encodable and has requirements/tasks/rewards. Menus display stages/progress. Full authored stages, skip rules and reward transaction order unread.

Sources: [tutorialIsland.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/tutorialIsland.d.ts); [tutorialMenus.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/tutorialMenus.d.ts)

PROPOSAL: Tie tutorial completion to native action events and save its stage identity. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: partial.

Stated: notification/menu/lore unlock display APIs exist. They are useful authoring references but exact visual feedback, sound/accessibility and current controls unread.

Sources: [notifications.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/notifications.d.ts); [lore.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/lore.d.ts); [characterSelectMenus.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/characterSelectMenus.d.ts)

PROPOSAL: Name actual gained/lost resources and failed capacity in a settlement view. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Stated inventory includes Cartography/Archaeology, Corruption/Harvesting, Township, summoning, mastery, skill trees, relics and combat. Declaration presence is not DLC entitlement, an installed edition or accessible current player content. Full body/data packages unread.

Sources: [cartography.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/cartography.d.ts); [corruption.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/corruption.d.ts); [harvesting.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/harvesting.d.ts); [township.d.ts](https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/township.d.ts)

PROPOSAL: Keep discovered, owned, equipped and supported means distinct when extending a local system. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## Remaining scope

Current executable build and all public data/text bodies unavailable through attempted routes. Official typing interfaces freshly read; prior executable findings retained as historical only. Runtime, DLC ownership and installation remain untouched. No install justified: it would not guarantee the remote hosted code becomes available.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
