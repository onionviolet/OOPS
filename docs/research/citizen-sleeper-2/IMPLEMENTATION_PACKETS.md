# Citizen Sleeper 2 implementation packets

Every P row is an **inferred** original proposal. Rankings apply only to these options. They are not accepted decisions or authorization to implement. Existing owners below were read in this session; support is source-inspected, not newly runtime-verified. Each option belongs to an opt-in locale and leaves the original opening/defeat intact.

## 1. P1: A single opt-in crew contract with preflight and an honest commitment ledger

Evidence: F7-F9/F20 in [FINDINGS.json](FINDINGS.json).

Proposed play: Reserve one helper, fuel and supplies for a local salvage job; show skill fit, stress, repair access and known exit conditions before leaving.

Mapping: `src/simulation.js previewSimulationCommand / commandParticipants; src/simulation_contracts.js participant reservations; src/event_feed_ui.js`.

New work / limit: New bounded multi-phase contract state and preflight view; existing jobs do not establish a full contract framework.

Acceptance gate: Pick a helper, reserve resources once, depart, face one objective and one crisis, return or fail; no duplicate helper work or double rewards after save/reload/import.

## 2. P2: Progress toward the salvage objective while a separate crisis grows

Evidence: F9/F11 in [FINDINGS.json](FINDINGS.json).

Proposed play: Offer repair-the-leak or keep-salvaging; preventing escalation changes the outcome of the same job.

Mapping: `src/simulation_effects.js progress/event effects; src/simulation.js common-clock boundaries and events`.

New work / limit: Authored pressure track, phase-dependent eligibility and explicit tie ordering. Do not create a second timer.

Acceptance gate: Objective and pressure remain distinct; crisis resolution stops future pressure, skipped crisis leaves a specific consequence; test objective/failure boundary tie and persistence.

## 3. P3: A helper changes both work and the remembered story

Evidence: F7/F15 in [FINDINGS.json](FINDINGS.json).

Proposed play: A mechanic contributes an eligible method and comments on the result; another recruit has a different approach and concern.

Mapping: `src/simulation.js target/participant availability; src/simulation_effects.js relationships/knowledge; src/life_record.js`.

New work / limit: Two bounded authored identities and conditional dialogue, not a general NPC society. Crew dice need new state only if that mechanic is selected.

Acceptance gate: Each helper supplies a distinct eligible action, cannot work in two places, has individual aftermath, and is remembered after reload without invented prior history.

## 4. P4: An original overclock option trades temporary output for later repair risk

Evidence: F2/F6 in [FINDINGS.json](FINDINGS.json).

Proposed play: One construct may deliberately overclock a tool to improve a specific job while adding a disclosed strain liability.

Mapping: `src/energy_resources.js reserve/strain policies; src/simulation_resolution.js weighted outcomes; src/simulation.js frozen command commits`.

New work / limit: Current energy use rejects excess strain; it does not implement stress-dependent damaged dice. Author one compatible hazard, or add reviewed durable die health only for a chosen dice slice.

Acceptance gate: Preview benefit and strain, commit once, use the actual overclocked effect, show the resulting repair liability; reload cannot repeat the benefit or evade the spend.

## 5. P5: Two repair materials buy different aftermath

Evidence: F4/F5 in [FINDINGS.json](FINDINGS.json).

Proposed play: A rough patch uses common scrap and leaves a recoverable fault; a careful service uses a rarer component and fewer faults.

Mapping: `src/simulation_effects.js inventory/condition/knowledge effects; src/character_bio.js`.

New work / limit: Authored component recipes, actual fault effect, truthful duration and recovery route. A fault label alone is not gameplay.

Acceptance gate: Each recipe consumes its inputs exactly once, changes a specific capability, shows the next remedy, and survives save/reload/import; partial damage policy is explicit for this body.

## 6. P6: The same world offers distinct recovery policies

Evidence: F13 in [FINDINGS.json](FINDINGS.json).

Proposed play: A local scenario can offer a gentler recovery mode and a harsh mode whose terminal consequence is clearly disclosed before entry.

Mapping: `src/simulation.js campaign transitions; src/life_record.js; existing character bio`.

New work / limit: New local policy data and compatibility decision; do not change vanilla defeat or existing saves. Source difficulty names/numbers are not proposed YAIR defaults.

Acceptance gate: Opt-in generated saves show different recovery outcomes and an explicit policy-change route, with original native defeat preserved; imports retain the selected policy and consequences.

## 7. P7: A docked helper performs one bounded support routine

Evidence: F10/F19 in [FINDINGS.json](FINDINGS.json).

Proposed play: Choose salvage, food or fuel support; the helper works only while docked and stops at capacity, unavailable inputs or a waiting choice.

Mapping: `src/simulation.js programs/controllers/shared calendar; src/simulation_effects.js inventory/resources; src/event_feed_ui.js`.

New work / limit: One authored helper controller and explicit local away policy. Next-cycle random support is not automatically an offline simulation.

Acceptance gate: Assign a focus, reserve helper time, observe actual produced resources and stop reason, depart without duplicate production; save/reload/import and offline behavior follow the declared local rule.

North-star mapping: P1/P2 to work, events, idle/offline and original-panel UI; P3/P7 to followers and local people; P4/P5 to construct starts and body capabilities; P6 to each-world rules and explicit consequences. No option requires all worlds to use crew stress, dice damage, permanent glitches or corporate ownership. These seven may be selected independently; only one playable slice should be started if authorized.
