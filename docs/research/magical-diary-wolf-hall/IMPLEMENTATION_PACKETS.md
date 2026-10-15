# Proposed implementation packets

Unaccepted proposals only. Reuse live P03, P19 and P04 contracts in `docs/research/cross-game-synthesis-2026-10-14/PACKETS.md`; their owners remain authoritative. No new completion gate is imposed by this research. All future UI gates target 1366×768 with costs, blocker and next action visible together; mobile deferred. All future proof uses a rebuilt fresh test origin; persistence changes require Save/reload/Export/literal Import.

## MD-P1: One learned method, several real uses

Owner: `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md; docs/SKILLS_AND_TALENTS.md`. Packet: P03. Disposition: Adapt.

Scope and payoff: Join one existing lesson and self-study route to the same actor knowledge and an actual field action. Different route costs, same usable method.

Cost: Moderate: one knowledge consumer and two acquisition paths; no general school simulator.

Source reference: `classes.rpy:learnt_cutscene, magic_class_after_roll`; `modules/wolfhall.py:Breeze`; `spells.rpy:cast_spell`.

Acceptance: Learn naturally through teacher and self-study on separate runs, then use the same native field action. Lose the reference without losing learned knowledge. Preserve mid-study and completed progress across persistence. Teacher absence blocks only that route.

## MD-P2: Assess the solution and its side effects

Owner: `docs/ENGINE_AUTHORING.md; school-world design`. Packet: P03/P04. Disposition: Trial.

Scope and payoff: An assessment records objective, method, damage and help given separately. Physical success can differ from institutional credit.

Cost: Moderate: one original assessment with two methods and a truthful result receipt.

Source reference: `week4.rpy:exam1_give_up`; `exam5.rpy:166-200,427-480`; `exam7.rpy:501-530`.

Acceptance: Complete one objective by each supported method. Compare actual side effects and credit receipts; failure and refusal produce useful changed next actions. Persist the same result and never re-award on recap.

## MD-P3: Paid preparation changes a later conversation

Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md; docs/CHARACTERS_AND_WORLD_EVENTS.md`. Packet: P19. Disposition: Adapt.

Scope and payoff: Offer paid material, time spent preparing, and refusal; bind the later response to the actual preparation receipt.

Cost: Low to moderate: one existing staged dialogue host and a later useful continuation.

Source reference: `week9.rpy:nov_2_bookstore, nov_2_library_poems`; `week16.rpy:dec_20_assembly_choice`.

Acceptance: Pay through two real preparation routes and refuse on separate runs. Later exchange reads the paid receipt, changes a useful action, and handles insufficient funds or stale choice with zero spend. Retain payment and cursor atomically, including failed publication.

## MD-P4: Separate access rules from physical barriers

Owner: `docs/TECHNOLOGY_AND_PROGRESSION.md; docs/ENGINE_AUTHORING.md`. Packet: P04. Disposition: Adapt.

Scope and payoff: Show learned, allowed, owned and usable states independently. A rule can forbid an accessible action without deleting its capability.

Cost: Low where existing admission facts suffice; optional scoped issuer state only if missing.

Source reference: `week24.rpy:1465-1499`; `week19.rpy:1084-1119`; `spells.rpy:cast_spell`.

Acceptance: Learn, act, lose only access or means, observe the precise known blocker with no spend, regain it and act without relearning. Unknown alternatives remain hidden. Preview and queued commit use the same admission.

## MD-P5: Keep relationship quality and route commitment distinct

Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md; docs/worlds/DIALOGUE_AND_INTERACTIONS.md`. Packet: P19. Disposition: Park broader model; trial one scene.

Scope and payoff: A friendly score, a refusal, and a promise are separate facts. A failed approach can open a different supported next action.

Cost: Moderate; avoid importing the source fixed route lock or hidden score grind.

Source reference: `flags.rpy:on_damien_path`; `week9.rpy:529-593`; `week25.rpy:1227`.

Acceptance: Show a friendly-but-uncommitted state, an explicit refusal and a failed approach that changes the next choice. Revisit/load never repeats payment. Do not impose a source-like lifetime route lock.

## MD-P6: Use a weekly plan with honest failure receipts

Owner: `docs/ENGINE_EXPANSION.md; docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`. Packet: P03. Disposition: Trial.

Scope and payoff: Plan practice and recovery together; show spent time, gain, stress and the reason for a failed session.

Cost: Moderate UI/scheduler integration. Do not add source calendar restrictions or manual daily chores as universal gates.

Source reference: `wolfhall.rpy:standard_scheduler`; `classes.rpy:classroll, do_study_roll`.

Acceptance: Queue practice and rest, advance through both, show exact cost/gain receipts and a supported next action after failure. Save midway, reload/import and confirm no repeated time charge or reward. Avoid source double-draw behavior.
