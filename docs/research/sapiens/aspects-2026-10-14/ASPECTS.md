# Sapiens aspects, source pass

Status: PARTIAL. Priority A01/A03 covered and A04 partially covered to the native boundary. Shown means Lua evidence, not gameplay. Negative absence claims remain scoped to searched Lua.

## A01

Status: covered. Shown: Distance and time select vocal interactions and gestures; voice varies by life stage/sex in the shown route. No paid-choice conversation tree shown.

Sources: `scripts/common/social.lua`, `scripts/common/vocal.lua`, `scripts/server/sapienAI/startOrderAI.lua`.

PROPOSAL: DIALOGUE_AND_INTERACTIONS: small conditional barks; keep paid choices separate.

## A02

Status: partial. Shown: World/tribe events are timed with retries; tutorial and discovery notices recall real state. Broader narrative content unread.

Sources: `scripts/server/serverStoryEvents.lua`, `scripts/server/serverTutorialState.lua`, `scripts/mainThread/ui/discoveryUI.lua`.

PROPOSAL: CHARACTERS_AND_WORLD_EVENTS: retain scheduled event state and useful results.

## A03

Status: covered. Shown: Lua modules split common, server, logic, globe and main threads; native mj/bridge APIs supply engine services. Indexed tables define content; callbacks refresh dependent availability.

Sources: `scripts/common/typeMaps.lua`, `scripts/common/modManager.lua`, `scripts/server/planManager.lua`, `scripts/server/sapienAI/activeOrderAI.lua`.

PROPOSAL: ENGINE_AUTHORING: data definitions, state and projections have different owners.

## A04

Status: partial. Shown: Discovery state goes to players database; objects to native bridge; 0.4 discovery migration and type-map compatibility checks are visible. Byte format, atomicity, autosave cadence, corruption recovery, offline time and actual reload unread/unverified.

Sources: `scripts/server/serverWorld.lua:1195`, `scripts/server/serverWorld.lua:920`, `scripts/server/serverGOM.lua:3324`, `scripts/server/serverEvolvingObject.lua`.

PROPOSAL: ENGINE_SAVES_AND_SCALE_REVIEW: migration must preserve knowledge/assignment and stage progress.

## A05

Status: partial. Shown: AI distinguishes needs, plans, paths and action execution; shared typed plan feasibility is separate from individual work choice. Full utility ordering and AI tribes unread.

Sources: `scripts/server/sapienAI/startOrderAI.lua`, `scripts/server/sapienAI/activeOrderAI.lua`, `scripts/server/planManager.lua`.

PROPOSAL: ENGINE_EXPANSION: one admission truth with independent worker availability.

## A06

Status: partial. Shown: Blockers format counted inputs, facilities and assignment; active status names actions; discoveries queue notices. Screen layout, keyboard reachability and native rendering unverified.

Sources: `scripts/mainThread/ui/hubUIUtilities.lua`, `scripts/mainThread/orderStatus.lua`, `scripts/mainThread/ui/discoveryUI.lua`.

PROPOSAL: THEMATIC_UI: parallel current work/means/blocker at desktop 1366x768.

## A07

Status: covered. Shown: Lua registration tables, stable indexed maps, localization and ordered onload hooks support content/mod authoring; loader reports errors. Runtime API and mod execution not tested.

Sources: `scripts/common/modManager.lua`, `scripts/common/typeMaps.lua`, `scripts/common/research.lua`, `scripts/common/craftable.lua`.

PROPOSAL: ENGINE_AUTHORING: validate references and preserve stable saved IDs, no donor loader port.

## A08

Status: partial. Shown: Skill completion base 400; traits and research phase multipliers alter rates; active fellow researchers receive randomized skill progress. Full balance/RNG/pity not audited.

Sources: `scripts/server/serverSapienSkills.lua:getIncrement`, `scripts/common/skill.lua`, `scripts/server/serverWorld.lua:1556`, `scripts/common/craftable.lua`.

PROPOSAL: SKILLS_AND_TALENTS: count actual paid practice, separate grant policy.

## A09

Status: partial. Shown: World-time callbacks schedule earliest pile evolution and event retries; action updates use speed multipliers. Pause=0/play=1/fast=3 constants shown. Offline and clock rollback semantics unread.

Sources: `scripts/server/serverEvolvingObject.lua`, `scripts/server/serverStoryEvents.lua`, `scripts/common/gameConstants.lua`.

PROPOSAL: MODULAR_PRODUCTION_CHAINS: declare passive versus staffed time and interruption.

## A10

Status: covered. Shown: Tutorial counters are saved and notified; discovery dependencies gate investigations and reveal useful outputs. These are source behaviors, not a played tutorial.

Sources: `scripts/server/serverTutorialState.lua`, `scripts/common/gameConstants.lua`, `scripts/common/planHelper.lua:339`, `scripts/mainThread/ui/discoveryUI.lua`.

PROPOSAL: TECHNOLOGY_AND_PROGRESSION: reveal from earned useful actions, avoid hidden prerequisite leaks.

## A11

Status: covered. Shown: Counted shortages, specific facilities, breakthrough queue, action naming and conditional barks provide grounded feedback. Twenty-six original touches saved.

Sources: `scripts/mainThread/ui/hubUIUtilities.lua`, `scripts/mainThread/ui/discoveryUI.lua`, `scripts/common/social.lua`.

PROPOSAL: THEMATIC_UI: exact current feedback before additional cosmetic work.

## A12

Status: partial. Shown: Storage ownership/local overrides/alliance permissions and container chains are identified. Broader diplomacy, economy, genetics, disease, transport and achievements are inventoried but unread.

Sources: `scripts/common/planHelper.lua:2094`, `scripts/server/serverStorageArea.lua`, `scripts/server/serverTribe.lua`.

PROPOSAL: MEANS_AND_APPRAISAL: possession does not grant permission; custody survives processing.

## Unread and unverified table

| Area | Why / next evidence |
|---|---|
| A02 narrative breadth | Feature questions prioritized; read remaining story/UI/localization consumers. |
| A04 physical save format, atomicity, recovery, offline | Native bridge boundary, explicitly excluded; no save files opened. Separate authorized native study would be needed. |
| A05 complete AI and autonomous tribes | Selected execution/plan paths read; full utility and tribe planner not traced. |
| A06 actual layout and controls | No launch allowed; source formatting only. |
| A08 full balance/RNG and A09 offline timing | Scoped constants and callbacks only; broader RNG/clock policy not traced. |
| A12 trade, bodies, disease, transport, achievements | Inventoried modules, not whole-system audits. |
