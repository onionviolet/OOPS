# The Modding Tree family aspect pass, 2026-10-14

TMT 2.7, Prestige Tree Rewritten, Communitree and Profectus pinned source snapshots. Source inspection only. These are incremental frameworks/games, not general text-world engines. Source-derived UI structure is not desktop usability proof.

All recommendations are PROPOSALS. No runtime implementation or accepted decision. No game was launched, downloaded code run, personal save opened, account used, install changed, git staged, committed or pushed. Only assigned aspect folders and asp-text scratch were written. Desktop first; one realm/one prestige remains the milestone; no fixed solo once restriction is adopted.

SHOWN means statically inspected artifact behavior. STATED means documented by source/help/store. INFERRED identifies our interpretation. Covered is a bounded aspect answer, not exhaustive content or runtime verification.

## A01 Dialogue and conversation

Status: absent

No dedicated NPC conversation graph was found in inspected TMT/PT/Communitree layer APIs or Profectus feature registry. Author-supplied display/infobox functions can render text or controls, but are not dialogue semantics. This is absence in the inspected architecture, not proof that no community mod adds dialogue.

- SHOWN: [docs/layer-features.md](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/docs/layer-features.md). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [src/features/infoboxes/infobox.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/infoboxes/infobox.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/features/feature.ts](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/feature.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: A text box is only presentation; any YAIRPG conversation needs speaker, predicates, effects and retained state from its existing owner. Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`.

## A02 Narrative delivery

Status: covered

SHOWN: layers, upgrades, challenges, milestones, changelogs and infoboxes carry authored explanations. Profectus infobox persists its collapsed state but title/body are renderable getters. This supports staged exposition and remembered UI choices, not a quest journal, causal story planner or authored branching plot.

- SHOWN: [createInfobox, collapsed](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/infoboxes/infobox.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [js/layers.js](https://github.com/Jacorb90/Prestige-Tree/blob/cec9198c8ce9a5c6d107179871cbe84fab92ae0d/js/layers.js). cec9198c8ce9a5c6d107179871cbe84fab92ae0d.
- SHOWN: [js/layers/acamaeda.js](https://github.com/ducdat0507/communitree/blob/38efac6d1b9e68db158c260fcb343d1881b29256/js/layers/acamaeda.js). 38efac6d1b9e68db158c260fcb343d1881b29256.

PROPOSAL: Preserve explanation state separately from earned world history; use factual event records for story. Owner: `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`.

## A03 Implementation architecture

Status: covered

SHOWN: TMT uses JS globals/layer definitions, Vue and a derived tmp cache; side-effect hooks excluded from temp traversal. Profectus uses TypeScript/Vue refs, lazy proxies and typed nanoevents. Layer update phases run preUpdate/update/postUpdate, with caller time in seconds despite millisecond comments. Hiding a layer does not stop traversal or prove dormancy.

- SHOWN: [js/technical/temp.js](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/technical/temp.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [src/game/events.ts](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/events.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/game/layers.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/layers.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/game/gameLoop.ts](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/gameLoop.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Name clock units and phase order in author contracts; do not assume reactive caching makes arbitrary effects deterministic. Owner: `docs/ENGINE_EXPANSION.md`.

## A04 Save and persistence

Status: covered

SHOWN: TMT saves base64 JSON to mod-keyed localStorage, fills defaults, restores Decimal fields and runs custom version repair; options stored separately. Profectus compresses JSON to UTF-16, supports multiple save IDs and legacy encodings, reconstructs layers, fills defaults and invokes fixOldSave. Persistent refs track defaults and save paths; NaN detection disables autosave. load falls back to a fresh save on failure. Its offline-bank load expression adds existing offlineTime both outside and inside Math.min, so exact banking needs verification. No save was loaded or written.

- SHOWN: [save, load, fixData, exportSave](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/utils/save.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [decodeSave, load, loadSave, save](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/util/save.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [persistent, checkNaNAndWrite](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/persistence.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Use last-good retention and explicit failed-load recovery; validate new and derived fields, exact version behavior and offline-bank accounting. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: absent

No autonomous world NPC planner or schedule in inspected framework feature registry. Earned automation uses autoPrestige, autoUpgrade, passiveGeneration and layer automate hooks. These automate player-owned progression and are not evidence of independent actors.

- SHOWN: [gameLoop automation](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/game.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [js/layers.js](https://github.com/Jacorb90/Prestige-Tree/blob/cec9198c8ce9a5c6d107179871cbe84fab92ae0d/js/layers.js). cec9198c8ce9a5c6d107179871cbe84fab92ae0d.

PROPOSAL: Keep player routines and NPC policies separate; automation should gain an explicit useful action and on/off state. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial

SHOWN: tree nodes/links, tabs/microtabs, bars, resources, tooltips, hotkeys, notifications and buyable/challenge views; Profectus boards add pan/zoom, transient drag previews, target detection, persisted position, radial actions and overlap placement. Drag end snaps free placement to 25-unit spacing. No desktop/accessibility exercise; keyboard-only board operation not established.

- SHOWN: [setupDraggableNode, makeDraggable, setupActions, placeInAvailableSpace](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/boards/board.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [js/technical/particleSystem.js](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/technical/particleSystem.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [src/features/hotkey.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/hotkey.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Keep independent useful panels at 1440x900 and 1366x768; any board action also needs a readable click/keyboard path. Mobile optimization deferred. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: covered

SHOWN: TMT addLayer object schemas register start data, upgrades, buyables, challenges, milestones and functions; grid IDs encode coordinates. Communitree separates creator files but composes lower progress as buyables. Profectus factories, requirements and persistent registration offer typed conventions. Executable content remains capable of side effects; conventions alone do not prove cross-author compatibility.

- SHOWN: [js/technical/layerSupport.js](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/technical/layerSupport.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [src/game/requirements.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/requirements.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/game/persistence.ts](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/persistence.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [js/layers](https://github.com/ducdat0507/communitree/blob/38efac6d1b9e68db158c260fcb343d1881b29256/js/layers). 38efac6d1b9e68db158c260fcb343d1881b29256.

PROPOSAL: Keep stable IDs, registered consumers and explicit returned state; validate the dependency/reset contracts of each added system. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: covered

SHOWN prior pass: normal/static prestige formulas with inverse next-at; authored softcaps and inverse relief; Rewritten registry describes the cap transformations. Profectus Formula/requirements implement derived costs and bulk behavior. Decimal libraries support huge magnitudes but are not exact economy arithmetic or successful late-game balance proof. RNG/pity absent from the inspected prestige contract.

- SHOWN: [getResetGain, getNextAt](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/game.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [js/sc.js](https://github.com/Jacorb90/Prestige-Tree/blob/cec9198c8ce9a5c6d107179871cbe84fab92ae0d/js/sc.js). cec9198c8ce9a5c6d107179871cbe84fab92ae0d.
- SHOWN: [src/game/formulas/formulas.ts](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/formulas/formulas.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/game/requirements.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/requirements.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Explain thresholds and authored diminishing returns; verify forward/inverse rounding and aggregate resource cost. Owner: `docs/ENGINE_EXPANSION.md`.

## A09 Time and scheduling

Status: covered

SHOWN: TMT loop normally runs every 50 ms; absence adds to an offline bank and accelerated ticks spend it under maxTickLength. Profectus gameLoop sends simulation diff and trueDiff, stops at win/NaN/pause, clamps offline bank then caps delta and emits update. trueDiff remains available for visual time. This is accelerated delta consumption, not exact boundary replay; bank consumption before delta cap can differ from useful simulated time.

- SHOWN: [offline processing](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/game.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [update](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/gameLoop.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [loadSave](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/util/save.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Separate elapsed, allowed simulation, consumed budget and remaining work; animate on real time while retaining exact causal work boundaries. Owner: `docs/TIMELINES_AND_DIVERGENCE.md`.

## A10 Onboarding and reveal

Status: covered

SHOWN: unlock predicates reveal layer nodes/features; milestones award passive production/automation and carry rules. Hidden/deactivated/displayRow/reset-row are separate concepts. Order repricing in PT leaves both branches reachable; mastery restricts a rerun to allowed layers, then changes formulas on completion. No tutorial retention study or first-run play proof.

- SHOWN: [unlockOrder, startMastery, completeMastery](https://github.com/Jacorb90/Prestige-Tree/blob/cec9198c8ce9a5c6d107179871cbe84fab92ae0d/js/layers.js). cec9198c8ce9a5c6d107179871cbe84fab92ae0d.
- SHOWN: [docs/layer-features.md](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/docs/layer-features.md). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [src/features/achievements/achievement.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/achievements/achievement.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Reveal complexity through earned useful options while preserving other reasonable routes; preview resets and carries explicitly. Owner: `docs/ENGINE_EXPANSION.md`.

## A11 Little touches

Status: covered

SHOWN: persisted infobox collapse, grid-snapped positions, drag-versus-click threshold, nearest valid drop target, node overlap placement, radial contextual actions, particles with finite life, next-at previews and earned automation toggles. Particle motion increments per update rather than integrating all velocity terms with diff in inspected TMT code; smoothness is unmeasured. No general accessibility or performance claim.

- SHOWN: [src/game/boards/board.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/boards/board.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/features/infoboxes/infobox.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/infoboxes/infobox.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [js/technical/particleSystem.js](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/technical/particleSystem.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.

PROPOSAL: Polish must not create hidden rule changes; persist layout choices, provide action alternatives and keep visual clocks separate. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A12 Other systems

Status: covered

SHOWN: prestige/reset hierarchy, conditional retention, milestones/achievements, repeat challenges, buyables/respec, grids, clickables, mastery, softcaps, automation, community creator hubs, formula bulk purchase and board layouts. Full semantics of every community game and all vendor libraries remain unread; census is finite to the pinned sources.

- SHOWN: [js/game.js](https://github.com/Acamaeda/The-Modding-Tree/blob/4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621/js/game.js). 4d8a86cfb3c59ef3ef4c222f21ef4fbee980c621.
- SHOWN: [js/layers.js](https://github.com/Jacorb90/Prestige-Tree/blob/cec9198c8ce9a5c6d107179871cbe84fab92ae0d/js/layers.js). cec9198c8ce9a5c6d107179871cbe84fab92ae0d.
- SHOWN: [js/layers](https://github.com/ducdat0507/communitree/blob/38efac6d1b9e68db158c260fcb343d1881b29256/js/layers). 38efac6d1b9e68db158c260fcb343d1881b29256.
- SHOWN: [src/features/reset.ts](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/features/reset.ts). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.
- SHOWN: [src/game/boards/board.tsx](https://github.com/profectus-engine/Profectus/blob/d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea/src/game/boards/board.tsx). d69197d5c7225a0bb58b5a4d5f8e19c1c04a61ea.

PROPOSAL: Use transition previews and milestone-dependent retention on an authorized slice; no new multi-prestige scope or fixed once limits follows from this research. Owner: `docs/ENGINE_EXPANSION.md`.
