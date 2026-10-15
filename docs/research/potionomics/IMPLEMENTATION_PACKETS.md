# Implementation packets: PROPOSALS

These extend the existing [cross-game packets](../cross-game-synthesis-2026-10-14/PACKETS.md). No implementation authorization, owner transfer, new framework or accepted design change. Recover live writer and current source before executing. Keep all reasonable later options reachable; no lifetime-once lesson cap.

## PO1 / P01: Forecast and actual batch result

Owner: `docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md`, `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`. Current seams: `feature_expansion_work_plan.workPlanView`, `mixture_ui`, `mixture_native.stageMixtureAction` and `commitMixturePlan`. Source already retains held inputs, remaining batches, cancel and shortage messages. Missing gap to confirm: whether the latest authoritative useful result and next shortage can be read together without losing the current job.

Proposed slice: one existing Village panel displays current accepted job, reserved stock, due time with units, latest actual result and exact next missing input. Never synthesize an old receipt from current balance. A forecast is labelled separately from the actual result. Potionomics supports this distinction through forecast widgets versus craft-result rows, not proof of YAIRPG behavior.

Start projection-only with no save fields. If an authoritative receipt is missing, stop that expansion at an explicit optional schema revision: old saves mean no historical receipt; do not backfill rewards. Use the current domain publisher and retained job identity. No new work engine, automatic offline time, or donor discard loss.

Acceptance: rebuilt fresh 1366x768 origin shows useful completion, next shortage, supplied-stock resume and cancel; held inputs and net available stock remain truthful. Faulted publication pays nothing and keeps prior state. Save/reload/Export/literal Import at pending and changed-positive states retains the real job and receipt if the schema changes. Re-render and retry cannot pay twice. Native proof and human layout acceptance remain distinct.

## PO2 / P02: One stock, two real destinations

Owner: `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`, `docs/ENGINE_EXPANSION.md`. Current seam: `mixture_native.quoteMixtureAction` and two supported domain consumers, to be named from live source. Round 5 rejects a second engine and imagined readers as grounds for a shared abstraction.

Proposed slice: select one finite owned input batch; show two real useful quotes with exact inputs, expected product/use, time and stock left after either. Require actual custody and units. Both quotes read the same stock; committing one invalidates the other. Recipe familiarity, stock ownership, station eligibility and quality are separate facts. Unknown composition or undiscovered destinations remain observer-qualified.

Persistence: reuse exact material identity and existing inventory shape. Do not invent averaged chemistry for legacy goods. Preserve current resolver revision; add fields only with an explicit absent-default or refusal decision. Costs and results publish together through the current host transaction.

Acceptance: natural acquisition, competing A/B quotes, choose A, stale B refusal, reacquire then choose B, useful downstream use of both outputs, and a missing-station control. Save/reload/Export/literal Import preserves consumed and held stock without duplication. Desktop 1366x768 shows both quotes together; mobile deferred.

## PO3 / P03: Social lesson to usable method

Owner: `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md`, `docs/SKILLS_AND_TALENTS.md`. Seams: `audited_workshop_lesson.auditedLessonFacts`, `techniques.techniqueFacts`, existing lesson host binding. Confirm the exact currently unmet lesson-to-use consumer before editing.

Proposed slice: one teacher interaction, with real availability and a paid time/material quote, grants or advances an existing technique; immediately offer a useful original application. Show learned, practiced and currently usable states separately. Friendship may unlock an offer; romance is optional and does not own technique usability. Equivalent study/manual routes remain reachable later, not claimed present in Potionomics or required for this slice.

Persistence: retain knowledge independently of the physical teaching object. Reward idempotency is per supported occurrence, not a lifetime once gate. Do not add a second card library or skill registry. Migration must specify absent fields before any new saved knowledge shape.

Acceptance: teacher available/unavailable controls, insufficient payment, valid payment, changed knowledge, useful application, loss of the book without amnesia where supported, and stale/repeated response no double charge. Pending and changed-positive save/reload/Export/literal Import required for changed persistence. Rebuilt desktop browser and separate human feel review.

## PO4 / P19: Paid response and later terms

Owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`, `docs/CHARACTERS_AND_WORLD_EVENTS.md`. Existing `ink_narrative.commitInkNarrativeAction`, `ink_scene_content.inkBindingFor`, current native host command and durable publication own the transaction.

Trial one original conversation where a paid attempt can fail, then a later supported offer reads the retained outcome. Quote resource and risk before commitment; failure has a useful recovery or different next action. This later-offer rule is a YAIRPG proposal because the donor's direct relationship/offer consequence was not established. No card battler dependency.

Acceptance includes successful and failed paid choices, truthful changed continuation, downstream reader, stale sequence/clock/scope rejection, faulted durable write retaining prior stock, and pending/changed-positive literal save roundtrip. All outcomes recur only through new supported occurrences. Keep sealed YAIRPG truths within their discovery route.
