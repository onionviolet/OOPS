# P1: shared combat stat semantics receipt

release=true. All P1 source/test paths below are released. P1 is no longer writing runtime source. No commit/push. Wave B may inspect/reuse this lane; release does not mean the full suite or human acceptance passed.

## Outcome and exact source area

F1: `damage_taken`, `min_damage_share` and `crit_resistance` now affect all four census alternate battle readers. `mitigateCombatDamageFromStats(values, stats, defenseModifier=0)` is the shared effective defender-input seam in `src/combat_math.js`. Native Person/Enemy damage uses the same seam. `rollCombatStrike` reads target resistance using the existing cap. Existing scalar math, random draw order, chip absolute floor, percent floor and crit cap are retained.

F2: Reused the relevant `codex/gear-shared-example` commit `2ddfdbc26` source, rather than creating a second pipeline: `src/equipment_stats.js`, Person aggregation, Enemy equipment-key/factory support and shared equipment test. Person/Enemy multiplier aggregation now retains explicit zero. Actual Hero equip/unequip and Enemy equipment_keys/init/getEquipment/readNativeFighter are exercised. Enemy content/balance, item wear changes and generated outputs from that branch were not blanket-merged.

Released paths: `src/combat_math.js`, `src/native_battle.js`, `src/party_battle.js`, `src/causal_story_core.js`, `src/feature_expansion_battle.js`, `src/models/person.js`, `src/enemies.js`, `src/equipment_stats.js`, `tests/combat_effect_semantics.test.js`, `tests/equipment_stats.test.js`. Exact final hashes: [release.json](P1_EVIDENCE/release.json). Starting HEAD `b0af7db5bd21770ca603fdf1e7b865b376f46857`; current HEAD is recorded there. [baseline.json](P1_EVIDENCE/baseline.json) records clean reserved source hashes; [candidate-inputs.json](P1_EVIDENCE/candidate-inputs.json) records every copied tracked/unignored input, provisional hunk and runtime fixture additions.

Rules: AR1–AR16; AD1/5–8/15–18/22/32–38; CBR11/17–19; ESD1–6. No rule or save-schema change. No general buff framework, new campaign, balancing pass, hot composition/UI/crafting edit, personal save access or extra agents. Source move/default behavior and the selected defensive change have separate regression assertions.

## Four-reader disposition

| Census reader | Disposition and retained local policy |
|---|---|
| B1 `native_battle.js` | Fixed effective defender input and shared crit resistance; actual snapshots tested on both sides. Existing one-HP duel yield, stamina and seeded session stay local. |
| B2 `party_battle.js` | Fixed actual redirected target's input. Guarded strike reads the ally's snapshot, preserving consent, stamina/effort, exhaustion and yields. |
| B3 `causal_story_core.js` | Fixed current Person/NPC snapshots. Authored synthetic causal bodies lacking dimensions retain ordinary defaults. Causal protection/outcomes unchanged. |
| B4 `feature_expansion_battle.js` | Fixed actual victim stats after guard defense, plus guarded-vs-unguarded comparison using the same source dimensions. Frame/shield/body policy in `feature_expansion_battle_host.js`, borrowed gear rules, paid openings, focus, stamina, yield and objective mechanics remain local. No claim that authored physical frame becomes a native armor item. |

## P2 required composition handoff

After palette source release, apply only [items-registration.patch](P1_EVIDENCE/items-registration.patch) to current `src/items.js`: extend its existing `enemies.js` import with `registerEnemyEquipmentItemFactory`, and register `getItemFromKey` beside existing Item registration. P1 did not write that shared item/crafting area. This uses an existing import edge and no core composition line or save field. Until it lands, default enemies work and explicit equipment-key enemies need the factory port registered by their host. It is a required group-integration hunk, not an approval request.

The isolated provisional candidate includes exactly this hunk. Integration build and 42 focused checks pass. Its rebuilt browser constructs a real Enemy through the registered item factory: equipped source loss 20.3, removed source loss 38 under the same controlled native Combat strike. No shipped encounter content was changed. The gear branch's ordinary Direwolf/Forest den journey remains open, alongside human play judgment. This lane does not close its natural-access gate using the synthetic constructor case.

P2 must retain/recheck the baseline crafting failure F3 on actual combined inputs. Do not copy this receipt as a full-suite pass. P3's separate status may contain additional legacy-runner gaps not covered by P1's top-level suite.

## P3 reusable source/command/expected-delta contract

`node --test --test-name-pattern="P1 scenario" tests/combat_effect_semantics.test.js`

Source: actual Hero.equipItem/unequipItem, actual Enemy.equipment_keys/init/getItemFromKey and readNativeFighter, then B1 duel on both sides, B2 redirected ally, B3 resolveCausalStrike, B4 feature action with current token/ownership/vitals. Same seed/defense, gear dimensions versus ordinary defaults: geared target retains more HP at every selected reader; actual source removal restores baseline dimensions. This uses developer fixtures, not natural acquisition. Command is directly reusable without another fixture-format dependency.

Tiny pure delta: [before.txt](P1_EVIDENCE/before.txt) and [after.txt](P1_EVIDENCE/after.txt). With constant draw .5, attack 100, crit rate 1, default target takes 200. Target damage_taken=.5 and crit_resistance=.75 formerly also took 200; now takes 50. Source removal returns 200. Floors/caps/explicit zero share and ordinary defaults have separate assertions.

## Verification states and limits

| Check | State | Exact evidence |
|---|---|---|
| Focused 7-file command | 42/42 PASS | `focused.log`; `integration-focused.log` repeats only after the provisional registration input changed. Files: combat_effect_semantics, equipment_stats, gear_dimensions, gear_affixes, frontier_campaign, party_battle, native_equipment_ownership. |
| Isolated `npm run build` | PASS | `build.log`; changed provisional candidate build `integration-build.log` also PASS. |
| Isolated `npm test` | 2363/2364, one FAIL | `full-test.log`; F3 below. No blanket full-suite success. |
| F3 control | Same FAIL with all seven changed original runtime files replaced by pre-P1 HEAD bytes | `baseline-failing-test.log`. Candidate sources then restored exactly. Source-only new equipment helper is unreachable under that control. |
| Isolated `npm run check:arch` | PASS | `arch.log`: main 10303/10310, display 6690/6767, save 310/310; 6 grandfathered main imports, 226 cyclic edges, no new ones. Baseline file unchanged versus HEAD. |
| Isolated `npm run check:rules` | PASS | `rules.log`: 96 tracking warnings because the copied candidate has no git metadata. No rule changed, so rule-behavior not required. |
| Rebuilt 1920×1080 browser, P1 source only | PASS | `browser-sourceonly.json`: real inventory row/context Equip, native Combat.doCombatAction controlled strike, Save/reload/Export/literal Import, native unequip and baseline strike. Bare 33.1, worn 15.6, removed 33.1; equipment source and exact derived stats restored; no browser errors. |
| Rebuilt browser, provisional P2 registration | PASS | `browser.json`, `browser.mjs`, `browser.log`, `equipped-1920.png`: same hero journey plus actual native creature equipment factory/strike/removal. No browser errors. Synthetic empty private-pack manifest and existing local font copied, no personal save/pack content read. |
| Owned whitespace/preservation | PASS | `git diff --check` owned paths. Gear owner and P1 packet append only; exact pre-append hash and zero-loss evidence in `doc-preservation.json`. |

F3: `tests/interaction_native.test.js` IS1–IS4 Sinew multi-stack All craft expects a Boar meat entry to be absent but it remains. Same failure without P1 runtime changes. Owned by the active crafting/integration lane; no unrelated repair attempted.

Source/test, built, browser and hero current-format persistence states are verified as above. Human play acceptance, ordinary acquisition/crafting, natural encounter cadence and the ordinary equipped Direwolf route remain unverified. No presentation change: current-laptop/14/21px layout checks were not rerun or claimed; mobile stays deferred. All P1 source paths are released for integration despite the explicit broader gates.

## Generated-output incident and recovery

One provisional integration build was accidentally invoked in the shared root. It rewrote index.html and dist/bundle.js/map. All three were reconstructed from the palette baseline dirty patch over its HEAD, matched P1's earlier snapshot hashes exactly, and restored only after checking that the current files still matched this lane's accidental output. [generated-recovery.json](P1_EVIDENCE/generated-recovery.json) records the hashes and confirms Ink notices unchanged. Runtime source was unaffected. Subsequent build and native verification ran solely in the isolated candidate. No net shared generated-output change remains.

Included allowance: 26% at start, 28% before final receipt, below dispatch's 31% shared ceiling.
