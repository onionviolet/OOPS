# Super Robot Wars, title-qualified V and W guide pass: aspect backfill

## Corrections

C1: Prior F1 can suggest survival is generally paid by one mastery counter. Fresh V guide separates event-only deployment survival, character-specific point ledgers, combat participants and broader roster milestones. Kochou survival is stated as an Akito deployment/presence condition, not an SR-point threshold.

C2: Prior route/carry statements are series-level summaries. W cleared-file carry explicitly resets kills, sells parts and does not retain favorite bonuses, while upgrades and some upgrade capacity persist. Do not promote one title's carry rules to the series.

C3: Akurasu is now readable through the public route and revision IDs were captured. That resolves the old acquisition limitation for the selected pages only. Secrets page has internal wording inconsistencies and uncertain Jill notes; these are retained as uncertainties, not repaired by guesswork.

Date: 2026-10-14. Lane: bf-public-other. Status: PARTIAL at the whole-game level; all twelve aspects assessed below. Static public evidence only. Source pin: `No build/source acquired`.

Shown means a static source/schema read; stated means a guide/FAQ claim; inferred means a transfer proposal. Covered marks the bounded contract described, not every implementation or runtime behavior in that aspect. No install, game launch, build, save access or YAIR implementation. Every YAIR takeaway is a PROPOSAL. Canon-first order, one realm/one prestige milestone and desktop-first direction stay authoritative.

Private reacquisition: [work area](/Users/weiwei/.codex/research/bf-public-other/), [hash ledger](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt), [source index](/Users/weiwei/.codex/research/bf-public-other/extract/source_inventory.json), [page captures](/Users/weiwei/.codex/research/bf-public-other/extract/pages.json). No raw source, dialogue or page dumps in this folder. Old Mac private extracts were not used.

## A01 Dialogue and conversation

Status: **partial**.

Stated: V presents dialogue before a tactical scenario and after completion, before intermission. W menus list a Talk/persuade command with enemies. V guide records participant-specific persuasion/combat conditions. No script format, speaker/portrait table, dialogue line IDs, bark pool or full conversation graph was acquired; these are unread because no public internal corpus was located within this guide route.

Sources: [source 1](https://en.wikipedia.org/wiki/Super_Robot_Wars_V), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus), [source 3](https://akurasu.net/wiki/Super_Robot_Wars/V/Secrets).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Keep battle persuasion a current participant action with real consequences. A dramatic exchange is not proof of universal relationship mechanics.

## A02 Narrative delivery

Status: **partial**.

Stated: V flow chart branches by protagonist and later route choices, rejoins numbered scenarios and lists optional SR objectives. Secret scenarios sit outside ordinary stage objectives. Script scheduling/journal recall and exact branching implementation remain unread; the guide is an authored route index, not source code.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/V/Flow_Chart), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/V/Secrets).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Author route split, rejoin and optional outcomes separately. Maintain a causal receipt rather than infer which scenes were seen from stage number alone.

## A03 Implementation architecture

Status: **unread**.

Unread: internal engine modules, scripting interpreter, event bus, data tables and main loop. Public guides show alternating phases and intermission but cannot establish code architecture. No executable/source package acquired, as this lane is public guides only and no install.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus), [source 2](https://en.wikipedia.org/wiki/Super_Robot_Wars_V).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): PROPOSAL: compare phase, story settlement and intermission as design boundaries; do not cite them as an inspected engine architecture.

## A04 Save and persistence

Status: **partial**.

Stated: W offers map-state Save and intermission Save Data. Its cleared-file guide specifies retained upgrades/money, sold parts and reset kill counts. V article mentions PS4/Vita cross-save. Binary format/versioning, autosave timing, migration, offline time and corruption/rejection handling remain unread. Titles and editions are kept separate.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/W/Clear), [source 3](https://en.wikipedia.org/wiki/Super_Robot_Wars_V).

PROPOSAL, owner [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md): Declare tactical resume, completed-arc carry and new-life start as separate persistence contracts. Preserve actor identity instead of turning each into prestige.

## A05 AI and NPC behavior

Status: **partial**.

Stated: W End Phase passes control to the enemy. V flow objectives include retreat HP, movement-to-area and defeat triggers. These document scenario constraints, not an AI planner, targeting weights or off-screen NPC lives. Such algorithms are unread.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/V/Flow_Chart).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): An enemy withdrawal threshold should create a visible tactical opportunity when observed. Do not invent a social AI model from a stage objective.

## A06 UI and information design

Status: **covered**.

Stated in W menu reference: pilot, unit and weapon status are distinct; weapon view lists morale, energy/ammo, range, hit and terrain conditions. Intermission groups pilot training, unit upgrades, assignment, parts, shop and save. System settings include grid, animation toggles and shortcuts. This is guide-level UI evidence, not measured desktop behavior.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): Show actor, equipment and action eligibility together on desktop. Name which resource blocks an attack; retain optional animation without hiding the receipt.

## A07 Content authoring and modding

Status: **unread**.

Unread: official author tools, script files, mod API, pack load order and validation. Akurasu authors maintain route and secret-condition tables, but wiki authoring does not establish game content authoring. No decompile or ROM acquisition.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/V/Flow_Chart), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/V/Secrets).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Use a route-condition table as an original authoring proposal. It still needs a native consumer and validation before it is gameplay.

## A08 Balance and numbers

Status: **partial**.

Stated: V objectives constrain turn counts, use of each attack, participant credit and retreat HP. Secrets add distinct character/group scores and prerequisite combinations. W exposes terrain, morale and resource costs. Full damage/hit formulas, RNG, seeds, difficulty curves, pity and economy scaling remain unread; no formula inferred from guide rows.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/V/Flow_Chart), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/V/Secrets), [source 3](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Record who earned each combat receipt and whether support credit qualifies. Optional mastery must not be a hidden universal morality score.

## A09 Time and scheduling

Status: **partial**.

Stated: player/enemy phases and map turn limits drive optional objectives. W intermission follows battles; V routes use numbered scenarios and ordered participant checks. This is tactical/story progression, not a verified age calendar or offline system. Exact event priority when several triggers coincide is unread.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/V/Flow_Chart), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus).

PROPOSAL, owner [TIMELINES_AND_DIVERGENCE.md](../../../TIMELINES_AND_DIVERGENCE.md): Use explicit deadline and settlement order for campaign events. Turn count and lived calendar time should not be merged without a world rule.

## A10 Onboarding and reveal

Status: **partial**.

Stated: V has Beginner Mode and its opening SR objective asks use of all protagonist attacks; later objectives add coordinated kills/turn deadlines. Inferred: this can teach the action set through an optional goal. Full tutorial messages, unlock order and balancing are unread.

Sources: [source 1](https://en.wikipedia.org/wiki/Super_Robot_Wars_V), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/V/Flow_Chart).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): An optional opening objective can teach several useful verbs. Offer ordinary completion and explain known mastery terms without forcing perfect play.

## A11 Little touches

Status: **covered**.

Stated in W menu guide: battle animation/explosion can be toggled; grid and shortcuts can be configured; BGM can be assigned and protagonist weapons renamed. These are title-specific flavor and pacing controls. No accessibility audit or current platform parity proof.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/W/Menus).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): Allow repeated-action feedback to be shortened while preserving outcomes. Cosmetic naming must not change action identity or save compatibility.

## A12 Other systems

Status: **partial**.

Stated: V has participant-specific secret recruitment/attacks, early-versus-late arrival, event-only survival, and unit upgrade transfers. W clear state trades parts for money and carries upgrades under its own rules. All-secret/series-wide catalogs, achievements and full DLC entitlement matrix remain unread.

Sources: [source 1](https://akurasu.net/wiki/Super_Robot_Wars/V/Secrets), [source 2](https://akurasu.net/wiki/Super_Robot_Wars/V/Upgrade_Carryover), [source 3](https://akurasu.net/wiki/Super_Robot_Wars/W/Clear).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Distinguish survival, recruitability, early arrival and playable control. A surviving NPC need not join the player's roster.

## Remaining precision

A03 architecture and A07 authoring unread; A01 script/text corpus and A04 save internals unread. Guide-only AI/RNG/migration/event order and full title/edition catalog remain partial. No install warranted for this lane.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems](DEEPER_SYSTEMS.md), [ranked report](REPORT.md), [tooling and rerun](TOOLING.md). Grouped status is [the lane checkpoint](../../majoras-mask/aspects-2026-10-14/CHECKPOINT.md).
