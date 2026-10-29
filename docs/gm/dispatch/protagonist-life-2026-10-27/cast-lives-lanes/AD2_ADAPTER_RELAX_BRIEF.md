# Lane brief: AD2, relax the three first-slice adapters to what the paragraph reviews actually show

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Rules: `.claude/rules/runtime-code.md` AR1-AR16, AD36, AD38 (mechanisms, not allowed-outcome lists), AD43, AD45, MD1-MD3, CLR1-CLR13.
"Write constraints as default, dial and reason" (AGENTS.md design framing): a requirement the book does not state must be optional, never a blanket demand. Publication: public code, synthetic ids, generic words.

## Why

Paragraph reviews RW1 (divination, 100 steps), RW2 (making, 100) and RW3 (inference, 100) found **0 admissible rows of 300**, because the first-slice adapters (DV1, MK1, KN1) require things the book does not state:
- RW1 ([RW1_CHECKPOINT](RW1_CHECKPOINT.md)): 52 gaps "source-supported native payment missing" (the divination query demands a negative native cost on every attempt; unknown costs must not be invented, but also must not block the query), 26 gaps where the rite changes
  sleep, protection, objects, bodies, progression, location or communication (effects outside the query seam), 12 "complete ordered query not established" (preparation or intention without every stage).
- RW2 ([RW2_CHECKPOINT](RW2_CHECKPOINT.md)): 71 "no mechanism": ritual/projection/boundary/mental-context owner 40, document/message/inscription/destruction owner 26, equipment/fixture/tactical or travel state 19, physical preparation without native item/material bindings 10.
- RW3 ([RW3_CHECKPOINT](RW3_CHECKPOINT.md)): 86 "no mechanism": the inference adapter requires evidence + inference + intention with exact observer-held evidence, but most source steps are single thoughts or recalled results with no earlier evidence record.

## Scope

- Files owned: `src/cast_divination_adapter.js`, `src/cast_making_adapter.js`, `src/cast_inference_adapter.js` and their three test files; `scripts/lead_run/merge_reviewed_rows.mjs` and its test (accept the three new kinds `divination`, `making`, `inference` with their pack fields `divinations.queries`,
  `making`, `inferences.chains`; validate through the real adapters); `cast-lives-lanes/AD2_CHECKPOINT.md`. Host registration stays as integrated (no new host hunks unless a pack field read is missing; if one is, prepare `AD2_INTEGRATION.patch` and write fixtures that do not apply patches, per TH1).
- Divination: payment optional. A query with no stated cost has `cost: null` (displayed "cost not recorded"), still consumes time and records attempt identity; a stated cost still debits natively. Rite side effects are listed as `effects` of existing owner types (fact, knowledge, condition, relocation only where the existing native effect supports it);
  an effect with no owner becomes a named fact ("owner needed") rather than a gap. A partially known ordered rite is allowed with unknown stages marked `unknown`; absent means silent.
- Inference: allow a one-step chain (observation/recollection to belief) and a postponed intention with no prior evidence record when the source states the lead's own present perception or recollection (observation basis labelled `recalled`/`witnessed`);
  keep the guard that nothing is believed that the lead could not know, no truth disclosure and the downstream gate for intentions.
- Making: allow a physical-preparation row without full native material bindings as a place-act-like timed act with consumed stock only where seeded; for message/document/inscription/destruction produce a document-handling act that records the knowledge of the action and the object fact (no delivery semantics); equipment/fixture rows stay gaps (H2/CU1 own those).
- Keep all existing tests passing (existing behavior for fully specified rows byte-identical). Add tests per relaxed rule including a failure case and save/reload through the real validator (live integration; no patch-applying fixtures).
- Then re-run the merge script check on synthetic reviewed rows of the three kinds.

## Done check

`node --test` on the three adapter tests, `tests/merge_reviewed_rows.test.js`, `tests/perspective_controls.test.js`, `tests/place_acts.test.js`; `npm run check:arch` no growth; lane review; checkpoint with before/after: how many of the RW1/RW2/RW3 gap reasons each relaxation is expected to convert
(counts from their jsonl `gapReason`), and what remains a true gap. Ambiguity default (CLR12): when an owner is missing, record a named fact and say which owner.
