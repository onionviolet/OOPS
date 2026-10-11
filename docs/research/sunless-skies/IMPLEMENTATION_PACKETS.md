# Ranked implementation proposals

All entries are **inferred**, original YAIR options. Ranking orders this audit's proposals, not the games. None is an accepted decision or permission to build. Existing owners must be rechecked in the live dirty tree before implementation.

## P1 Separate a person's reset from what the world remembers
- Evidence: F1,F2,F8,F9. North star: Same player; events.
- Existing owners: world_visit_history.js, chronicle.js, causal_story_core.js, life_record.js.
- Proposed play: One completed local public project survives succession; the new person has their own identity, invitation and trust. Add a continuity receipt explaining which flag persisted and who can observe it.
- Dependencies and boundary: Per-world retention and migration; persistent world flags cannot silently carry every personal relationship.
- Acceptance: Complete a bridge, end an opt-in test life, reload/import: bridge persists, personal trust does not, and the receipt cites the old deed.

## P2 A usable inherited estate with named losses
- Evidence: F1,F3-F5,F20. North star: Heirs; lone wolves.
- Existing owners: life_experience_host.js, components/inventory_component.js, npc_lives.js, life_record.js.
- Proposed play: Offer a world-defined storage/entrustment route with disclosed custody, losses and recipient. If a safety loan or replacement exists, identify its actual provider rather than calling it inherited property.
- Dependencies and boundary: Accepted actual-left-behind inheritance; native defeat stays recovery. Requires atomic ownership transfer and compatibility.
- Acceptance: Banked test tool transfers once; a destroyed field tool does not. A replacement is visibly a loan with an obligation, preserved across reload/import.

## P3 Danger leaves a remembered aftermath
- Evidence: F16,F17. North star: Events/storyteller.
- Existing owners: simulation.js, chronicle.js, life_record.js, causal_story_content.js.
- Proposed play: An opt-in expedition crisis can be survived while leaving a specific later disturbance with its own responses. Immediate dread and enduring consequence are distinct facts.
- Dependencies and boundary: Use common clock and durable outcomes; no mandatory psychological meter or global horror rule.
- Acceptance: Surviving one crisis opens one later consequence at the recorded due time; two responses resolve it differently without duplicate rewards or rerolls.

## P4 Thematic event pools with separate timers
- Evidence: F11-F13. North star: Events and storyteller.
- Existing owners: simulation.js, simulation_content.js, simulation_ui.js.
- Proposed play: Prototype one local hardship pool and one curiosity pool, each with eligibility, interval and a saved draw. Show why an event appeared. Player-facing previews never roll.
- Dependencies and boundary: Reuse existing seeded simulation checks; pacing budget/adaptive mood remains optional future work.
- Acceptance: Two pool timers run independently, stop under their world's pause policy and produce identical next choices after save/reload/import.

## P5 Desperation broadens the emergency menu
- Evidence: F14,F15. North star: Ordinary life; events.
- Existing owners: simulation_effects.js, components/inventory_component.js, crafting_recipes.js, existing center actions.
- Proposed play: A dangerous travel job can consume ordinary provisions first, then let the player spend edible cargo, barter, request aid or retreat. One unfamiliar substitute leaves a clearly stated aftereffect.
- Dependencies and boundary: Actual inventory categories, clock/stop conditions and costs; no borrowing Skies' fatal rules for vanilla routines.
- Acceptance: Normal food exhausts; three inventory-dependent responses appear with accurate prices. Chosen response spends once and logs its aftereffect.

## P6 Records unlock a new person's growth
- Evidence: F8,F10. North star: Same player; heirs.
- Existing owners: adventure_notebook.js, life_experience.js, npc_lives.js, simulation.js.
- Proposed play: An inherited authored notebook unlocks an apprenticeship or study choice, with a new character's own interpretation. No automatic transfer of old raw stats.
- Dependencies and boundary: Record provenance, recipient knowledge and instructional time; progression route exists only in a supporting world.
- Acceptance: The correct book unlocks a study option, a missing book does not; study changes only the evidenced technique and records the new author's interpretation.

## P7 Cost and success are separate story facts
- Evidence: F11,F17. North star: Storylets; events.
- Existing owners: simulation.js, simulation_effects.js, simulation_ui.js.
- Proposed play: One negotiation spends a declared fee on attempt; success can be compromised or incur a second disclosed consequence. Preview makes payment-on-attempt clear.
- Dependencies and boundary: Native validation/atomic durable command; do not infer source Branch implementation is a safe reusable engine.
- Acceptance: A failed attempt pays the advertised fee once; successful and compromised results differ; reload/import preserves receipt and chosen outcome.

## P8 One-time discovery relief with recoverable history
- Evidence: F18. North star: Events; ordinary routines.
- Existing owners: chronicle.js, world_visit_history.js, simulation.js.
- Proposed play: A new safe stop gives relief once and writes a witnessed discovery. Recurring relief uses an explicit cooldown. Inheritance may preserve the map without treating the new person as its eyewitness.
- Dependencies and boundary: Separate character evidence from map/world records; cooldown obeys world clock.
- Acceptance: Repeated visits give no duplicate first-discovery reward; cooldown expiry gives the recurring relief once; receipt survives reload/import.
