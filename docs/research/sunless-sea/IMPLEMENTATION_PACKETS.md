# Ranked implementation proposals

All packets are **inferred**, original YAIR options drawn from the cited findings. Rank orders proposals within this audit, not games. None authorizes implementation or changes accepted rules. Source filenames below are existing YAIR owners inspected or inventoried; interfaces must be rechecked by the implementer.

## P1 Surviving-estate receipt
- Evidence: F3-F5,F14. North star: Heirs; Same player; lone wolves.
- Existing owners: `src/life_experience_host.js`, `src/chronicle.js`, `src/components/inventory_component.js`, `src/life_record.js`.
- Proposed play: At an authorized life end, list actual assets, records and obligations with surviving/destroyed/unclaimed status. Transfer only via the world's chosen carriers. Optional will protects defined holdings; no blanket Sea-style stat percentage chosen.
- Dependencies and boundary: Migration and atomic old-life/new-life transfer; cannot treat existing one-lesson heir as this feature.
- Acceptance: Create a test estate with one intact item, one destroyed item and one unclaimed record. Preview, accept, reload and import show exactly the same receipt with no duplicated assets.

## P2 Visible story locks and consequence receipts
- Evidence: F9,F13. North star: Events/storyteller.
- Existing owners: `src/simulation.js`, `src/simulation_effects.js`, `src/simulation_ui.js`, `src/causal_story_ui.js`.
- Proposed play: Extend one existing Village story with hidden, visible-locked and eligible branches; each lock names the relevant evidence and each result names the spend and state change. Success may discover a costly truth.
- Dependencies and boundary: Reuse native durable command path and saved RNG; no second quality engine.
- Acceptance: A poor and a qualified character see different availability. Chosen outcome changes exactly one story stage and consumes exactly the stated cost; reload/import preserves it.

## P3 Prepared continuation without blood heirs
- Evidence: F1,F8. North star: Lone wolves; Same player.
- Existing owners: `src/chronicle.js`, `src/life_record.js`, `src/npc_lives.js`, `src/adventure_notebook.js`.
- Proposed play: Optional apprentice, entrusted weapon or discoverable journal route. Identify the carrier and new recipient separately; recipient is allowed to refuse. Sea's rival link is inspiration, not proof that all rivals inherit.
- Dependencies and boundary: Concrete actor/ownership evidence and world policy; successor-choice design remains a proposal.
- Acceptance: A journal left behind can be claimed by the intended finder; absent/ruined journal grants no knowledge. Refusal leaves a recoverable unresolved claim.

## P4 Threat thresholds with several responses
- Evidence: F11-F13. North star: Events/storyteller; ordinary life.
- Existing owners: `src/simulation.js`, `src/simulation_content.js`, `src/chronicle.js`.
- Proposed play: For an opt-in dangerous expedition, fatigue or dread opens response stories: rest, supplies, persuasion or retreat. Selected successful responses can carry costs.
- Dependencies and boundary: Use existing clock/stop conditions; native defeat remains recovery; no automatic offline death.
- Acceptance: One threshold opens one pending story, time stops under the chosen routine policy, responses spend once, and reload does not reroll or duplicate the event.

## P5 Teach a person, preserve a person
- Evidence: F6-F8. North star: Heirs with their own lives.
- Existing owners: `src/npc_lives.js`, `src/simulation.js`, `src/life_record.js`.
- Proposed play: One apprentice's visits or gifts record real instruction and develop a specific preference; they may pursue a path different from the teacher's.
- Dependencies and boundary: People facts and actual elapsed time, not a new genealogy simulator.
- Acceptance: Two different teaching choices yield different remembered lessons; departure records their goal and preserves previously taught content without granting unrelated knowledge.

## P6 Keep world marks separate from fresh-life stories
- Evidence: F3,F17. North star: Same player; events.
- Existing owners: `src/world_visit_history.js`, `src/chronicle.js`, `src/causal_story_core.js`.
- Proposed play: World-scoped completed bridge or discovered route survives where world policy allows; personal invitations and attitudes begin fresh unless carried.
- Dependencies and boundary: Schema split and compatibility; exact world persistence chosen per world.
- Acceptance: After succession the bridge remains, the new person is not trusted automatically and their notebook cites the source of any inherited route.

## P7 Preview a retirement before ending a life
- Evidence: F14,F15. North star: Life beyond first character.
- Existing owners: `src/chronicle_ui.js`, `src/life_experience_host.js`, `src/life_record_ui.js`.
- Proposed play: A reviewable ending view shows consequences, inheritance and unresolved work before an explicit ending action. Review itself spends nothing and advances no time.
- Dependencies and boundary: True ending is opt-in; existing defeat stays intact.
- Acceptance: Open/close preview repeatedly without mutation, then end once and reload/import with identical successors and history.
