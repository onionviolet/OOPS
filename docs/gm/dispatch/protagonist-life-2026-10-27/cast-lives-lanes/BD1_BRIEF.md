# Lane brief: BD1, body, sleep and meal bridge (MF1 L7)

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. **Your mandate is paragraph "L7" in [MF1_AUDIT](MF1_AUDIT.md) section D2 (grant, mechanism,
default/dial/reason, target, tests, conflicts), plus the carriers it cites in F3.** Read F1-F4 of that audit first, then [H2](H2_CHECKPOINT.md), [D2](D2_CHECKPOINT.md), [T2](T2_CHECKPOINT.md) for the pack-driven command pattern
(adapter in its own file, pack field read like `householdActs`/`topicTalks`, host registration as a prepared patch, validator lookup patch, UI disclosure with perspective tag), and the reviewed rows' relevant gap paraphrases
(private `reviewed-rows-2026-10-29/*.jsonl`) for what the paragraphs actually do. Rules: `.claude/rules/runtime-code.md` AR1-AR16, AD36, AD38, AD43, AD45, MD1-MD3, CLR1-CLR13; MR1-MR36 for making; keyed draws (LSD139);
default/dial/reason, no blanket never/always/only. Publication: public code and tests use synthetic ids and generic words; canon-bearing rows stay private. Sealed secrets: by id only.

## Scope

- Files owned: exactly the audit's grant for L4 (`src/cast_body_adapter.js`, `tests/cast_body_adapter.test.js`, `cast-lives-lanes/MF_BODY_CHECKPOINT.md`) plus `cast-lives-lanes/BD1_INTEGRATION.patch` (host registration, state validator lookup and UI hunks as prepared patches; the coordinator applies them),
  and `DV1_CHECKPOINT.md` pointing to the audit checkpoint file. Read-only for every other src file. Another src lane may run in parallel with a disjoint grant.
- Deliver the audit's first slice, not the whole family: the bounded chain it names, with a failure case, a conservation or isolation test where the audit lists one, and save/reload/Export/Import through the real validator in a disposable copy
  (the D2/H2 test pattern; do not apply already-integrated patches).
- Include the pack row schema (generic words) and a synthetic example in the test; a Luna lane will generate canon rows afterwards.
- Absent means silent (CLR4); no invented stock, prices, outcomes or results the paragraph does not support.

## Done check

Focused tests; `npm run check:arch` no growth; lane review with your grants; checkpoint with FLR lines, below-floor statement, and the pack field name, row schema and registration steps for the row lane. One line per check.
Ambiguity default (CLR12): where an owner system is missing, record the effect as a fact and name the owner needed.

Lessons from DV1 and MK1 (apply them): (1) your tests' disposable-copy fixtures must run against the **live integration** when the integration patch is reverse-clean (`git apply -R --check`) and apply it only when it is not yet integrated, so they keep passing after the coordinator applies the patch; (2) new UI data families need perspective tags in `src/perspective_controls.js` (prepare that hunk in the patch and add the matching case to `tests/perspective_controls.test.js` expectations if it pins families); (3) rows must be JSON-safe: no `undefined`, no empty `requires` arrays, `null` for unknown fares/amounts, and run the real native registry check in a test; (4) another src lane runs in parallel with a disjoint grant and also prepares host hunks: the coordinator rebases whichever lands second, so keep your host hunks minimal (one registration site) and say which lines you touch.

(5) **AD2 lesson:** the first-slice adapters were too strict (RW1-RW3: 0 rows of 300; after AD2's relaxation inference gave 56 rows of 150). Make every requirement the book does not state **optional** (default, dial, reason): unknown costs, stages, amounts and prior evidence are `null`/`unknown`, never blocking and never invented; effects without a native owner become a named fact ("owner needed"). Also write `src/cast_*` adapters so that the reviewed-row merge (`scripts/lead_run/merge_reviewed_rows.mjs`) can accept your kind later: state the pack field name and row shape in your checkpoint.
