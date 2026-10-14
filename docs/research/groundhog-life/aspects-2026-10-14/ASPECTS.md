# Groundhog Life: A01 to A12

2026-10-14. Static RESEARCH, not gameplay acceptance. Shown means this lane read source/table structure; stated means an identified prior report; inferred means interpretation. All YAIR takeaways are unselected PROPOSALS.

Source identity: Official itch v1 raw SHA2567b388cf002edd7a4cc8aec5acd31eae7d8a997bb173a9d4cc85cf79fee2b343e; later mirror v2 raw SHA256d167076ecdafa7f4c0272a66a3cf193a3f465b6f7a3af60c478bf1d8ee214f3c. Formatted copies reused.

Locators: Path readable.js is the pinned formatted file; Groundhog v1/v2 paths are defined in TOOLING.md; Immortality paths are relative to the pinned clone; Tale table names refer to the official backup. Source bodies/text and complete inventoried metadata are retained in [private work area](/Users/weiwei/.codex/research/asp-cultivation/extract/). No user saves, game launch, source/build change or account interaction.

## A01 Dialogue and conversation

Status: covered. Sources: `v1 app.pretty.js L1910-2050,L4370-4387; v2 app.v2.pretty.js L4900-4915`.

Shown: events are graphs of Node, Path, ChoiceNode and AutoChoiceNode over BasicEntity. Nodes keep executed/day/timesExecuted; paths keep selected/enabled. Selecting a path disables siblings. Auto choices set choiceMade from a callback and unlock matching branch. The lost-wallet graph has a delayed consequence; the company email branches on research level. This is event dialogue, not a simulated NPC chat planner; no speaker/portrait schema established.

PROPOSAL: a repeatable event graph with a saved choice receipt and delayed consequence; owner characters/events.

## A02 Narrative delivery

Status: covered. Sources: `v1 event graph plus pane registry L1112-1130; v2 event_dp and groundhogging L4900-4973`.

Shown: event pane expands/notifies on unlock; journal/log/history panes recall different aspects of a life. Story nodes use day/year/research locks and callbacks. v1 anomaly has alternative closure routes; v2 turns the defense/reset story into a new loop. Do not combine their endings into one build. Full narrative text is retained privately, not copied here.

PROPOSAL: future consequences cite the earlier choice and its date; owner chronicle/characters.

## A03 Implementation architecture

Status: covered. Sources: `v1 BasicEntity L270-350, saver L3452-3570; v2 module/entity inventory`.

Shown: Vue2/Vuex with webpack modules. BasicEntity registers with saver and prestiger, owns a mutable state and subscribes through dependants/locks/modifiers. update recomputes derived values and unlock notification state; serialized state is separated from behavior. Content uses constructors and callback closures. Dependency propagation is not a generic AI planner. Static inventories distinguish v1/v2 exports and entities.

PROPOSAL: persist facts and rebuild derived state in a declared order; owner engine/save compatibility.

## A04 Save and persistence

Status: covered. Sources: `v1 app.pretty.js L3500-3563; v2 app.v2.pretty.js L2890-2958`.

Shown: both serialize registered object state to JSON compressed into URI-safe text in localStorage groundhog_life_save. v1 writes version0.4.0, attempts legacy base64 then compressed import. v2 writes0.6.0, strips line breaks and uses compressed import only in the traced path. Both merge known entity state, call onLoad, update and postLoadAssert; exceptions alert and retain input in backup_save. Neither traced importer stages a whole detached candidate before mutation, so backup retention does not guarantee rollback. v2 requestSave supplements routine autosave.

PROPOSAL: preview candidate validation and preserve original input without partial live mutation; owner save compatibility.

## A05 AI and NPC behavior

Status: absent. Sources: `v1/v2 event and modifier framework; prior REPORT/ pass LATER_BUILD_SYSTEMS.md`.

Not present in the inspected design: autonomous social NPC life planning. Named people are event actors, household helpers are paid modifiers, later war ships are rule-driven targets/waves. No NPC career/marriage planner is established. This absence applies to inspected builds, not an unsupported claim about unpublished versions.

PROPOSAL: borrow delayed consequences while implementing YAIR residents through the existing characters owner.

## A06 UI and information design

Status: covered. Sources: `v1 pane registry; v2 pane registry L1196-1210, keyboard L5737-5780, keybindings module L5015-5034`.

Shown: nested career/lab/lifestyle/journal panes, later queue/health/war/loop panes, editable keybindings, pause/space and Turbo shortcuts. Later keyboard code attaches global window handlers; no input-focus suppression established in the read segment. Modifier explanations expose rate causes. No rendered desktop or focus acceptance.

PROPOSAL: desktop1440 x900 shows schedule and result causes side by side; editable shortcuts must respect text entry; owner UI.

## A07 Content authoring and modding

Status: covered. Sources: `v1 BasicEntity/createNode/createPath and lock framework; v2 module inventory`.

Shown: code-authored entity IDs, factories, lock predicates, action callbacks, modifier objects and prose embedded in webpack modules. Saver identity is the entity ID, not display text. No official mod API found. Later-build mirror licensing/provenance remains qualified; no code/assets reused.

PROPOSAL: validate stable ID uniqueness, graph references and reset policies; owner world authoring and engine.

## A08 Balance and numbers

Status: covered. Sources: `v2 app.v2.pretty.js L5435-5470,L5557-5585; prior REPORT F2-F6 and pass LATER_BUILD_SYSTEMS.md`.

Shown: later health combines age multiplier, an exponential sleep average and food quality. FiveYearAlpha is0.00135; it is an EMA, not a stored exact five-year window. Formula avg=(1-alpha)*avg+alpha*sleep, start480minutes. Named five-year label is approximate; inferred response times differ from a literal window. XP, income and reset modifiers compose through dependency stats. Prior wave and Loop Trap formulas remain build-qualified.

PROPOSAL: show habits and recent trend separately from immediate state; owner docs/LIFE_SIM_NORTH_STAR.md and body needs. Food bonuses must preserve accepted comfortable-unfed play.

## A09 Time and scheduling

Status: covered. Sources: `v1 main loop L5197-5220; v2 ExpMovAvg daily subscription and pass time-banking digest`.

Shown: v1 day is300ms with offline catch-up and age-related dilation. v2 banks offline/paused time at1/10 and spends Turbo at2x; ship arrival causes a different slow-down. Daily subscriptions update habit averages. Precise callback scheduling and offline concurrency edge cases not run.

PROPOSAL: explicit clock mode and decision pauses, no silent loss while closed; owner engine/offline audit.

## A10 Onboarding and reveal

Status: covered. Sources: `v1 BasicEntity logUnlock L321; company event; v2 pane registry and event locks`.

Shown: locked panes and dependency-driven unlock notifications stage careers/research/events. Company email checks an age-specific research condition; it is a deadline in that story, not a design mandate for all YAIR growth. Help/settings/journal remain available. No first-run duration measured.

PROPOSAL: missed learning gates point to another path or later repeat, with cause visible; owner discovery and life sim.

## A11 Little touches

Status: covered. Sources: `v2 keybindings, health explain callbacks L5435-5470; v1 home/time budget and saver`.

Shown: editable shortcuts, reason sentences on modifiers, pause/Turbo state, boost readiness, home chores, delayed wallet payoff, saved completion dates and input backup on import errors. Actual keyboard accessibility, canvas readability and input-focus behavior remain unverified.

PROPOSAL: human-readable explanations for each major rate change; owner UI and life sim.

## A12 Other systems

Status: covered. Sources: `v1/v2 inventories; prior reports and pass LATER_BUILD_SYSTEMS.md`.

Shown: daily schedule, careers, research/books, homes/helpers, happiness/spending/investments, boosts, achievements, events and reset carry; later build adds health/food/exercise, queue automation, defense waves and Loop Trap. These are two source versions, not one union build. Mirror author version/permission remains unconfirmed.

PROPOSAL: retain optional notify/pause/act automation and explicit per-skill reset causes; owner work plans and chronicle.
