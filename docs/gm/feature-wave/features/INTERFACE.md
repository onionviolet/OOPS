# Feature-wave callable interface v1

2026-10-05. Features GM owns this interface and sole existing-file integration after Frontier release. Specialists retain their assignment paths. Reuse current expansion5, simulation1–4 and native durable publisher; no renderer/load enrollment.

## Pure module inputs and output

- Definitions export ordinary `people`, `sites`, `powers`, `sources`, `encounters`, `commands`, `controllers`, `situations` arrays as supported by `simulation_contracts.js`. Use stable prefixed IDs and retained definition revision1. Return only demanded arrays; all existing registries remain the integrator's responsibility.
- Host functions accept `(state, registry, context, expectedSequence = state.sequence)`. Context is the live `expeditionContext`: actor/world, facts, external native coins, gameplay stock/XP/reputation snapshot, vitals, ownership, skills/tools/location/access and `busy`. Derive additional facts read-only. Missing native queries fail closed. Preview uses the same facts/eligibility as commitment.
- Commands accept explicit IDs/target/choice and call existing simulation/acquisition/native planners. Return a staged plan `{state, external, gameplay, vitals?, acquisitions:[], unlocks:[], nativePatch?, ownership?}` or the existing compatible plan shape. No localStorage, live-native mutation, independent timer, event loop, payout, XP or inventory manager. Publication is exclusively `persistExpansion`/`persistExpansionPlan` in main.
- Long work uses existing frozen jobs/participant/site reservations. Mixed plans reserve only their next legal step and require a validating optional versioned cursor if saved. Current clock and unsupported-absence freeze remain authoritative.
- Native combat uses existing native Combat/combat_math and actual per-fighter native stats/vitals, saved session/RNG/action/sequence. Additional actions/targets require a real native host binding, validated optional payload and exact stale/session checks. Never infer fighters from player stats.
- New destination is explicit opt-in. Native mutable location/quest/shop/calendar/people/stock owners must be individually bound and serialized through the one envelope, with entry/exit/revisit and local absence clock policy. Same-body traveler conserves actual cargo/custody; no implicit character reset.
- Views return only observable player facts/knowledge plus legal blocked action explanations. UI factory uses current native Notebook parent and callbacks to integrator commits; render is read-only and has no RNG. Hidden truth/unknown future outputs stay hidden.

## Return and integration queue

Write per-lane `INTEGRATION.json` with actual paths/exports, exact existing-file imports/registry/host/validator/save/UI/native joins, activation, IDs, versions/absent defaults, clock and publication policy. `DELIVERY.md` records input/output hashes, syntax/import/link checks and deferred gameplay/save/failure/keyboard/regression/director checks. Do not stop at detached definitions: repair named consumer gaps in reserved modules until usable through the declared joins. Existing-file joins are Features GM-owned.

All new gameplay is implemented-unverified. No commits/push/publication/automation/private-save or source-library mutations.

## Frozen destination/Ink binding queue

Selected original reversible destination: world `feature.tidemark`, instance `feature.tidemark.harbor`; native locations `Tidemark landing` and `Tidemark terraces`. Stable residents `tidemark.keeper` (Nessa) and `tidemark.wright` (Venn). Independent native quest `tidemark.sluice_agreement`, source/method `tidemark.counterweight`, site `tidemark.sluice`. `state.featureDestination` optional schema1; absent means no destination enrollment. Same native player body/bag, no second prestige. Local twelve-minute tide phase advances only during an active visit; absence freezes. Full export/admission receipt follows worker final files.

Commands freeze `tidemark.chart/open/enter/return/terrace/landing/meet/accept/decline/timber/lesson/balance/collect/buy_log/buy_kit/salvage/supply/cancel`, plus local custody `tidemark.borrow_kit/return_kit` being completed. Player knowledge keys `tidemark.chart/meeting/agreement/refusal/method/repair/settlement/returned/supply`. Only observed earned values enter Ink. Public place name is known after chart/entry; residents after meet. Definition import does not disclose them.

Ink host bridge proposal admitted: `begin`→meet; `ask_terms`→known meeting/agreement terms (explicit no reward); `material`→supply one actual log to keeper; `coin` and `teach`→paid lesson (two actual coins, paired resident purse); `borrow_tool`→keeper's finite native kit custody loan; `refuse`→decline; `leave`→return; `revisit`→enter. The final callable bridge maps only supported actual IDs and rechecks location, consent, native ownership and sequence. Repeated lesson/material claims must stay under their existing command owners; Ink never invents payment or duplicate rewards. An unknown/unavailable route remains undisclosed or truthfully blocked.
