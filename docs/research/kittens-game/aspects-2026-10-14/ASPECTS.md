# Kittens Game aspects, 2026-10-14

Feature answers are complete; this breadth pass is PARTIAL in depth. `covered` means the bounded source question was covered, not natural gameplay or persistence acceptance. Revision and browser limits are in ../REPORT.md. Raw text/tables/conditions live in ../private/fs-kittens/.

## A01: Dialogue and conversation

Status: partial. Evidence: stated (source); absence is bounded search inference.

No dialogue tree, speaker graph or relationship-gated conversation was found in a targeted source search. Jobs/buildings/tech have localized flavor and trade uses outcome barks. Entire English string table is retained privately; every flavor condition was not individually traced.

Implementation: `js/diplomacy.js:878 trade result messages`; `js/village.js:14 job flavor fields`; `res/i18n/en.json`.

YAIRPG PROPOSAL: Use event outcome barks without substituting prose for mechanical receipts. Owner: docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A02: Narrative delivery

Status: partial. Evidence: stated (source).

Localized event and resource outcome logs carry narrative rather than a quest journal. Calendar unlocks and random checks schedule notices; observation can change resources. All late event conditions are not mapped.

Implementation: `js/calendar.js:519 astronomical events`; `game.js console manager`; `js/diplomacy.js:1064 result messages`.

YAIRPG PROPOSAL: Keep actual outcomes and ambient flavor distinct. Owner: docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A03: Implementation architecture

Status: covered. Evidence: stated (source), shown (fresh local boot).

Browser JS uses Dojo declared classes/managers, localized metadata plus embedded handlers, React resource/queue surfaces and shared imperative buttons. The five-tick-per-second model updates resources before buildings/village/workshop and other managers; cached effects and worker timing reduce repeated work. Source boot succeeded locally.

Implementation: `index.html:134 module loading`; `core.js:59 TabManager metadata`; `game.js:4503 updateModel`; `game.js:5263 timers`; `js/jsx/left.jsx.js`.

YAIRPG PROPOSAL: Adapt projections over existing YAIRPG commands, not a new donor engine. Owner: docs/ENGINE_EXPANSION.md.

## A04: Save and persistence

Status: partial. Evidence: stated (source).

Manager-owned JSON with saveVersion15, optional LZ storage/export encoding, about80-second autosave at normal5Hz, old-field migration and afterLoad replay/recalculation. Broken loads preserve original payload on later save; quota errors report failure. Timestamps support catch-up. Save/import/corruption fixtures and all migration branches are untested.

Implementation: `game.js:2877 save`; `game.js:3069 load`; `game.js:3304 migrateSave`; `core.js:294 loadMetadata`; `js/time.js:34 save`.

YAIRPG PROPOSAL: Preserve original failed payload and optional old-state defaults. Owner: docs/ENGINE_EXPANSION.md.

## A05: AI and NPC behavior

Status: partial. Evidence: stated (source).

Assigned jobs, kitten skill/trait/leader effects and engineer recipe progress drive production. Trade races are rule tables; no general social planner shown. Map/squad combat exists but was not traced in depth.

Implementation: `js/village.js:603 getResProduction`; `js/village.js kitten simulation/map`; `js/diplomacy.js races`; `js/workshop.js:2889 engineers`.

YAIRPG PROPOSAL: Explain worker opportunity cost from real assignment facts. Owner: docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A06: UI and information design

Status: covered. Evidence: shown (fixtures/boot) + stated (source).

Desktop has resource, action and log/queue columns. Cost tooltips carry held/cost/ETA/recipe expansion; color marks shortages and cap limits. Resource hover explains nonzero rate terms and depletion/cap times. Zero causes and numeric cap explanation are weak. Controlled1366x768 rendering captured; natural advanced UI untested.

Implementation: `core.js:1324 price models`; `core.js:1595 price rendering`; `js/jsx/left.jsx.js:127 capacity cues`; `game.js:4769 resource tooltip`; `js/ui.js`.

YAIRPG PROPOSAL: Put cause/cap/remedy words beside current job at1366x768. Owners: P01 UI documents.

## A07: Content authoring and modding

Status: partial. Evidence: stated (source).

Content is JS metadata with prices/unlocks/effects and calculation callbacks, localized via string keys. Public before-save hooks permit external consumers. Contribution principles emphasize reuse and several bottleneck solutions. No supported comprehensive mod overlay/load-order contract was established.

Implementation: `js/science.js techs/policies`; `js/buildings.js buildingsData`; `js/workshop.js crafts/upgrades`; `i18n.js`; `README.md:90`; `game.js:2936 before-save event`.

YAIRPG PROPOSAL: Stable definitions plus narrow typed handlers; do not copy a plugin API claim. Owner: docs/ENGINE_AUTHORING.md.

## A08: Balance and numbers

Status: partial. Evidence: stated (source).

Building price ratios grow with owned count and apply bounded discounts; craft efficiency changes output. Helpers supply diminishing returns and random/approximate distributions using Math.random. No saved deterministic RNG or universal pity system is established. Full late-game formulas not audited.

Implementation: `core.js:2176 escalating prices`; `js/math.js RNG`; `game.js diminishing-return helpers`; `js/workshop.js:2721 engineer rates`.

YAIRPG PROPOSAL: Quote rounded batches and distinguish nominal versus effective prices. Owner: docs/ENGINE_EXPANSION.md.

## A09: Time and scheduling

Status: partial. Evidence: stated (source).

Calendar seasons change rates. Offline redshift delegates to subsystem fastforwards and caps10/40years despite a one-year comment. Queue ETA checks capacity/nonpositive rate and engineer cadence, then buy controllers recheck actual prices. Queue boundary and all offline event parity paths not exercised.

Implementation: `game.js:5313 tick`; `js/calendar.js`; `js/time.js:191 applyRedshift/:246 cap/:2048 queue ETA`.

YAIRPG PROPOSAL: Stop at causal boundaries and name interval/results. Owner: docs/ENGINE_EXPANSION.md; separate future leaf.

## A10: Onboarding and reveal

Status: covered. Evidence: shown (fresh start + tech model matrix); stated (source).

Small resource/action start grows through unlock signals, price-fraction building exposure, technology flags and hidden panels. Researching agriculture grants building permission/jobs rather than immediately owning a building. Revealed, bought and usable remain separate.

Implementation: `js/buildings.js:2828 isUnlocked`; `js/science.js:14 calendar unlocks`; `game.js:6038 unlock`; `js/workshop.js:3065 craft visibility`.

YAIRPG PROPOSAL: Observer-safe knowledge/permission/usability projections. Owners: docs/TECHNOLOGY_AND_PROGRESSION.md; docs/ENGINE_AUTHORING.md.

## A11: Little touches

Status: covered. Evidence: stated (source), shown (price text fixture).

Held/cost fractions, short unit formatting, expandable ingredients, active/owned counts, progress, completed labels, near-cap color and optional researched filtering make dense routine choices legible.26 donor-linked adaptation touches are catalogued separately.

Implementation: `core.js price/effect helpers`; `js/workshop.js craft assignment links`; `js/jsx/left.jsx.js`; `README.md`.

YAIRPG PROPOSAL: Text supplements color and controls remain visible on desktop. Owner: P01 UI documents.

## A12: Other systems

Status: partial. Evidence: stated (source).

Achievements/badges, reset prestige, religion, missions/planets, challenge rules, pollution/energy and read-only cloud-save preview exist. Preview/queue/cap-sensitive policy deeper traces are saved; full late progression content and native use are unread.

Implementation: `js/achievements.js`; `js/prestige.js`; `js/religion.js`; `js/space.js`; `js/challenges.js`; `js/void.js`; `js/preview.js`.

YAIRPG PROPOSAL: Save review should detach storage and block mutation, independent of normal play. Owner: docs/ENGINE_EXPANSION.md.

