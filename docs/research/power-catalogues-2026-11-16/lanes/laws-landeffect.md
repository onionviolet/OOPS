# Lane: laws-landeffect (PSA27, revamp row 4)

Register status: Proposal (AD32). Agent-verified, not human-reviewed. Branch `claude/laws-landeffect-769de5`, not merged, not pushed.

## What was wrong

PSA7 and PSA17: the Gu working law emitted `{kind, magnitude}` labels and the spell law emitted a `spell.verb.object` label beside its sentence. C4 read 4 and C1 read 41. Findings from reading the code first:

- The spell law already emitted `{sentence, details}` and the engine's `land()` already sends that to `landEffect`. Its gap was reachability: `spell_law` is not imported from `main.js` (PSA24 owns wiring), so no played life ran it. The label was redundant.
- The Gu law emitted no sentence, so `landEffect` returned `label-only`. The one played Gu-to-W joint was a closure in the contest bridge (`guBridge`, `gu_liquor_worm_run`) that read `kind === 'damage'`.
- The C4 meter counted `kind:` strings, including law ids (`'spell.effect'`) and kernel role kinds (`kind: 'gu'`). Renaming ids would break saved working records, so the meter was changed instead (a measure fix, separate from the progress claim).

## Advisor review (recorded before building)

The advisor said: (1) fix the meter to count a law's effects with no sentence reading, name it as a measure fix, rewrite the baseline only after numbers fall; (2) find the played paths first, because the headless walk is the real gate; (3) check the wire-packs branch for collisions; (4) keep `kind` on rows and effects (about 30 consumers branch on it; retiring it is Weibao's call) and attach `sentence` plus `details.amount` from one small table, reusing `GU_FUNCTION`/`ABILITY_VERB` where layering allows; (5) do C1 as a separate structural step, swapping only callers that read `outcome`, `effects`, `remaining`, `reason`. All five were followed. `check:arch` allowed `src` to hold its own table, so the table lives in `src/gu_effect_sentence.js`; `world_packs/gu_effect_pack.js` still carries its own `GU_FUNCTION` (a duplicate to fold in after PSA24 lands).

## What changed

- `src/gu_effect_sentence.js` (24 lines, the `guFamilyEffects` adapter, PSA36 default): maps a Gu effect kind or function to a sentence plus `details.amount`. Default: a kind with no row stays a label and lands nothing. The activate and treat operations in `gu_working_law.js` attach it. Kinds without a row (`essence-converted`, `grow-leaf`, `gu-emerged`, composite moves) remain labels on purpose: reserves and leaves live in law facts, not W.
- `src/spell_label.js` (4 lines, the `spellLabels` adapter): the old kind label derived from the sentence.
- `contest_packs/gu_world.js` `guContestEffects` reads the settled sentence (`remove vitality`) instead of a kind label; `gu_liquor_worm_run` uses it.
- `src/world_packs/spell_charm_run.js`: a played Hogwarts host ("Hogwarts · Lumos" in Capability runs, home hero or an HP life). It runs `spell_law` through the engine and the host lands the sentence, so `light:wand` rises. Registered in `capability_runs_domain.js` (no `main.js` line). PSA24's branch also edits that file (one-line merge conflict expected).
- C1: 13 callers moved from `resolveGuActivation` to `runGuActivations` (they read outcome, effects and remaining, nothing else). Callers that read `.activations`, `.id` or `.attemptedFunding` were left. One try (`gu_vitality_grass`) broke `gu_workshop` (targetDamage 0) and was reverted unexplained; a follow-up could add an `activations` pass-through to `runGuActivations` and move the rest.
- `scripts/compression_report.mjs`: C4 evidence for guFamilyEffects is now "catalogue ability kinds with no sentence row"; spellLabels is "a spell kind label literal written in spell_law". Baseline rewritten after the numbers fell: C1 41 to 28, C4 4 to 2.

## Evidence

- Headless Game MCP, fresh life seed 7 on this worktree's rebuilt bundle, Capability runs: Lumos took light 0 to 4 (spell law, then `landEffect`); a Moonblade spar took Fang's essence 12 to 8 and the partner's vitality 100 to 70 (Gu law sentence, then the contest bridge). Light 4 survived save, reload, export and a fresh-origin import. Not exercised after reload: the Gu run's partner vitality (same engine save slice, no new save key).
- Save state: the capability-runs slice gains a `harry` run key. Old saves load (a missing key means "not begun"). No migration needed.
- `landEffect` lands a Gu treat sentence on vitality in `tests/effect_laws_land.test.js`.

## Gaps, said plainly

- The Gu effect reaches the world through the contest bridge, which resolves guards and layers before applying; it is not `landEffect` itself. `landEffect` lands Gu sentences in the test and in hosts that pass a target; that is the default, and widening it is the next step.
- `spell_law` is still unreachable from `main.js` except through the new run. PSA24 should replace this host with its Workshop run's spell action when it lands.
- `kind` labels remain on both laws. Retirement of `guFamilyEffects` and `spellLabels` is Weibao's decision (PSA36).
