# Original YAIRPG implementation proposals

Unselected proposals. No source dispatch or gameplay completion. Reuse the existing single durable publisher, actual inventories, frozen job costs and actor ownership; read current owners again before implementation. Target UI: 1440 × 900 laptop, readiness and consequences visible in parallel panels. Mobile optimization deferred. One realm/one prestige milestone and optional cultivation remain unchanged.

## P1: Skilled work supplies a trial application

Owner: RESEARCH_CULTIVATION_PATHS.md, ENGINE_EXPANSION.md, TRIALS_AND_TRIBULATIONS.md. Incumbent: `src/techniques.js` staged practice; discovery policy; current jobs and inventories. Gap: this pass did not locate a profession-earned application bound to an optional realm trial.

Journey: a character completes a real herb preparation job. Its valid receipt earns knowledge of a recovery application. The same character can instead learn a guard application by supported practice. At an optional trial, the selected application changes a concrete recovery or defense outcome. Declining spiritual entry leaves the work and ordinary reward useful.

State: actor-local earned evidence, method identity, understood application, capacity and trial preparation. No XP for merely opening a panel; no retroactive guessing from high skill numbers. A queued legal practice can advance while idling where its conditions remain true. Resource debit and retained rewards go through existing job/effect transactions. Interruption retains only actually earned progress.

Compatibility: additive empty defaults for old saves; no silent conversion of existing profession XP into realm progress. Gates: two naturally earned preparations yield different useful outcomes on a freshly rebuilt origin; failure has a stated recoverable result; retry/reload cannot double-settle the same transaction; Save/reload/Export/literal Import retain evidence and choice. Keyboard and 1440 × 900 proof required. Cost: medium, because the new application needs a real consumer.

## P2: Repair changes a shared place

Owner: CHARACTERS_AND_WORLD_EVENTS.md and ENGINE_EXPANSION.md. Incumbent: `src/agreed_duty_host.js` and content/fact owners already schedule repair, lesson and ordinary work; keep those rather than building a second duty engine. Gap: a facility condition consistently gating resident teaching, service stock and useful access requires a scoped read/consumer audit.

Journey: request a supported repair using actual timber/tools and an NPC's agreed work time. After completion, the workshop gains one usable lesson/service. The teacher keeps other commitments; no global friendliness reward substitutes for repaired access. An alternative ordinary job stays available.

State: place condition, custody of materials, agreed duty/job identity, actor availability and earned unlock evidence. Accepting the duty is separate from finishing it. Do not consume supplies twice or conjure new stock from a UI change. Interruption preserves the existing host's settlement policy.

Compatibility: additive facility state with no automatic restoration/reward for older saves. Gates: before/after availability differs for a cause the journal explains; materials and finite slot are spent correctly; unavailable teacher prevents booking; interrupted work has supported resume/refusal; Save/reload/Export/literal Import preserve condition, custody and commitment. Cost: medium; prove existing seams first. Source lesson: SchoolDevelopment rewards unlock classes and trade rather than only prestige text.

## P3: A friend stays, then can leave

Owner: CHARACTERS_AND_WORLD_EVENTS.md; household/place owner and engine. Incumbent: durable actor identities, current duty facts and continuity owners. Gap: this read did not establish a native voluntary guest-stay state tied to real housing and continuing actor activity.

Journey: a known friend agrees to stay when a room and compatible schedule are available. Shared meals or conversation reveal a habit and may create an attributed gift from their actual holdings. They continue supported work. Either participant can end or renegotiate the stay; future invitations remain reachable when circumstances permit.

State: invitation, consent, room occupancy, arrival/departure commitment, per-actor stay days and supported repeat content. Romance is an optional separate relationship if the world supports it; roommate does not mean spouse. Do not turn source IsOnce flags into universal limits. A gift requires real custody or a supported production/acquisition route.

Compatibility: old saves default to no guest, with no inferred partner. Gates: refusal and acceptance both work; guest presence changes one actual interaction; conflicts prevent double-booking; departure clears occupancy without deleting identity/relationships; restay is possible; Save/reload/Export/literal Import retain pending invitation, current stay and departed state. Cost: medium/high, because presence, consent and scheduling must join.

## P4–P7: Bounded follow-on options

| Code | Existing owner and incumbent | Proposed missing consumer | Later done check and compatibility |
|---|---|---|---|
| P4 | Characters/engine; agreed duties and actual custody | One named specialist travels/works for a requested supply bundle and returns an attributed result | Real reservation/time/stock; no duplicate result after reload; decline/interruption routes; additive empty request queue. |
| P5 | Cultivation/techniques; staged practice | A paid lesson improves a particular stat/application under current capacity | Access, attendance, payment and cap separate; advancement later expands capacity; Save/reload/import; no inferred old lessons. |
| P6 | Ability authoring/engine effects | One selected blessing modifies one named process | Before/after causal receipt, expiry and stacking source; missing resource still blocks; retained effect duration; old saves no blessing. |
| P7 | Characters/scheduler/UI; retained actor facts | One appointment or story event changes a known actor's supported whereabouts | Actor-specific conflict/resume rules, earned location clue, no omniscient map; reload/import preserve override; old saves retain incumbent schedule. |

These are alternatives and joins, not seven mandatory implementation gates. Province-war readers may use P2/P7 for institutional access and presence, but this dossier supplies no verified war model. No tests/builds/browser/save or director acceptance were run for these proposals.
