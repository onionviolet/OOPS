# Folded Glasshouse scene review

2026-10-04. Bounded read-only source review; sole reviewer write is this report.

Reviewed `src/pocket_realm_scenes.js` SHA256 `518181a5081c1504f3996c4c5cab0385fb06ea45805a14371304d20fe5215aa2`, including the parent's corrected instance patch keys, supervised-template requirement, actual `glasshouse` group and closure-planner metadata. Read live AGENTS, PROJECT resume, capacity/succession and dialogue checkpoint before review. Existing dirty work was preserved.

## Findings

No additional actionable findings in the current detached definitions. This is a static semantic review, not runtime acceptance.

- Paid work reserves two actual caretaker coins at start and publishes the two native coins only with completion (`src/pocket_realm_scenes.js:65-74`). The existing effect/reservation/refund contracts retain the selected actor on both debit and refund (`src/simulation_effects.js:71-75`, `:137-143`, `:274-277`; `src/simulation.js:119`, `:164-179`). Supervised template availability is now an explicit actual-owner predicate (`src/pocket_realm_scenes.js:66-67`, `:217-221`).
- Private research costs Joss's owned kit, stamina and coins; its result belongs to Joss's knowledge and its command audience is only Joss (`src/pocket_realm_scenes.js:53-55`, `:102-107`). The offered-report route creates a distinct attributed player record (`:108-112`). Existing player log projection filters private audiences, and the scene view reads only the observer-supplied knowledge (`src/simulation.js:170-172`; `src/simulation_ui.js:89`; `src/pocket_realm_scenes.js:235-242`).
- Detection and notice require an active actual faculty, supported body, anchor and live sample/return path (`src/pocket_realm_scenes.js:113-123`). Their source grant is a master-selected proposal, not automatic acquisition (`:206-213`, `:229`). Stored speech is recollection, while replay has no cost or effect and live cooperation requires current contact support (`:57-58`, `:61-64`, `:124-131`). The pack adds no second person, inventory, purse or source owner.

## Declared integration dependencies

These are explicit missing master bindings, not defects in a claimed working runtime API:

- Instance patch mapping, actual played-clock and template predicates, caretaker memory/disclosure, and qualified live incoming/return-channel facts (`src/pocket_realm_scenes.js:204-205`, `:214-226`). Channel facts must represent the actual selected trace/recipient, body/source/anchor and paid boundary support; replayed records cannot satisfy them.
- Explicit registry/Notebook integration and NPC listener acquisition. The base `field.load_step`/`field.drive` and Glasshouse repair/study/template actions remain their existing owners (`:206-230`; `src/pocket_realm_content.js:133-177`; `src/field_workshop.js:42-77`).
- Observation closure and departure are unavailable draft choices with null command IDs until the master binds the real planners, costs and durable publisher (`src/pocket_realm_scenes.js:176-191`, `:227-229`). The shutter now names `planRealmClosure` operation `close` and explicitly selects the live-observation connection role; `close_observation` remains only a draft-binding ID.

## Checks executed and gate

Executed `node --check src/pocket_realm_scenes.js` successfully, including after the final metadata refinements. Direct ES-module import and `createPocketRealmScenes()`/JSON serialization succeeded, producing 15 commands, four families, Joss `glasshouse.main.caretaker` and the expected four-field `pocket.folded_glasshouse`/`glasshouse.main` endpoint. The final import confirmed that player commands use the actual `glasshouse` group. Confirmed the reviewed source SHA256 after the parent's corrections.

No source, engine, registry, bundle, private save or source-book writes. No scenario, unit/regression suite, browser, save/reload or failure-injection execution. The module remains detached implemented-unverified. Gate: parent integrates this report and the engine master binds the declared owners/contracts before later playable acceptance checks.
