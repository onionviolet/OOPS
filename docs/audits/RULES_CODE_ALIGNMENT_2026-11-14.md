# Rules code alignment, 2026-11-14

Task record for the code half of the [status reconciliation](RULES_STATUS_RECONCILIATION_2026-11-14.md#code-still-on-the-old-defaults-implemented-rule-changed). The rule text changed in 94a842dcd; this slice changes the code that still enforced the old limits. Built from the [preflight card](../gm/PREFLIGHT_CARD.md).

## Preflight

| Field | Fill in |
|---|---|
| Reading | Bring four code paths in line with the limiting lines Weibao opened on 2026-11-14: grammar checks flag by default, `pays` and the spread rank, pacing and openings targets can be exceeded with a stated reason, and the spell vocabulary comments cite the first known consumer. No player-facing surface changes; the player is Weibao. |
| Authority | Weibao, 2026-11-14: "go ahead for all of them" (RSR answers). LLR39 to LLR42, LLR47, LLR48, LLR49 in the [limiting lines review](LIMITING_LINES_REVIEW_2026-11-10.md); AD38, AD5, AD56. |
| Player sentence | n/a, because no screen text changes. A generated thing that used to be refused for a source-range rule now assembles, with the flag in its receipt. |
| Ordinary route | A check rule flags. Exception: a rule that states a world law declares `severity:'reject'`, with its dial as the opening (for example `living-target` and `mindedObjects`). |
| Mechanism | `assemble` sorts each check into flags or violations by the rule's severity; shape failures (missing-part, too-many-parts, bad-shape) stay violations. `checkEffect` marks each row `gate:true|false`; pays is a report row, and `keepSpread` subtracts `weights.pays` (default 1) per whole point underpriced. The pacing and openings ratchets read a per-start reason and report that miss instead of failing it. |
| Fit | Extends PGC4, PGC5, PGC17 (`docs/PROCEDURAL_GRAMMAR_CONTRACT.md`), PAC3 and PAC4 (`docs/PACING_RULES.md`), OPN2, OPN5 and OPN7 (`docs/OPENING_RULES.md`), and EF2 (`docs/PROCEDURAL_FOUNDATION_PLAN.md`). No new seam. |
| Ring | Producer and consumer: the grammar gate, its callers and the effect pipeline. Failure: receipts name each flag. Persistence and UI: none touched. |
| Rule codes | PGC4, PGC5, PGC17, PC73, PAC3, PAC4, PAC5, OPN2, OPN5, OPN7, OPN9, EF2, LLR39 to LLR42, LLR47 to LLR49, AD5, AD38, AD56, AR1 to AR16 (runtime code) |
| Files | `src/procedural_grammar.js`, `src/spell_grammar.js`, `src/effect_grammar.js`, `src/effect_checks.js`, `src/gu_move_generation.js`, `src/spell_effects.js`, `scripts/check_pacing.mjs`, `scripts/check_openings.mjs`, their tests, this record. Own worktree branch only; no push. |
| Failure scenario and checks | Flipping the default could silently loosen a world law, such as a spell that stuns a board. Caught by `tests/spell_grammar.test.js` (canon refusals), `tests/effect_grammar.test.js` (`verb-object`), and the new flag-versus-reject case in `tests/procedural_grammar.test.js`. |

## Decisions in this slice

| Code | Decision | Reason |
|---|---|---|
| RCA1 | **World laws declared `reject`:** `sentence-runs`, `target-fits-verb` and `living-target` (spell grammar); `verb-object` and `carrier-cost` (effect grammar, also used by the Hogwarts effect pack). | `sentence-runs` is shape (PFP16, generated means runnable). The others are canon or property laws with a dial that opens them (`mindedObjects`, `anyCost`). |
| RCA2 | **`carrier-cost` stays `reject` while the spell grammar's `carrier-pays` stays a flag.** | They read alike but are different laws. `carrier-pays` checks a carrier's *usual* account; a transfer between worlds may pay differently (AD56). `carrier-cost` checks the world's own account table for that carrier, and its `anyCost` dial opens it. If Weibao wants it a flag, he flips one field. |
| RCA3 | **The canon test still counts an unknown closed-slot value as a gap.** | Assembly lets it through as a flag (LLR47). But `canonTest` exists to list what the vocabulary lacks, so a canon row that uses an undeclared value still fails the rebuild and appears in `missingRules`. The proof grammar keeps 87 rebuilt and lists `unknown-part:path`. |
| RCA4 | **Pays rank is whole points.** An underpriced candidate scores `ceil(price - amount)` times `weights.pays` lower. | Archive scores must be safe integers (`archiveOffer`, gu move generation). |
| RCA5 | **`keepSpread` reports what it leaves.** It returns `left: [{id, score, niche, reason}]` beside `kept`. | PGC17: the spread reports and ranks, it rejects nothing. |
| RCA6 | **Exceedable codes in openings:** `prose-wall`, `long-block`, `first-action-late`, `first-payoff-late` and `dead-stretch`. `no-action`, the refusal-reason codes, `engine-reason`, `foreign-place` and `no-effect-choice` stay failing. | The LLRs opened budgets and press counts, not defects. No start has a stated reason yet; `EXCEEDS` in the openings script and `exceeds` on a pacing `TARGETS` row are where they go. |

## Receipt

| Line | Record | Gate |
|---|---|---|
| FLR1 Build | n/a: no bundle-facing behavior; `npm run build` not run | floor |
| FLR2 Route | n/a: library and check-script code, exercised by unit tests only | floor |
| FLR3 Shown | n/a: no player surface | floor |
| FLR4 Used | Existing consumers: `gu_move_generation.js` (gate and score), `exploreEffects`, `searchEffectsForGoal`, `spell_invention.js`, `canonTest` | floor |
| FLR5 Kept | n/a: no save keys touched | floor |
| FLR6 Labelled | Agent-verified by tests, not human-reviewed; implemented, below floor (no browser route, because nothing player-visible changed) | floor |
| Change surface | No core-owner files; no new imports between modules except `gatesPass` from `effect_checks.js` into `gu_move_generation.js`, an existing edge; zero new cycle edges (`check:arch` PASS) | FND2 |
| Checks | See below | AD36, RSR P2 |
| Not covered | The pacing and openings full runs (`npm run check:pacing`, `check:openings`) were not played; only their pure ratchet functions are tested. No start states an exceedance reason yet. | AD43 |

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/procedural_grammar.test.js tests/grammar_search.test.js tests/spell_grammar.test.js tests/effect_grammar.test.js tests/gu_move_generation.test.js` | 46 pass, including new flag-versus-reject, unknown-part flag and pays-as-rank cases | |
| `node --test tests/pacing_check.test.js tests/openings_check.test.js` | 24 pass | pure ratchet only, no game boot |
| `npm run test:changed` | Selected 224 files (nearly the suite, because `procedural_grammar.js` and `spell_effects.js` reach most of the game); the run was killed (exit 144) right after load gating released it, with no results | Not rerun whole; the merge gate's full `npm test` covers the 201 files that only reach the changed modules through imports |
| `node --test --test-concurrency=4` on the 23 files `test:changed` lists as importing or naming a changed module | 299 tests: 298 pass, 0 fail, 1 skipped (the pacing recorder smoke, gated on `YAIRPG_PACING_BOOT=1`) | |
| `npm run check:arch` | PASS (exit 0) | |
| `npm run check:rules` | PASS (exit 0); one pre-existing stale-glob warning in `.claude/rules/research-and-agents.md` | not this task's |
