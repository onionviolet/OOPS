# Immortality Idle: A01 to A12

2026-10-14. Static RESEARCH, not gameplay acceptance. Shown means this lane read source/table structure; stated means an identified prior report; inferred means interpretation. All YAIR takeaways are unselected PROPOSALS.

Source identity: Pinned public source c7231bae717b67a8e4dba2a3775d58bfbfadbdd6, Angular2.0.0. Existing idle-depth clone read-only; fresh own priority-source copies.

Locators: Path readable.js is the pinned formatted file; Groundhog v1/v2 paths are defined in TOOLING.md; Immortality paths are relative to the pinned clone; Tale table names refer to the official backup. Source bodies/text and complete inventoried metadata are retained in [private work area](/Users/weiwei/.codex/research/asp-cultivation/extract/). No user saves, game launch, source/build change or account interaction.

## A01 Dialogue and conversation

Status: partial. Sources: `src/app/text-panel/text-panel.component.ts/html; src/app/game-state/log.service.ts; activity.service.ts L1780-1932`.

Shown: TextPanelComponent is a title plus paged body/image arrays with previous/next; it has no choices, speakers or state-effect callbacks. Activities produce conditional dragon/follower/story messages. A text viewer is not a dialogue graph. No general NPC conversation graph found in the inspected services; complete narrative-site search is partial.

PROPOSAL: separate repeatable barks, illustrated memories and state-changing dialogue; owner docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A02 Narrative delivery

Status: covered. Sources: `log.service.ts L23-173; achievement.service.ts L2262-2291; text-panel component`.

Shown: five log topics. Opening narrative is a nine-entry queue paced by long ticks. Identical adjacent messages increment repeat and refresh time. Non-story topics retain at most300 each; visible merged list is299. Only storyLog/topic preferences/remaining intro queue are persisted by LogProperties. Memory review uses the illustrated text viewer. Inferred: preserving story while compacting routine noise supports return clarity, but biography and knowledge are separate needs.

PROPOSAL: durable story receipts with bounded repeated-action logs; owner chronicle and characters.

## A03 Implementation architecture

Status: covered. Sources: `src/app/game-state/main-loop.service.ts L210-310, game-state.service.ts; package.json at pinned c7231bae`.

Shown: Angular/TypeScript, injectable subsystem services, RxJS Subjects for daily/combat/home/long/year signals, Angular signals for UI. Main loop schedules setTimeout callbacks. A tick branches into combat or a day with ordered topic emissions. GameStateService gathers service properties; service-owned definitions include executable activity/requirement callbacks. UI components are separate. No full performance benchmark or subscription-order audit.

PROPOSAL: declare phase order and transaction boundaries instead of relying on subscription side effects; owner docs/ENGINE_EXPANSION.md.

## A04 Save and persistence

Status: covered. Sources: `game-state.service.ts L489-612,L1355-1394,L1712-1726; main-loop.service.ts L160-190`.

Shown: export is ii2 plus btoa(encodeURIComponent(JSON.stringify(state))). This is encoding, not encryption/compression. Prefix mismatch toasts and returns; accepted-prefix atob/decode/JSON.parse is not caught in this method. Per-service default filling normalizes fields but is not explicit schema version migration. Inventory definitions/functions are reattached by item ID. Save key depends on deployment flavor; default interval300 sec, legacy fallback10 sec after import. Layout is exportable separately. Load banks elapsed time and pauses initially. Rejected-input atomicity and storage-quota handling are unproved.

PROPOSAL: validate imports on a detached candidate and reconstruct definitions from stable IDs; owner save compatibility.

## A05 AI and NPC behavior

Status: partial. Sources: `followers.service.ts L1308-1345,L2117-2165; activity.service.ts trigger methods; prior REPORT F3/F9`.

Shown/inherited: followers perform assignments, threshold triggers switch presets, aging can replace a follower with a child at reduced power. This is a managed workforce rather than a demonstrated utility-planning social world. Full follower generation, pets and pantheon selectors remain partial.

PROPOSAL: assignment succession preserves the role without conflating identities; owner characters and work plans.

## A06 UI and information design

Status: covered. Sources: `standard-layout/standard-layout.component.html; game-state.service.ts L115-275,L316-337`.

Shown:21 registered panels, initially attributes/health/activity/log; desktop uses a lockable draggable grid with add-new-panel highlight, per-panel help, tooltips, dark mode, stores and memory review. Separate mobile component exists but is deferred for YAIR. No rendered1440 x900 acceptance, focus or keyboard audit.

PROPOSAL: persistent desktop workspace plus separate layout import; owner docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: covered. Sources: `activity.service.ts, item-repo.service.ts, farm.service.ts interfaces; game-state property readers`.

Shown: content authored in TypeScript services, interfaces/enums and callbacks rather than an external dialogue language. Item IDs rehydrate runtime definitions after saving. Component HTML supplies presentation. Public source is inspectable, but no formal mod API or dependency/load-order contract found; no code reuse selected.

PROPOSAL: version stable IDs and lint authored requirements before registration; owner world authoring and engine.

## A08 Balance and numbers

Status: partial. Sources: `farm.service.ts L325-348,L408-477; prior REPORT F2,F4,F10,F11`.

Shown: field cap and duration derive from crop value, contemplation adds log10-based food yield, annual yield averages smooth output. Prior source traces aptitude diminishing returns, lifespan sources, generated techniques and concept combinations. Farming comments and implementation disagree on leftover work: yield is clamped before subtracting that same cap, so the advertised leftover becomes zero in that branch. No simulation performed. Full combat/late economy constants not re-audited.

PROPOSAL: show source contributions and test conservation where resources cross phases; owner crafting/economy and engine.

## A09 Time and scheduling

Status: covered. Sources: `main-loop.service.ts L160-190,L210-310; farm.service.ts L174-199,L408-477`.

Shown: offline elapsed milliseconds produce banked ticks divided by TICK_INTERVAL_MS and offlineDivider(default10); bank is later spent. Day and battle ticks are distinct. Farm seclusion accumulates days; long tick applies them in batch. Active farming charges upkeep before aging, whereas the seclusion catch-up branch must be audited separately for economic parity. Autopause can interrupt accelerated batches.

PROPOSAL: explain banked-time spending and stop at consequential decisions; owner engine time.

## A10 Onboarding and reveal

Status: covered. Sources: `game-state.service.ts L115-275; log.service.ts intro queue; tutorial-panel component HTML`.

Shown: initial four panels and gradual new-panel availability; the nine-line opening stream introduces reincarnation. Manuals/achievements unlock automation and additional systems. Tutorial is a separate reviewable help surface. No first-life pacing measured.

PROPOSAL: keep help replayable and unlock useful panels with the action that motivates them; owner UI/discovery.

## A11 Little touches

Status: covered. Sources: `log.service.ts L100-173; standard-layout component; text-panel component`.

Shown: repeat counts, unread topic flags, reverse chronological merged log, manual-availability highlight, layout lock, help icons/aria labels, dark mode and illustrated memory paging. Music controls and volume persist through main-loop properties. These are code-presence claims, not accessibility certification.

PROPOSAL: durable memory viewing and quiet status indicators; owner chronicle/UI.

## A12 Other systems

Status: partial. Sources: `farm.service.ts; prior hell/activity/combat digests; immortality-file-inventory.json`.

Shown: cultivation through activities, craft workstations, home/feng shui, inventory/food, farming, followers/pets, reincarnation/aptitude, concept graph, generated techniques, impossible tasks, hells and gods/avatar runs. Every source/service/component file in the pinned app is inventoried. Classic/old deployed builds, full pantheon and inventories remain unread.

PROPOSAL: ordinary work contributes to both competence and a useful project; owner docs/ENGINE_EXPANSION.md and crafting.
