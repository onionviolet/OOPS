# D1 input receipt (frozen 2026-10-23)

Owner: D1 dependency coordinator. Brief: [D1_BRIEF](D1_BRIEF.md). Finding: [GAP_AUDIT F1/D1](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md). Context: [CHECKPOINT](CHECKPOINT.md).
Primary checkout read at HEAD `547209e82c29e897e6b602a4ef5d8e8ab46b3ebf`. Nothing here is a behaviour change.

## Closure (grep of src and tests)

- `src/progression_gates.js` imports `./rules.js` (committed). Importers: committed `src/pledges.js`, `src/pledges_content.js` (clean at HEAD, they need the untracked module), plus `reveal_chain.js` and `chain_inspector.js` below.
- `src/skill_overflow_domain.js` imports committed `domain_registry.js`, `ui_ports.js`. Importer: `levelable_component.js`. `display.js` reads it through `domainRegistry.project('skill_overflow', ...)` (no import).
- `HERB_LESSON_GATE` and `herbLessonFacts` are defined in dirty `reveal_chain.js`; used by `chain_inspector.js` and `tests/progression_gates.test.js`. This is GAP_AUDIT F1.
- Tests: `progression_gates`, `skill_overflow`, `micro_p1_xp` (hunk), `chain_inspector` (hunk), plus pledges tests (committed, unchanged).

## Files (sha256 of primary working copy)

    path | state | sha256 | lines
    src/components/levelable_component.js |  M | a813ed42b198f435a197eeb8646b798d2d71aa6f2ab54a6dfa8329992e373702 |      357
    src/display.js |  M | b8c3dbf0cf97ba93da963cd655eea8df82ffd64ba9f45a1512d24dab17b145fe |     6717
    src/reveal_chain.js |  M | 467b840551d0a0b191b25a2dbb584ad9fe8c93722777bcd0184bdfcd76b958fa |      145
    src/chain_inspector.js |  M | edbda4a5a177d959b44e88909c545a9da47ab70c460afd55bd3c1247a39345b6 |      106
    src/chain_inspector_ui.js |  M | c0f94b730e18ac1e1443117a6c21f4aada63caf9337d8ea1e88137c78f65406c |       66
    tests/micro_p1_xp.test.js |  M | d39935b55885b5ffd805fb8c88ae96660ad5f074c474702f8d7386367bf7c027 |       64
    tests/chain_inspector.test.js |  M | 86bf219c0ee7d3954dd06116420b922e5b716138d22bbaa68b557cecf89978c1 |       58
    src/progression_gates.js | ?? | 3e7cf4951422a89006120887da6f68723ba9fcb7a99b91913a406605de2157d4 |       71
    src/skill_overflow_domain.js | ?? | c4157ab7d7b49f8c79446d7494dcf2e34966bc61004777529af05f0b2b4d4072 |       62
    tests/progression_gates.test.js | ?? | 7ba437e03dd2a60c3cbf1be2b34fa385092fa6e083e6a5974102d2d753e3a6cc |       54
    tests/skill_overflow.test.js | ?? | c6ed52a36c88647c1ea810bde8a2ccbd679c36557f1c2efb7aa5be85df55cb2c |       50
    docs/PROGRESSION_GATE_RULES.md | ?? | b745b94b13bd4372292dbf5b6c3873a1995ed0a7eb038a3bdbf2e21eb93d46b4 |      196
    docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md | ?? | 0f4e2ca367b69b777daa33093aacc26b6a6b9ebea64fdd1acae85b3f18c44dc3 |      147

State ` M` = tracked, dirty; every dirty hunk of the seven tracked files is a gate hunk (GTL2, GTL3, GTL6) and is in the package as a patch. State `??` = untracked, whole file. Docs hashes differ from the CHECKPOINT table because the two docs grew after it was written.

## Excluded (other owners, named)

- Shared-doc hunks: `PROJECT.md`, `docs/USER_VISION.md`, `docs/RULES_INDEX.md` (overarching-reconciliation / parent reconciliation).
- `dist/bundle.js*` (generated), LOTM `src/book_world_lotm_*`, gear workshop files, Qud and O/F/A paths, and all other dirty files in the primary tree.
- Docs cited from the rulebook (`docs/worlds/progression-gates-2026-10-23/*`, other audits) are documentation only; not needed for code closure.
- Existing overarching-reconciliation artifacts `r3-*` are a competing candidate; D1 does not use them.

Reproduce: apply `d1-package/patches/ALL_TRACKED.patch` to HEAD and copy `d1-package/files/*` (package built from this receipt).
