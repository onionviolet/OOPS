# Aspect pass A01-A12

2026-10-15 source snapshot for dispatch 2026-10-14, lane lib-zhutian. All twelve aspects are partial. A defined table or reader is not runtime acceptance. Source IDs resolve through [SOURCES](../SOURCES.md). Full private tables, text, event IDs and conditions remain in the scratch area.

## A01: Dialogue and conversation

Status: partial. [Detail](A01_DIALOGUE_AND_CONVERSATION.md). Sources: S09; dh.json 171x13x1; dhmb.json 18x16x1.

SHOWN: a table-driven dialogue executor supplies speaker name, portrait, placement and typed text, then advances through dialogue/special-event functions. Service dialogue templates provide reusable greeting/trade phrases. The main-quest trigger system is separate from the line renderer. Full per-line condition meanings, branching topology, relationship gates and save-during-dialogue behavior are not decoded. Full original text and IDs remain in private extracts, not this dossier.

PROPOSALS: P19/P21: join one native conversation choice to an actual effect and retained continuation. Dialogue/interactions owner; K6/K12/K14/K20. Use stable speaker/recipient identity. A roster entry or greeting pool is not a persistent relationship.

## A02: Narrative delivery

Status: partial. [Detail](A02_NARRATIVE_DELIVERY.md). Sources: S09; data.json project/6/0/1/157/8/12; rw.json 28x16x1.

SHOWN: dialogue, main-quest acceptance/completion checks, unlock functions and repeatable task templates coexist. STATED help places tasks at faction services with reputation/contribution returns. The opening premise connects an inherited antique business with inter-world travel. Full plot graphs, all endings, story timing, journals and durable missed-event aftermath are unread.

PROPOSALS: P10/P12/P19: distinguish quest eligibility, a chosen action and actual closure. Narrative/canon-event owners; K6/K12/K16/K29. Preserve local and issuer goals separately under the nested-world owner. This source does not prove those are independently simulated.

## A03: Implementation architecture

Status: partial. [Detail](A03_IMPLEMENTATION_ARCHITECTURE.md). Sources: S01; S02; S06; S12.

SHOWN: Construct 3 NW.js export, six layouts and six event sheets; JSON content arrays and serialized events reference generated JS expressions. A static decoder joins the 296 reference entries and 10,832 expression entries while retaining bindings. Main runtime also contains standard engine/plugin code, so its size is not all authored gameplay. Full event ordering, hot-path cost and every subsystem reader are not audited.

PROPOSALS: P16/P22: distinguish definitions, mutable native instances and display text. Engine/content owners; K1/K18/K33/K34. Reuse existing native consumers and validation. Do not import this event engine or numeric save layout.

## A04: Save and persistence

Status: partial. [Detail](A04_SAVE_AND_PERSISTENCE.md). Sources: S07; S08; S13; scripts/c3runtime.js Arr.GetAsJsonString/JSONLoad.

SHOWN: custom gameplay array plus metadata are serialized into normal/backup slots via LocalStorage or NW.js text files; settings use a separate dictionary. Plane location and progress are positional saved fields. Packaged save.json is only a zero template. All actual player saves and record files remained unread. No atomic publication, corruption recovery, compatibility migration, offline timestamp settlement or Cloud behavior is proved.

PROPOSALS: P24/P16 and IR4: restore complete native state coherently and pin saved meaning. Persistence/world-state owners; K18/K33. Backups need a validated recovery path. Multiple writes do not prove atomic durability.

## A05: AI and NPC behavior

Status: partial. [Detail](A05_AI_AND_NPC_BEHAVIOR.md). Sources: S10; S12; S14; bz.json [8,17].

STATED: auto battle uses three priority-selected skills when conditions allow. SHOWN auto-mode, targeting and actor-core groups implement battle machinery; shared actors also feed company staffing and dispatch. There is no established planner, autonomous resident schedule, independent faction economy or personal long-term memory in this pass. All target-selection edge cases and lawful action parity remain unread.

PROPOSALS: P06/P25: one actual resident or combat plan should pay costs through native rules and remember outcomes. Person/work/combat owners; K6/K7/K13/K26. Do not cite an auto-combat priority list as evidence of simulated lives.

## A06: UI and information design

Status: partial. [Detail](A06_UI_AND_INFORMATION_DESIGN.md). Sources: S01; S02; S05; S09; data.json project/6/0/1/157/8/2,4,7.

SHOWN: resizable 2016x1136 wrapper; main layout 2560x1440; roster paging/filtering, inventory comparison/tooltips, travel-party/difficulty selection, help and reputation/contribution displays in sprite/text event groups. A separate compact idle-display mode changes window/canvas, hides selected backgrounds, toggles sound state and shows activity/status; it is not closed-app catch-up. No screenshot or live desktop screen was viewed, so clipping, readability, simultaneous panel composition and keyboard discoverability are unverified.

PROPOSALS: P04/P16: preserve selection and known context in a useful detail view. UI_RULES/current UI owner; K11/K14/K30. Target populated 1366x768, shared center controller and Back/Esc, full-height log intact; mobile deferred. Compact display does not prove lower energy use.

## A07: Content authoring and modding

Status: partial. [Detail](A07_CONTENT_AUTHORING_AND_MODDING.md). Sources: S01; S02; wm.json; jn.json; pf.json; lau.json.

SHOWN: content is largely tabular, with image/ID references and separate localized strings. Event-sheet logic supplies explicit consumers and formulas. Tables mix strings/numbers and include sentinels and placeholders. No original Construct project/editor source, declared mod API, supported load-order contract or semantic validator was established in the ZIP inventory. DLC recognition exists but its data files/entitlements were left unread.

PROPOSALS: P22/P16: validate typed ID joins and revisions before activation. Content/structured-pack owners; K1/K18/K33/K34. An editable table is not a supported mod contract. Keep private source extraction separate from original YAIRPG authoring.

## A08: Balance and numbers

Status: partial. [Detail](A08_BALANCE_AND_NUMBERS.md). Sources: S06; S10; S13; S11.

SHOWN: weighted drop/no-drop tables use different scales by branch, with boosted odds clamped to 10000 or 100 and special guaranteed routes. Career/stat/skill aggregation and explicit XP functions are indexed; packed progress derives floor and difficulty. STATED quality affects equipment affixes and training difficulty. Exact throughput, all balance curves, big-number limits, pity, seed persistence and modifier order across all consumers remain unread.

PROPOSALS: P15/P17/P22: validate units and scope at one real producer. Item/combat/debug owners; K3/K9/K13/K34. Do not copy source numbers or claim a per-hour rate without combat/time inputs.

## A09: Time and scheduling

Status: partial. [Detail](A09_TIME_AND_SCHEDULING.md). Sources: S08; S12; S14; bz.json [2,34], [3,38], [6,32].

SHOWN periodic base time, saved elapsed-time updates, calendar/pause/autosave paths, practice/dispatch groups and active-process automatic combat modes. STATED city management time is separate from battle animation speed; skill practice follows a queue and faction tasks initially refresh at ten-minute intervals. Compact idle display is an online mode. Closed-app catch-up, all stop boundaries and all clock mappings remain unread.

PROPOSALS: P08/P13/P24: bind actual routine, clock and stop reason with current OD4 policy. Scheduler/away-ledger owners; K8/K18/K26/K32. Keep inactive worlds paused and an earned-work receipt separate from any simulated-life cheat or timeline change.

## A10: Onboarding and reveal

Status: partial. [Detail](A10_ONBOARDING_AND_REVEAL.md). Sources: S04; S09; data.json project/6/0/1/157/8/6/8/11/8/9; data.json project/6/0/1/157/8/12.

SHOWN opening dialogue, help categories, main-quest unlock hooks and a plane unlock handler with development/demo refusal paths. STATED base completion opens later available planes; secret realms, dungeon/tower milestones and rebirth gate later options. The complete unlock graph and natural time-to-first-travel were not exercised. Do not infer every content row is available.

PROPOSALS: P04/P10: show the next useful option and actual missing means. World-card/quest/UI owners; K5/K11/K12/K14. Use guided randomness and existing optional vanilla direction; do not impose this source opening sequence on YAIRPG.

## A11: Little touches

Status: partial. [Detail](A11_LITTLE_TOUCHES.md). Sources: S04; S09; S12; S14; SMALL_TOUCHES.md.

SHOWN structural support for item comparison, sorting/filters, lock controls, quick travel, typed conversation, battle data and compact activity status. STATED rarity-threshold sale/disposal, research/practice queues and collection rewards. Enforcement and rendered feedback vary in read depth. A 28-touch table maps each cue to evidence and YAIRPG owners. Sound/animation assets exist but were not played or visually assessed.

PROPOSALS: P01/P04/P18: useful feedback, exact blockers and preserved context should enter one selected slice. UI/work/item owners; K9/K11/K14/K34. Avoid a touch-only rollout that lacks a working useful action.

## A12: Other systems

Status: partial. [Detail](A12_OTHER_SYSTEMS.md). Sources: S10; S12; S15; bm.json; jz.json; kj.json; mg.json; mp.json; tz.json; hh.json.

SHOWN company departments, buildings, research, recipes, cosmetics, destiny boards/stones, traits, beasts, collections and divine-world structures. STATED home retail consumes foreign equipment, player competence boosts global production, deputies transfer some stats/growth and rebirth opens destiny regions. Divine offices, artifact souls, conquest, beast quality and full production formulas remain only partly indexed. They are not claimed complete or physically simulated.

PROPOSALS: P02/P06/P07: use a carried reward or real actor competence in another useful activity. Economy/actor/capability owners; K3/K6/K8/K9/K25/K26. Extend one existing world deeply before adding the source roster of worlds or a general company subsystem.
