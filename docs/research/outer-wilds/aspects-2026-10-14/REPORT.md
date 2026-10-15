# Outer Wilds, community New Horizons contracts: research report

All twelve aspects were assessed; the priority reads are dialogue, architecture and persistence. Vanilla source/save format/parser/AI, full dialogue and DLC text, exact completeness algorithm, full dynamic timing and runtime UI remain unread. Community contracts do not stand in for proprietary behavior.

No install is needed for the inspectable public contracts. No installation or gameplay was performed. Research findings and all proposals below are unaccepted.

## Ranked PROPOSALS

| Code | Proposal | Owning system |
|---|---|---|
| P1 | Typed dialogue condition lifetimes | `docs/worlds/DIALOGUE_AND_INTERACTIONS.md` |
| P2 | Profile-bound extension compatibility | `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md` |
| P3 | Additive topic validation | `docs/worlds/DIALOGUE_AND_INTERACTIONS.md` |
| P4 | Evidence-linked return questions | `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` |
| P5 | Deferred condition evaluation | `docs/worlds/CAMPAIGN_FRAMEWORK.md` |

## Prior dossier reconciliation

| Code | Fresh result | Prior finding disposition |
|---|---|---|
| F1 | Scope refinement to prior F13: OWML supplies storage, but New Horizons also owns a profile-keyed save.json for custom known signals/frequencies, unread fact IDs, popup receipts and talked-to characters. This is extension data, not the vanilla save format. | See Corrections at top of ASPECTS.md; prior owner unchanged |
| F2 | The schema and guide expose both loop-local and persistent dialogue mutations. Knowledge-only progression in the shipped adventure must not be generalized into a prohibition on persistent author-defined conditions in community content. | See Corrections at top of ASPECTS.md; prior owner unchanged |
| F3 | No fresh contradiction found for the prior rumor/explore graph. Vanilla completeness, proprietary parser and normal shipped timing remain outside this public-code read. | See Corrections at top of ASPECTS.md; prior owner unchanged |

See [ASPECTS.md](ASPECTS.md) for cited evidence and [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md) for the three highest-payoff additions. The [private work area](/Users/weiwei/.codex/research/bf-public-other/) retains pinned public source, selected full pages, hashes and extracted dialogue tables where available. No source or prose was reused in YAIR gameplay.
