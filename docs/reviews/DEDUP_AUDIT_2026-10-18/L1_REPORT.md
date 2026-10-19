# L1 report: X1 + X3 shared leaf helpers and hash/RNG (2026-10-19)

Structural change only (AR9). Branch `worktree-agent-ac52ddffa4e1deb75`. Direction owner: SYNTHESIS.md X1/X3; this report is execution evidence, not new authority.

## What moved

- New `src/basics.js` (zero imports): `check natural positive finite object copy copyJson deepFreeze deepFreezeUnlessFrozen sameJson sameStructural eq eqNoReason eqRaw eqRawReason gte all allTruthy any not`. Variants exist where a drifted form is a real, separate meaning (see Drifts), each named for what it does.
- New `src/hash_rng.js` (zero imports): `fnv1a hashStreamSeed xorshift32 mix32`. `seeded_streams.js` re-exports the three old names (same function objects); `simulation_resolution.deriveSimulationSeed` is a re-export of `hashStreamSeed`. `simulation_contracts.js` now re-exports `assert record natural finite copy` from basics (same export names, 200-plus importers untouched).
- Inline copies replaced by leaf calls: simulation.js (hash, draw), expansion_engine.js (draw), causal_story_host.js (hash, draw), feature_expansion_battle.js and party_battle.js (random), chronicle.js, mixture_state.js, anchor_snapshots.js, start_records.js, npc_lives.js. Each is provably the same arithmetic; `tests/basics_leaf.test.js` compares the leaf against verbatim copies of the old bodies (empty and astral strings, signed and unsigned seeds).
- 236 files had byte-equivalent local declarations removed by a codemod that parses each top-level statement, normalizes parameter names and match-checks against the canonical bodies (rule-builder parameter names are not renamed because they are emitted keys). Declarations migrated: natural 86, check 110, object 41, copy 26, sameJson 20, all 59, eq 51, not 23, positive 13, eqNoReason 12, deepFreeze 15, any 8, sameStructural 8, deepFreezeUnlessFrozen 5, copyJson 5, eqRaw 5, eqRawReason 5, finite 4, allTruthy 3, gte 3. Together with the hand-edited hash/RNG files and the two leaves, the commit changes about 245 files.
- Build: esbuild still bundles `src/main.js` (5.85 MB minified, per-binding tree shaking); nothing in dist is committed.

## Not touched (ownership or contract)

main.js, trade.js, simulation_effects.js, display.js, save_files.js (L3 baselines), book_world_mol_* and book_world_paradise_* (L2), tests beyond the new leaf test. `src/gen_kit.js` keeps its private `natural` and `mix32` because `tests/gen_kit.test.js` asserts the module has no `import` at all; importing the leaf would need that test relaxed (a decision, not a dedup).

## Drifts left in place (do not merge without a behavior decision)

- `object`/`record` that return the operand (`v && typeof v === 'object' ...`): 21 declarations in 3 forms plus `record` 12 in 7 forms (absorb_* lanes, backlog_expansion_*, seeded_streams, others). Falsy input returns null/0/'' not false; a caller using `=== false` or storing the result would change. Plain-prototype variants (customization_profiles, realm_cargo, realm_traveler_profiles, tag_store, world_instances, cheat_cards) are a stricter meaning.
- `check` with a message prefix or default (household, leisure_memory, management/validation, generated_people, life_record, village_career, npc_lives, story_requests, lore_history_state), `assert` with `TypeError` (effect_dsl), `fail` with three meanings (throw fixed text, throw argument, return `{ok:false}`) in absorb_* and craft_*.
- `same`: canonical-stringify forms (backlog_expansion_transit, realm_cargo, contextual_balm_native), cooling_refinement_facts structural form with different inner names, `expansion_engine.sameData` (prototype-aware), plus unrelated functions named `same`. S2-F6 asks whether key order should matter per validator; left for Weibao.
- JSON validators with depth limits 16/24/30/32 (S2-F7) and `JSON.parse(JSON.stringify())` vs `structuredClone` per file were not unified; only exact `copy`/`copyJson` bodies moved.
- `eq` in three other shapes (value forced true, always-emitted `reason`, a matcher in structured_expedition_runtime), `gte` with reason (11), `all` with reason aggregation (lever_lesson), `finite` (3 variants), `integer` with ranges (3), `freeze` over Map/Set (world_pack_loader) or via a local `object` (structured_pack_definitions), `clone` in work_ledger_system.
- Effect builders `money item know stamina af` not migrated: S3-F1 stamina `(amount, actor)` vs `(actor, amount)`, `know` default stage `seen` vs `understood`, `item` argument orders. They need a design decision on a scoped builder factory.
- `gen_kit.hashLane` (all UTF-16 units, deliberate) and start_records mulberry32 stay local. Stable-ID regex copies (reserved-name list varies) not migrated.

## S4-F10 combat hit/evade math: not unified

The three places are not the same computation:
- `models/combat.js` real roll: attack_points times alive-opponent exponent and tag-skill hit modifiers times `encounterHooks.attackPointsMultiplier`, against `agility * evasion modifier * sqrt(intuition)`.
- `combat_readout.js`: hit uses fighter `attack_points` against the first attacker's `evasion_points`; skill loop runs only when `includes_player && !is_attacker`; shield read from the fighter.
- `ui/combat_display.js update_defender_stats`: hit uses `dexterity * sqrt(intuition)`; skill loop runs whenever the player is among the attackers; shield read from `attackers[0]`; no encounter hook.
Different stat inputs, alive-count bases and shield sources, so picking one would change rolled or displayed numbers. The `get_hit_chance` double import route (misc.js re-export vs combat_math.js) was left because rerouting could delete a baselined cycle edge (L3's baseline file).

## Checks

- Baseline before: `npm test` 2226 tests, 2222 pass, 1 fail (`crafting_native_reload`: "gathered lots and crafted products survive native Save and reload with writable saving"), 3 todo.
- After: `npm test` 2234 tests, 2230 pass, 1 fail (same test), 3 todo. The 8 added tests are `tests/basics_leaf.test.js`.
- One intermediate full run failed `gen_kit.test.js` "kit imports no runtime owner" after gen_kit imported the leaf; gen_kit was reverted and that test passes.
- `npm run check:arch`: unchanged (7 main imports, 297 cyclic edges, line baselines unchanged). Both leaves import nothing (asserted in the new test). `npm run check:rules` PASS, `npm run check:rule-behavior` pass. esbuild parsed all changed files and bundled main.js.

## Gaps

No browser run: the change is structural, but the roughly 245-file edit has no browser acceptance pass (implemented-unverified for UI paths not covered by node tests). Codemod output was reviewed by sample diff, parse check and the suite, not line by line.
