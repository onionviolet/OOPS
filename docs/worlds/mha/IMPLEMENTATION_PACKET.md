# My Hero Academia implementation packet

Status: Research proposal r1, not an implementation authorization. It gives a bounded future packet for review after shared state and source gaps are resolved.

## Proposed outcome

Implement `mha.arc.route-and-rollcall` as one local rescue/work slice: a generated district has a blocked route and an incomplete roll call. Through an eligible licensed response, a civilian helper route that uses no public Quirk, or compatible support gear, the player changes actual route/rescue outcomes and retains distinct costs and observer knowledge. Civilian assistance does not itself authorize public Quirk use. Any Quirk-using route requires an actual provisional license or a separately evidenced exception applying to the actor, action, jurisdiction and time; do not rely on the wiki’s inferred Pro Hero temporary privilege. Include explicit decline and one failure/interruption case. No required named canon protagonist, combat boss, alternate realm, prestige, new persistence schema or cross-world import.

## Proposed visible result

Desktop/laptop browser at 1366x768 or wider: a district incident panel displays route state, responders actually available, the player's authority and compatible means, known versus unknown people, action costs and resulting witness report. Mobile optimization is deferred. A source edit or test does not establish playable behavior.

## Dependencies to inspect before authorization

| Concern | Existing owner to inspect | Question / missing binding |
|---|---|---|
| World and campaign state | `src/expansion_engine.js`, `src/expansion_persistence.js` | Can MHA's independent instance and selected composition persist without relabeling native world state? |
| Paid work and shared clock | `src/simulation.js`, `src/simulation_contracts.js` | Can responders, actions, deadlines, jobs and refusal use real availability and current sequence? |
| Effects and custody | `src/simulation_effects.js` | Can route, item, funds, witness knowledge and unique settlement publish atomically? |
| Power and body | `src/power_models.js`, `src/energy_resources.js` | Can one authored Quirk execute with real owner/body/target/cost boundaries, or should first slice exclude Quirk use? |
| UI and projection | current world/content UI owner | Can desktop panel show observer knowledge without leaking authoritative hidden state? |
| Save publication | `src/gameplay_publication.js` and relevant persistence | Can failed storage leave costs, route and rewards unchanged; can save/reload/import preserve results? |

Future Copy use must persist effects independently from copied access: expiration or switching ends access, but does not automatically end an already-created effect. The source example allows some non-body-restructuring effects to remain. Any slice using Erasure against mutant-type bodies must preserve the page’s tension: appendages remain while factor-dependent function may be impaired, yet another passage calls mutant fighters immune. No universal suppression outcome is established by this snapshot.

The table names inspection points, not claims of support. The current shared framework notes independent instance/absence-clock limitations; verify live source before future changes. Do not use player saves.

## Acceptance gate for a future authorized build

1. On a fresh test origin, rebuild source and open the target desktop viewport.
2. Exercise at least two valid response routes and refusal; verify distinct compatible costs, access and consequences.
3. Exercise missing authority, unavailable responder, incompatible tool/Quirk, stale sequence and interruption; rejected actions must not consume cost or publish partial effects.
4. Save, reload and import at meaningful reached states; preserve actor availability, ownership, costs, reports and unique settlement without duplication.
5. Verify no unseen cause, private Quirk condition or changed sealed truth leaks to player-facing UI.

All steps are specified, not run. Integrator ownership and compatibility decision remain open. Human acceptance of the fictional result remains separate.
