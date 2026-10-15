# Rogue Legacy 1 released FNA source: aspect backfill

## Corrections

C1: No fresh contradiction to the prior five-path findings. Fresh reads retain the ShieldKnight contact-guard qualification: PlayerObj is required by the final conjunction, so the nested projectile block does not prove general projectile immunity.

C2: Extension of prior persistence limits: the manager uses five binary domains and optional trailing DLC data, with backup/error dialogs. A revision number exists but the checked code does not establish a general migration dispatcher or atomic all-domain commit.

C3: Fresh read corrects an initial backfill assumption: localized text IS supplied in eight .resx files, although art/music/contentproj are absent. The raw grep found 108 m_dialogDict.Add occurrences, including non-registration/debug material. Initialize contains 106 concrete registrations, 329 aligned speaker/text slots. LevelEV declares 25 journal entries. Full localized tables and the registration index are retained privately.

C4: README points to the original RogueCastleEditor and warns that it is no longer compatible with the latest game. The editor was not cloned or run; it is a future static route, not a reason to install.

Date: 2026-10-14. Lane: bf-public-other. Status: PARTIAL at the whole-game level; all twelve aspects assessed below. Static public evidence only. Source pin: `b41c17888a91100bbf8f1febecaa636a1b421f5b`.

Shown means a static source/schema read; stated means a guide/FAQ claim; inferred means a transfer proposal. Covered marks the bounded contract described, not every implementation or runtime behavior in that aspect. No install, game launch, build, save access or YAIR implementation. Every YAIR takeaway is a PROPOSAL. Canon-first order, one realm/one prestige milestone and desktop-first direction stay authoritative.

Private reacquisition: [work area](/Users/weiwei/.codex/research/bf-public-other/), [hash ledger](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt), [source index](/Users/weiwei/.codex/research/bf-public-other/extract/source_inventory.json), [page captures](/Users/weiwei/.codex/research/bf-public-other/extract/pages.json). No raw source, dialogue or page dumps in this folder. Old Mac private extracts were not used.

Full eight-locale text: [private tables](/Users/weiwei/.codex/research/bf-public-other/extract/rogue-legacy-localized-text.json); [dialogue IDs and speaker/page mapping](/Users/weiwei/.codex/research/bf-public-other/extract/rogue-legacy-dialogue-index.json). All code callers/conditions remain in the pinned private clone; no claim of a full decoded gate census.

## A01 Dialogue and conversation

Status: **covered**.

Shown: DialogueManager.Initialize contains 106 concrete dictionary registrations with 329 aligned speaker/text slots, mostly LOC_ID identifiers; raw grep overcounts commented/debug examples. DialogueObj checks speaker/page array length. DialogueScreen localizes/formats pages, offers a two-choice panel and invokes reflection-based confirm/cancel callbacks, clearing stale callbacks on setup. Eight .resx resource tables are present, with 1,619 base entries and 242-484 LOC_ID_TEXT keys per locale. LocaleBuilder can choose _F variants and fall back to the base key; English/Chinese or forced-male calls use base keys. Gates/effects live in callers, not a general relationship graph.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/DialogueManager.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/DialogueObj.cs), [source 3](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DialogueScreen.cs), [source 4](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/LocaleBuilder.cs), [source 5](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/Resources/LocStrings.resx).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Keep page content, service eligibility and confirm/cancel effects separate. Resolve a callback at authoring time and reject a missing effect target.

## A02 Narrative delivery

Status: **covered**.

Shown: DiaryRoomObj selects the current DiaryEntry index when an unfinished room is entered. Interacting in range while grounded and not attacking opens the named entry, increments the player journal index and marks the room completed; later interaction opens the diary browser. LevelEV declares 25 journal entries. DialogueScreen forces male localization for DiaryEntry keys. Localized narrative text is present in .resx tables and retained privately; full semantic review of all locales is unread.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/RoomObjs/Bonus%20Rooms/DiaryRoomObj.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DiaryEntryScreen.cs), [source 3](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/DialogueManager.cs).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Discovering a record and rereading it are distinct actions. Persist the record receipt, then make rereading free of duplicate rewards.

## A03 Implementation architecture

Status: **covered**.

Shown/stated: C# FNA build, DS2DEngine object/physics/screen families and Tween updates. Game.Update delegates to ScreenManager with GameTime; screen and room classes own much gameplay. Definitions combine code constants, builders and absent content assets. README excludes game assets/contentproj. No asset-complete build or runtime profiling occurred.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/README.md).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Use one authoritative action/effect owner despite screen-specific presentation. Do not make a view method an invisible transaction boundary.

## A04 Save and persistence

Status: **covered**.

Shown: SaveGameManager writes PlayerData, UpgradeData, Map, MapData and Lineage using BinaryWriter under profile paths. Separate backup files use AutoSave_ names. Player data includes a revision integer in trailing fields; readers probe for additional DLC sections. Load failure offers backup recovery or exit, with map errors delegated to loading-screen handling. SaveFiles catches errors and delays a warning until repeated failures. No atomic multi-file commit, complete migration framework or offline progress is established.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/SaveGameManager.cs).

PROPOSAL, owner [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md): Use a coherent epoch across save domains and surface a failed save promptly. Recovery must validate all related domains before replacing the live state.

## A05 AI and NPC behavior

Status: **covered**.

Shown: ShieldKnight selects stop/walk/turn logic based on difficulty, engagement state and current target position/heading. CollisionResponse combines facing, immunity counters and PlayerObj sprite state. This is authored combat behavior, not a social planner or simulated aging. The prior projectile qualification remains necessary.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/EnemyObjs/EnemyObj_ShieldKnight.cs).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): A guard should use actual attack provenance and facing. Do not infer protections from a comment or a branch that cannot satisfy its outer guard.

## A06 UI and information design

Status: **partial**.

Shown: dialogue has local speaker/page arrays, continue versus end icons, wrapping and mapped confirm/cancel navigation. DiaryEntryScreen builds a five-column entry grid. Retail screen readability, localization overflow, controller timing and accessibility remain unexercised; code coordinates are not desktop acceptance.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DialogueScreen.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DiaryEntryScreen.cs).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): At 1366x768/1920x1080 show the owned record list and selected text together. Keep costs and the confirm/cancel result visible; mobile is deferred.

## A07 Content authoring and modding

Status: **partial**.

Shown/stated: new dialogue is registered in C# dictionaries with LOC_ID keys backed by eight .resx tables. DialogueObj validates aligned arrays; effect targets use reflection. README links the original RogueCastleEditor but warns of incompatibility with the latest game. It was not cloned/run. An official stable mod API/load order was not established. Released source has a custom noncommercial license; absent art/music remain proprietary.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/DialogueManager.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/DialogueObj.cs), [source 3](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DialogueScreen.cs), [source 4](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/LICENSE.md), [source 5](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/README.md).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Validate content IDs, aligned speakers/pages and callback targets before loading a pack. Source availability does not supply missing assets or their reuse rights.

## A08 Balance and numbers

Status: **covered**.

Shown: SkillObj.TotalCost equals base plus current skill level times appreciation plus global cost increase times PlayerStats.CurrentLevel; GameEV sets global increase to 10. Trait generation reuses one RandomInt(0,100) roll against strict thresholds 94 then 55, with maximum two traits. Prior inclusive helper semantics support 55/101 two, 39/101 one and 7/101 none. No current gameplay sample or general pity system was verified.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/SkillObj.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Types/TraitType.cs), [source 3](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/DS2DEngine/src/CDGMath.cs).

PROPOSAL, owner [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md): Preview both local and cross-upgrade price effects. Freeze earned offers and preserve their RNG outcome across save/reload.

## A09 Time and scheduling

Status: **partial**.

Shown: GameTime drives screen/tween updates; room interactions are frame-driven and combat logic uses state/cooldowns. Lineage portrait ages in the prior source trace are generated presentation fields, not an elapsed life calendar. Offline catch-up, all pause exceptions and every fairy timer remain unread in this pass.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/RoomObjs/Bonus%20Rooms/DiaryRoomObj.cs).

PROPOSAL, owner [TIMELINES_AND_DIVERGENCE.md](../../../TIMELINES_AND_DIVERGENCE.md): Give combat time, elapsed life and world calendar separate meanings. A portrait age must not silently create NPC simulation history.

## A10 Onboarding and reveal

Status: **partial**.

Shown: dictionary keys distinguish first meetings from later architect/toll states; diary and service UI reveal information after interactions. The prior manor trace links purchase levels to adjacent unlocks. Complete tutorial sequencing, every class/service introduction and the authored instruction prose are unread.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/DialogueManager.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/RoomObjs/Bonus%20Rooms/DiaryRoomObj.cs).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Reveal a service through a current introduction, then show known eligibility without exposing the entire hidden catalog.

## A11 Little touches

Status: **covered**.

Shown: continue/end icons differ; typewriting can be completed before advancing; cancel and confirm invoke different handlers; dialogue setup clears stale format/callback state. Dyslexia traits alter displayed choices and dialogue. This is a source mechanic, not an accessibility template to copy. Use optional presentation settings in original YAIR work.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DialogueScreen.cs).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): A fast-forward press should finish text before choosing. Preserve clear choice intent and avoid accidental stale callback execution.

## A12 Other systems

Status: **partial**.

Shown/indexed: manor upgrades, frozen lineage candidates, gear/runes/spells, procedural rooms, fairy objectives, bosses, carnival minigames, achievements, death/revive and challenge rooms. Prior dossier deeply covered five connected paths; this pass adds dialogue/journal/save architecture. Not every class, room template or enemy is read, and assets are absent.

Sources: [source 1](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/DialogueManager.cs), [source 2](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/SaveGameManager.cs), [source 3](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/README.md).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Discovering, purchasing and equipping are separate transactions. Keep original optional challenges useful without introducing another prestige layer.

## Remaining precision

Art/music/contentproj, full semantic review of the eight present localization tables, complete source semantics, every room/class/enemy, retail behavior, full pause/timer gates and atomic recovery remain unread or unverified.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems](DEEPER_SYSTEMS.md), [ranked report](REPORT.md), [tooling and rerun](TOOLING.md). Grouped status is [the lane checkpoint](../../majoras-mask/aspects-2026-10-14/CHECKPOINT.md).
