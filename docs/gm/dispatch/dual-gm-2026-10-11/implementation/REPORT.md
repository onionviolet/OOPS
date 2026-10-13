# MICRO-P1 / G8-006: capped XP repair

2026-10-11. Verified isolated candidate, awaiting director review and separate shared-branch integration. Worktree: `/Users/weiwei/.codex/worktrees/micro-p1-xp/yet-another-idle-rpg`; base `8a4c82d9022ed158841e416abf90fa4afe263874`.

## Result and review

**F1:** The native capped grant guard never ran because `typeof threshold === Number` compares a string with a function. Before editing, the real native character/catalog test stored all 1,000 Combat XP instead of the intended 6 (60 XP level width × configured 0.1). The focused test failed `1000 !== 6`.

**D1:** Replace only that guard with `Number.isFinite(skillXP.xp_to_next_lvl)`. Finite grants requesting the cap now use the existing formula after bonuses. Crafting, reward/cheat and restoration routes that deliberately pass `cap_gained_xp: false` retain their policies. Existing max-level Infinity behavior remains unchanged. No save schema, XP migration, universal cap, skill coefficient or ability change. Existing earned XP is restored uncapped, never retrospectively clamped.

Play the [isolated production preview](http://127.0.0.1:18531/). Click PLAY and Confirm if needed, then Import the generated [cap preview fixture](evidence/generated-cap-preview.txt). It is a synthetic level-67 test hero in Shack, not a balance proposal or private user save. Click PLAY after import, expand Character skills to see Regeneration, and use **Take a nap**. Its 1,000-XP level width limits each ordinary grant to 100 while healing remains greater than 100 HP. Return to the center menu to end sleep. The fixture begins after the verified tick with Regeneration at 599 XP, so another tick reaches 699. Health recovery itself is not reduced by this repair. Use only one tab on this fresh origin.

[Source/test patch](MICRO-P1.patch) is the exact reviewable integration candidate. It contains the one-line component change, focused native test and browser proof script. Production generated outputs and the diagnostic entry are excluded. [Inputs](evidence/inputs.json) records base, paths, SHA-256 fingerprints, dependency/runtime versions and exact commands. [Browser receipt](evidence/browser.json) records actual values and verification distinctions. [Native progression screenshot](evidence/native-progression.png), [production sleep screenshot](evidence/production-sleep.png).

## Caller and compatibility inspection

| Route | Existing policy retained |
|---|---|
| `main.add_xp_to_skill`, combat, healing, sleep, activities, food/effects/location XP | Default true: existing 10% per-grant cap. Main life/furniture/pacing factors and component global/actor/skill/parent multipliers remain before the cap. |
| Crafting item/component/equipment paths in main | Explicit false after native per-craft 25% calculation and batch accumulation. Supplementary skills can explicitly use the ordinary cap. No second universal crafting cap. |
| Native `process_rewards.skill_xp`, including the give developer helper | Explicit false. Native reward grant and its real bonuses verified. The separate `add_skill_xp` developer helper already calls the default capped route; its authored flag was not silently changed. |
| v0.6 owner XP and pre-v0.6 `skills.*.total_xp` restoration | Explicit false, no bonuses. Supplied parent XP is retained; parent catch-up only when a saved parent entry is absent. |
| Component child-to-parent catch-up | Transfer only the accepted child grant, bounded by child/parent difference; recurse with no bonuses and no second cap. An ahead parent receives no new transfer. |
| Max-level skill sentinel | Infinity is not finite; preserve the preexisting post-max earned-XP behavior. No reinterpretation of old saves. |

Source frozen to `src/components/levelable_component.js`. `src/models/skill.js`, `src/models/person.js`, `src/main.js`, native catalogs/config and save loader stayed unchanged in the candidate. No original shared source, index, bundle, PROJECT, runtime pack or private save was edited. The original still has the faulty guard at inspection time; this candidate has not been integrated.

## Executed gates

| State | Evidence |
|---|---|
| Reproduced | Pre-edit native regression failed capped Combat 1000 versus expected 6. Real native models/catalog used; only browser presentation disconnected for this Node test. |
| Source edited | One finite-threshold guard; exact patch above. |
| Focused test | Pass: below/exact/above cap, bonus-before-cap, child catch-up, ahead parent, uncapped crafting grant, earned-XP reconstruction, milestone flat once-only behavior and max sentinel. |
| Relevant regression | 17/17 passed: `micro_p1_xp`, `alloy_equipment`, `gameplay_foundations`, `skill_discovery`; includes native alloy unlock/craft and browser ticking/travel/reload case. No broad redundant suite. |
| Built | `npm run build` succeeded, including existing Ink compiler artifact check. Production bundle fingerprint `77c29780b6eb04fc928bf6bf6ea0ced012d9bf643e55fe6f09a9a3b78e78efe1`. |
| Production browser | Fresh localhost origin, Chromium new context. Unmodified rebuilt bundle, actual native sleep: 114.45 HP healing, Regeneration 499→599 (100 XP), Sleeping 300→307.61. |
| Precise native browser | Separate diagnostic entry bundles the actual current main/character/skills/config singletons with only a window reference added. No mocked or rewritten gameplay modules. Capped Combat 1000→6; subsequent 3 and 6 grants retained; 3× bonus applied before cap; Swords 4 XP transferred 4 to Weapon mastery; ahead parent 1004 stayed unchanged; native rewards bypass cap and retain bonuses. |
| Unlock/reward consumer | Sleeping crosses 5, 6, 7. Meditation unlocked and announced once; old unlock ID re-emission does not duplicate the actual consumer. Level 7 adds no repeated milestone flat stats, factors or XP bonuses. Native alloy unlock path covered by relevant regression. |
| Save/reload/import | Current generated fixture retains exact skill XP and flat milestone contributions. Multipliers use the existing native two-decimal reconstruction rounding described below; reload→import factors are exact. Generated v0.5 fixture retains Combat 10000, Swords 12345, Weapon mastery 15000 and Sleeping 127000 through load, save, reload and actual file-input import. No user's saves read. |
| Artifact checks | Browser script syntax and git diff whitespace checks pass. Exact combined patch reverse-apply check passes in its candidate worktree. |
| Director acceptance / integration | OPEN. Neither inferred from passing checks. No commits, pushes, merges or publishing. |

The final browser receipt has zero runtime/page errors. Expected resource 404s are separately counted: no private pack manifest is installed in this isolated checkout. Earlier generated fixture mistakes were corrected: hero XP must match both saved owners, and a pre-v0.6 skill envelope must use an actual legacy version/shape. These were fixture failures, not reasons to weaken save validation.

## Adjacent findings and boundaries

**F2:** The native Skill level loop can re-emit earlier unlock IDs, but the real skill/recipe consumers check unlocked state, and quest consumers check active/finished state. The selected Meditation consumer emitted one notification. No real duplicate reward defect was established in this slice, so no speculative Skill/main repair is included. Broader consumer qualification remains G8-007/009 follow-on work in the [micro owner](../../idea-expansion-2026-10-11/micro/REPORT.md).

**F3:** Existing milestone-factor rounding differs between sequential and reconstructed gains. Sleeping’s level-4 bulk factor rounds to 1.08; multiplying its level-6 factor 1.04 gives 1.1232. Reconstructing all three milestones in one native call rounds to 1.12. Browser receipt records both. The unchanged base Skill.get_bonus_stats rounds aggregated factors to two decimals, while the unchanged actor multiplies successive grants. This is an existing aggregation-order issue, outside the finite-cap guard. It does not lose saved XP or repeat rewards; no exact factor parity claim is made across that first reload. A later packet should reproduce effective-stat impact and decide canonical aggregation compatibility before editing it.

Broader titles, ordinary skills, variant, power and VFX plans remain proposed in [micro requirements](../../idea-expansion-2026-10-11/micro/REQUIREMENTS.json), [joined planning](../../idea-expansion-2026-10-11/RECONCILIATION.md), and [follow-up gates](../../idea-expansion-2026-10-11/FOLLOWUP_GATES.md). This slice does not launch another implementation lane or reveal sealed truths.

## Integration prerequisites

**A1:** The incumbent shared-checkout owner reviews and applies this source/test patch against its current source while preserving other writes. Check current guard/caller changes; do not copy this old-base bundle or index over the absorption wave. Read-only `git apply --check` passed against original HEAD `237cf128684d58480d7a211a46749c495461447c`; nothing was applied. The patch is a candidate, not authorization to merge.

**A2:** Rebuild from the current combined source and repeat the focused cap/parent/native reward and relevant save/browser gate there, especially the absorption pacing/furniture multipliers. This worktree establishes the inspected base plus repair, not the latest dirty absorption combination.

**A3:** Director playable acceptance remains the human gate. Keep F2/F3 and unrelated world/audit backlog with their owners; no new world engine or VFX work has started.
