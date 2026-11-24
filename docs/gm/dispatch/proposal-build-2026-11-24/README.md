# Proposal build lanes (2026-11-24)

Coordinator: Claude session (Gu blockers). Source: [reconciliation](../../../audits/PROPOSAL_RECONCILIATION_2026-11-24.md) build list B1–B5 and Q1–Q4, answered by Weibao: "Start all of them up till Q5" ([vision log](../../USER_VISION_LOG_2026-11.md#proposal-reconciliation-q1q4-answered-b1b5-started-2026-11-24)).

| Lane | Items | Model | Owned files |
|---|---|---|---|
| A, Gu kinds | B1 (kind leads), B2 | Codex Sol, medium | `docs/coverage/gu_kinds.jsonl`, `chapter_tier_labels.json`, `wiki_tier_labels.json`, `lane-a/` here; minimal fold-script edits listed in its report |
| B, Gu moves | Q4, B1 (slots), B4 data | Codex Sol, medium | `docs/coverage/gu_moves.jsonl`, `blocked_slugs.json`, `scripts/gu_move_slots.py`, `docs/coverage/evidence/gu_move_slots.jsonl`, `tests/gu_move_slots.test.js`, `lane-b/` here; minimal `gu_coverage_ledgers.mjs` edits listed in its report |
| C, investigation case | B5 | Codex Sol, medium | a new case module and test under `src/` and `tests/`, minimal `src/gu_senses.js` edits, `lane-c/` here |
| Atlas session | B3 pilot, B4 display | its own | `prototypes/world-atlas/` |

Shared rules for every lane:
- Touch owned files alone. Do not commit, stash, reset, force or push.
- No lane regenerates `docs/coverage/README.md`; the coordinator does that at landing.
- No paid API, no network. Agent reading is fine.
- Proposals, not decisions (AD32). Label each check agent-verified, not human-reviewed.
