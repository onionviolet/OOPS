# D1 brief: gate dependency transfer (coordinator, Sonnet)

Owner finding: [GAP_AUDIT F1/D1](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).
Progression context: [CHECKPOINT](CHECKPOINT.md) (input receipts, owners to avoid).

## Goal

Hand the existing integration owners one coherent, reproducible source package for
the progression-gate work, so nobody copies `src/progression_gates.js` or its test
without the edits they depend on.

- O/F/A integration owner: `local_5e36e0d0-18df-4629-8f2e-088a55ee0543` (coord-ofa-2).
- Qud integration owner: `local_9fd79681-810e-4ee4-8ab3-43179024d7d2` (branch `claude/qud-integration-c0781f`).

You do not integrate for them and do not become a third integration owner.

## Steps

1. **Freeze the input first.** From the primary checkout
   `/Users/weiwei/code/yet-another-idle-rpg` (read only), list the full dependency
   closure: `src/progression_gates.js`, `src/skill_overflow_domain.js`, the
   `reveal_chain.js` exports `HERB_LESSON_GATE` and `herbLessonFacts`, every actual
   importer (`grep -rn "progression_gates\|skill_overflow_domain\|HERB_LESSON_GATE\|herbLessonFacts" src tests`;
   expect `pledges.js`, `pledges_content.js`, `chain_inspector.js`,
   `levelable_component.js`, `display.js` and their tests), and the docs they cite.
   For tracked files record the exact dirty hunks (`git diff` per path), for
   untracked files whole files, each with sha256 and HEAD. Write this as a new file
   `docs/gm/dispatch/progression-gates-2026-10-23/D1_INPUT_RECEIPT.md` in the
   primary checkout (the only primary write you make), then message the D3
   coordinator (id given to you after start) that the receipt is frozen.
   Hunks in shared files that belong to other owners stay out; name them.
2. **Verify closure in isolation.** In your own worktree, apply exactly the receipt
   package to HEAD. Run the focused tests (`progression_gates`, `skill_overflow`,
   `reveal_chain`, `chain_inspector`, `micro_p1_xp`, pledges tests),
   `npm run build` and `npm run check:arch`. Fix nothing in other owners' code;
   report gaps.
3. **Deliver.** Produce the package (patch files plus manifest) under
   `docs/gm/dispatch/progression-gates-2026-10-23/d1-package/` in your worktree, copy
   that folder into the primary checkout as new files, and message both owners
   with its path, the receipt hash and the focused-check results. They run their
   own combined gate after integrating.

At most two bounded workers, only if useful (for example one to run checks).

## Limits

No commits, push, publication or install. No overwrite of existing primary files.
No behaviour change. Do not edit LOTM, gear workshop, Qud or O/F/A-owned paths.
Report in `D1_REPORT.md` beside the package: receipt hash, files, one line per
check (command, result, gaps), messages sent, remaining gates.
