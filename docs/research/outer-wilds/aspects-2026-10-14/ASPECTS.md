# Outer Wilds, community New Horizons contracts: aspect backfill

## Corrections

C1: Scope refinement to prior F13: OWML supplies storage, but New Horizons also owns a profile-keyed save.json for custom known signals/frequencies, unread fact IDs, popup receipts and talked-to characters. This is extension data, not the vanilla save format.

C2: The schema and guide expose both loop-local and persistent dialogue mutations. Knowledge-only progression in the shipped adventure must not be generalized into a prohibition on persistent author-defined conditions in community content.

C3: No fresh contradiction found for the prior rumor/explore graph. Vanilla completeness, proprietary parser and normal shipped timing remain outside this public-code read.

Date: 2026-10-14. Lane: bf-public-other. Status: PARTIAL at the whole-game level; all twelve aspects assessed below. Static public evidence only. Source pin: `5611a9ce01f881d8798de5c0342f99ba3cee3e47`.

Shown means a static source/schema read; stated means a guide/FAQ claim; inferred means a transfer proposal. Covered marks the bounded contract described, not every implementation or runtime behavior in that aspect. No install, game launch, build, save access or YAIR implementation. Every YAIR takeaway is a PROPOSAL. Canon-first order, one realm/one prestige milestone and desktop-first direction stay authoritative.

Private reacquisition: [work area](/Users/weiwei/.codex/research/bf-public-other/), [hash ledger](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt), [source index](/Users/weiwei/.codex/research/bf-public-other/extract/source_inventory.json), [page captures](/Users/weiwei/.codex/research/bf-public-other/extract/pages.json). No raw source, dialogue or page dumps in this folder. Old Mac private extracts were not used.

## A01 Dialogue and conversation

Status: **covered**.

Shown/stated in the community contract: XML DialogueTree has NameField and named nodes, pages, entry conditions, randomized alternatives, fact reveals, loop-local and persistent setters, targets and option lists. Options can require/cancel loop conditions, persistent conditions or known log facts. The builder merges options for matching node names, adds new nodes, and patches reused option lists on a later update. Signs and recordings change the prompt by NameField. No vanilla full dialogue corpus or relationship weights were acquired.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/dialogue_schema.xsd), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/dialogue.mdx), [source 3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Namespace conversation IDs, distinguish condition lifetimes and bind fact grants to reached nodes. Existing speech must not be replaced by an additive topic patch.

## A02 Narrative delivery

Status: **covered**.

Shown: text_schema.xsd describes parent-linked TextBlocks and fact reveals requiring particular read block IDs. shiplog_schema.xsd separately describes entries, rumor/source edges and exploration facts. The reader structure and log summary are separate content owners. Full original narrative wording, every clue and DLC reels are unread.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/text_schema.xsd), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Record which text blocks support a reading. A discovered thread may preserve an unanswered question without forcing a quest sequence.

## A03 Implementation architecture

Status: **covered**.

Shown: Main extends OWML ModBehaviour, uses Unity components, Harmony patches, scene load/unload hooks and delayed work. Config modules describe bodies/props/systems. ConditionalsManager listens to dialogue/persistent/log events and batches checks in LateUpdate, disabling itself when idle. This is community extension architecture over external game types; the proprietary engine loop is not visible.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Main.cs), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Components/Conditionals/ConditionalsManager.cs), [source 3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Queue condition-dependent work until an explicit settlement boundary. Avoid recursively mutating shared state during event publication.

## A04 Save and persistence

Status: **partial**.

Shown: NewHorizonsData owns save.json with a Profiles dictionary keyed by the active game profile; fallback naming handles unavailable profile lookup. It stores custom signals/frequencies, unread fact IDs, popup receipts and characters talked to. A SaveCurrentGame postfix writes extension state; ResetGame resets it. Load failure creates a fresh extension file, and save exceptions log errors. No schema version, atomic publication, backup recovery or vanilla save format was established.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/External/NewHorizonsData.cs), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Patches/PlayerPatches/PlayerDataPatches.cs).

PROPOSAL, owner [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md): Keep extension data bound to profile identity. Preserve unread/rejected data on load failure and declare compatibility rather than silently replacing it.

## A05 AI and NPC behavior

Status: **partial**.

Shown: DialogueBuilder can create attention points, remote triggers and player-tracking zones for authored speakers; a persistent condition can prevent creating a conversation. This does not prove an NPC planner, social utility simulation or the DLC pursuer decision system. Those game AI internals are unread.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): A remote interruption needs a valid contact channel and current condition. Attention behavior is presentation, not autonomous motivation.

## A06 UI and information design

Status: **partial**.

Shown: log entries expose rumor names, photos and coverage-suppression controls; dialogue distinguishes talk/read/record prompts. The community builder inserts extra options before existing end/menu choices. Navigation, keyboard/controller behavior, accessibility and full-screen layout were not tested.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs), [source 3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/dialogue.mdx).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): At desktop target 1366x768/1920x1080, keep known leads and selected evidence visible together; distinguish unread text from unexplored content. Mobile is deferred.

## A07 Content authoring and modding

Status: **covered**.

Shown/stated: JSON planet props reference XML dialogue; eight schema files cover JSON and XML contracts. Matching named nodes merge option lists, not arbitrary existing prose/effects; new nodes require reachable links. Unique prefixes reduce cross-mod name clashes. Guide says reused option lists need two frames before entering when loaded from code. This is an author guide, not fresh timing proof.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/dialogue.mdx), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs), [source 3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/dialogue_schema.xsd).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Validate dangling targets, duplicate IDs and namespace clashes before publishing a content pack. Model additive topics separately from overrides.

## A08 Balance and numbers

Status: **partial**.

Shown: schema configs carry numeric limits/defaults; RevealBuilder uses a default observation distance of 2 when maxDistance is -1 and checks angle/collider semantics. ConditionalsManager caps consecutive reactive passes at 120. These are community settings, not a complete vanilla hazard/RNG balance audit. No XP curve, pity or big-number system is established.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/ShipLog/RevealBuilder.cs), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Components/Conditionals/ConditionalsManager.cs).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Use concrete observation distance and channel limits. A recursion guard must report unresolved state rather than grant a reward.

## A09 Time and scheduling

Status: **partial**.

Shown: the community TimeLoopController reacts to TriggerSupernova, checks the time-loop-enabled flag and kills after its own 50-second delay. This code is a mod controller, not evidence replacing the shipped 22-minute loop. System config can enable/disable the loop. No offline catch-up or entire dynamic solar-system timing read.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Components/TimeLoopController.cs), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/star_system_schema.json).

PROPOSAL, owner [TIMELINES_AND_DIVERGENCE.md](../../../TIMELINES_AND_DIVERGENCE.md): World-local loop settings and post-event grace are separate parameters. Knowledge of timing should inform a route, not auto-complete it.

## A10 Onboarding and reveal

Status: **covered**.

Shown: EntryCondition includes a default entry; RequiredLogCondition makes learned facts unlock topics. shiplog separates rumor labels, direct facts and more-to-explore suppression. This supports staged authoring without a universal XP gate. Base-game tutorial sequence and player playtest results remain unread in this pass.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/dialogue_schema.xsd), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Let a clue expose a question and a new conversation topic. Reaching a log flag must not bypass physical requirements of the answer.

## A11 Little touches

Status: **covered**.

Shown: signs/recordings get distinct prompts; conversation tracking uses attention points; AddToExistingDialogue prepends options to keep the existing exit at the end. NewHorizonsData deduplicates one-time popup IDs and treats missing profile data as already read to avoid spam. These are inspected community behaviors, not full vanilla QoL claims.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/dialogue.mdx), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/Props/DialogueBuilder.cs), [source 3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/External/NewHorizonsData.cs).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): Keep exit actions easy to find and separate notification acknowledgement from permanent knowledge.

## A12 Other systems

Status: **partial**.

Shown/indexed: custom signals/frequencies, profile-scoped popup history, talked-to-character achievements, cross-system warp/entry controls, translation, quantum props, dream-world props and dynamic volumes. Only custom data and condition/reveal interactions were read in depth. No exhaustive vanilla systems or DLC corpus claimed.

Sources: [source 1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/External/NewHorizonsData.cs), [source 2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/star_system_schema.json), [source 3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Main.cs).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Separate a learned signal, a contact route and a usable destination. Additional worlds should state their allowed outside-item and clock policies.

## Remaining precision

Vanilla source/save format/parser/AI, full dialogue and DLC text, exact completeness algorithm, full dynamic timing and runtime UI remain unread. Community contracts do not stand in for proprietary behavior.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems](DEEPER_SYSTEMS.md), [ranked report](REPORT.md), [tooling and rerun](TOOLING.md). Grouped status is [the lane checkpoint](../../majoras-mask/aspects-2026-10-14/CHECKPOINT.md).
