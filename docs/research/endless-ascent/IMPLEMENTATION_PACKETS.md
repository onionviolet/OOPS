# Original implementation proposals

2026-10-09. Ranked proposals only. This audit authorizes no YAIR changes. All source-inspired behavior uses original fiction, local state and native menus; no raw source, assets, scripts or dialogue are public. One accepted playable slice precedes the next.

## P1: Visible repair gate

A single optional Nearby cave mechanism asks for an ordinary component, shows missing/supplied/ready and pays once.

Source basis: ['F4']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/data/locations.js (Nearby cave); src/items.js; src/field_ui.js:createFieldPanel`.
Boundary: Native location action plus inventory transaction; optional sparse encounter state.
Acceptance: Missing item rejects without mutation; proper item resolves once; repeat click, reload and import never duplicate reward.

## P2: Weighted contribution puzzle

One cave counterweight accepts several original item categories; show contribution and remaining requirement before placement.

Source basis: ['F5', 'F6']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/crafting_recipes.js; src/items.js; src/data/skills.js:Weightlifting; src/data/locations.js (Nearby cave)`.
Boundary: Reuse component counts and ordinary Weightlifting access, not physics or another XP pool.
Acceptance: Distinct category placement cannot double count; removing restores state; threshold crossing pays once; old saves have no invented placements.

## P3: Encounter retry with recovery

An optional challenge has a retry that explains exactly what resets; native unconsciousness/recovery remains the defeat rule.

Source basis: ['F12']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/data/locations.js (Cave room); src/save_files.js:validateSaveEnvelope; src/chronicle.js`.
Boundary: Encounter-local transient state with an explicit compatible retention policy.
Acceptance: Leaving/retrying cannot refund spent rewards or reroll a committed outcome; native defeat unchanged; save/reload/import honors declared scope.

## P4: Preparation instead of permanent upgrades

Offer one supply choice for the next optional outing using existing item stock and merchant prices.

Source basis: ['F2', 'F3']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/data/traders.js; src/items.js; src/data/inventory_templates.js`.
Boundary: Native coins and inventory; no ASCENSIONS currency, achievement dependence or prestige reset.
Acceptance: Purchase atomically debits coins and adds item; insufficient funds/full rejection changes neither; effects only through ordinary item use.

## P5: Readable hazard and refuge

For one proposed heat exposure encounter, show warning and remaining safe time and let player retreat.

Source basis: ['F7', 'F8']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/data/locations.js:location_types; src/event_feed.js; src/field_ui.js`.
Boundary: Bounded native location effect; skill mitigation through existing location rules.
Acceptance: Warnings readable before failure; pausing/leaving rules explicit; save/reload/import preserve elapsed state without wall-clock surprise.

## P6: Prerequisite-aware action wording

Replace a generic blocked encounter action with the specific missing tool and the next useful center action.

Source basis: ['F4', 'F9']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/field_ui.js:createFieldPanel; src/data/locations.js; src/items.js`.
Boundary: Existing center/location menu; no modal dashboard.
Acceptance: Blocked command refuses safely and says why; obtaining requirement changes label; already completed state remains readable.

## P7: Personal completion record

Record first clear separately from repeat performance, making an ordinary task part of biography.

Source basis: ['F2', 'F10']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/life_record.js:appendLifeMilestone; src/chronicle.js; src/save_files.js`.
Boundary: Native event plus deduplicated life milestone; optional personal best.
Acceptance: First clear writes one event, repeats improve only valid best; fresh/legacy/reload/import do not invent or duplicate deeds.

## P8: Collective work checklist

One location errand displays several concrete prerequisite tasks and pays when all finish.

Source basis: ['F10', 'F9']. Exact private installed-file/RVA anchors are in FINDINGS.json.
Native mapping: `src/data/locations.js (Village); src/data/dialogues.js; src/life_record.js`.
Boundary: Native quest conditions and center actions, not six new currencies.
Acceptance: Order independent checks; remaining tasks listed; completion latches only after local reward succeeds; offline/local play identical.

## Shared delivery gate

Choose one accepted proposal, inspect current owning source before edits and keep vanilla optionality. Any persistent data uses an additive optional schema with an explicit migration: legacy saves begin empty, completed history is not invented. Rebuild and exercise missing/partial/success/repeated/retreat/defeat paths from a fresh browser origin, then save, reload and import. Native coins/items remain authoritative. No external Steam achievement or stat service belongs in this browser RPG. Preserve unrelated work and private saves.

Purchase ordering in F3 debits the currency before checking destination stock retrieval. YAIR adaptation must use an atomic local transaction; this is a deliberate correction, not a claim the source purchase is atomic.

## Small touches

| ID | Original touch | Source finding | Native mapping |
| --- | --- | --- | --- |
| T01 | Show the missing tool in the blocked action label | F4 | `src/field_ui.js / location center action` |
| T02 | Swap required-item text for a success receipt after placement | F4 | `src/event_feed.js / inventory action` |
| T03 | Keep completed mechanism clickable for a short remembered response | F4 | `src/data/dialogues.js / location state` |
| T04 | Reward first completion once | F4 | `src/life_record.js:appendLifeMilestone` |
| T05 | Display every offered item contribution before committing | F6 | `src/items.js / crafting requirement preview` |
| T06 | Mark an already counted category as supplied | F6 | `src/crafting_recipes.js / component preview` |
| T07 | Show remaining load in ordinary units | F5 | `src/field_ui.js / encounter status` |
| T08 | Acknowledge removal with a short event | F6 | `src/event_feed.js / undo placement command` |
| T09 | Latch solved state even when items subsequently leave | F5 | `src/save_files.js / optional encounter completion` |
| T10 | Use threshold wording rather than implying an exact recipe | F5 | `src/field_ui.js / condition text` |
| T11 | Add a visible low-resource warning before failure | F8 | `src/field_ui.js / existing resource readout` |
| T12 | Show full and empty supply states on the same item | F8 | `src/items.js / ordinary consumable description` |
| T13 | Explain one-use refill before spending | F8 | `src/items.js / consume action` |
| T14 | Use one warning per threshold crossing rather than every tick | F7 | `src/event_feed.js / encounter notification` |
| T15 | Let retreat retain explicitly documented preparation | F12 | `src/data/locations.js / connected location action` |
| T16 | Explain reset scope on retry | F12 | `src/field_ui.js / retry label` |
| T17 | Keep first clear and personal best separate | F2 | `src/life_record.js / milestone and encounter result` |
| T18 | Hide optional challenge timing until requested | F2 | `src/field_ui.js / display choice; MainMenu timer field declaration only` |
| T19 | List supply price alongside quantity obtained | F3 | `src/data/traders.js / native trade row` |
| T20 | Explain why supplies cannot be afforded without debiting | F3 | `src/data/traders.js / purchase rejection` |
| T21 | Show each collective task check independently | F10 | `src/field_ui.js / native quest checklist` |
| T22 | Turn a staged action into ready/missing/completed text | F9 | `src/data/locations.js / center action` |
| T23 | Pair a hit event with health change for clarity | F11 | `src/event_feed.js / native combat event` |
| T24 | Use a small authored variant pool with a stable committed choice | F12 | `src/data/locations.js / encounter variant` |
