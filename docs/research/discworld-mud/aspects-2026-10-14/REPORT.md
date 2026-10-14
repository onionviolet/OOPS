# Discworld MUD research extension

Discworld connects conversation to language, visibility and real commands. Its historical save path reconstructs owned objects and can preserve a recovery receipt when reconstruction fails.

The useful new evidence is conversation admission, retained versus derived state, and explicit action/UI boundaries. Historical distribution v20.0 mirror, pinned 8c8619c; not the complete modern server. LPC source and prior official help/archive dossiers. Full modern dialogue catalogue, save-driver encoding and omitted domains remain unavailable.

All recommendations are PROPOSALS. No runtime implementation or accepted decision. No game was launched, downloaded code run, personal save opened, account used, install changed, git staged, committed or pushed. Only assigned aspect folders and asp-text scratch were written. Desktop first; one realm/one prestige remains the milestone; no fixed solo once restriction is adopted.

## Ranked PROPOSALS

| Code | Proposal | Owner | Observable gate |
|---|---|---|---|
| P1 | State-changing conversation with language and audience checks | `docs/worlds/DIALOGUE_AND_INTERACTIONS.md` | Two actors receive different eligible replies; one reply changes a real action; reload/import preserves its consequence. |
| P2 | Recoverable object reconstruction | `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md` | Missing/retired item leaves a stable recovery record and no duplicated inventory on save/reload/import. |
| P3 | Contextual ambient story sequences | `docs/CHARACTERS_AND_WORLD_EVENTS.md` | Idle and combat contexts select distinct valid beats; absent actors do not leak knowledge; pending beat resumes safely. |
| P4 | Author-side dialogue trace | `docs/ENGINE_AUTHORING.md` | Show trigger precedence, failed predicate and action receipt for one authored NPC without exposing sealed truths. |
| P5 | Useful practice band | `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md` | Below-band, learning-band and mastered queued work each show the intended useful result and gain behavior. |

## Prior dossier reconciliation

| Code | Prior claim / area | Result |
|---|---|---|
| F1 | Base canon static-snapshot claim | Prior second pass already corrects it; no new global timeline proof. |
| F2 | Dialogue unknown | Extended with response_mon event guards and monster story dispatch, historical only. |
| F3 | Save outline | Extended with autoload inhibition, effect freeze and item receipt fallback. |
| F4 | Current teaching numbers | Retain prior current-help versus historical-code distinction. |

## Evidence and limits

[Twelve aspects and precise sources](ASPECTS.md), [machine rows](ASPECTS.json), [system inventory](SYSTEM_INVENTORY.md), [three deeper systems](DEEPER_SYSTEMS.md), [packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [tooling](TOOLING.md) and [checkpoint](CHECKPOINT.md).

Proposed owner edits: coordinator may link this extension, retire superseded summaries according to the prior reconciliation, and select a bounded proposal. This lane changed no owner. Province War may cite this dossier through its coordinator; no registration or gameplay integration is claimed.

Status: PARTIAL. All required artifacts exist; unavailable source/build and exhaustive semantic/runtime gaps remain named in CHECKPOINT.
