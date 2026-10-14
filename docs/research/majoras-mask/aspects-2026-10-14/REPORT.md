# Majora's Mask (N64 US): research report

All twelve aspects were assessed; the priority reads are dialogue, architecture and persistence. Full NPC/message catalog, all save fields, MM3D, gameplay/UI feel, original Nintendo editor and complete off-screen simulation remain unread. No ROM/assets were extracted.

No install is needed for the inspectable public contracts. No installation or gameplay was performed. Research findings and all proposals below are unaccepted.

## Ranked PROPOSALS

| Code | Proposal | Owning system |
|---|---|---|
| P1 | Dialogue effect and interruption receipts | `docs/worlds/DIALOGUE_AND_INTERACTIONS.md` |
| P2 | Field-by-field reset preview | `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md` |
| P3 | Remembered versus current appointment display | `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` |
| P4 | Conditional NPC destination after a promise | `docs/TIMELINES_AND_DIVERGENCE.md` |
| P5 | Validated backup recovery receipt | `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md` |

## Prior dossier reconciliation

| Code | Fresh result | Prior finding disposition |
|---|---|---|
| F1 | Attribution refinement to the prior REPORT F1/F2: readable scheduleScripts.schl is a community reconstruction language. The shipped system is bytecode interpreted by z_schedule.c; the fresh documentation explicitly says Nintendo did not use this higher-level language. Timetable behavior remains supported. | See Corrections at top of ASPECTS.md; prior owner unchanged |
| F2 | No fresh contradiction found for the prior core reset/notebook distinction. The fresh flash-save read extends F4/F7 with checksum and backup behavior. The prior report did not cover corrupt-save recovery. | See Corrections at top of ASPECTS.md; prior owner unchanged |
| F3 | No MM3D claim was refreshed. Prior remake claims remain historical wiki-level observations, not findings from this N64 source pass. | See Corrections at top of ASPECTS.md; prior owner unchanged |

See [ASPECTS.md](ASPECTS.md) for cited evidence and [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md) for the three highest-payoff additions. The [private work area](/Users/weiwei/.codex/research/bf-public-other/) retains pinned public source, selected full pages, hashes and extracted dialogue tables where available. No source or prose was reused in YAIR gameplay.
