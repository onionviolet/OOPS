# R1: reconciled rule owners

```receipt
build: n/a
route: n/a
state: rules-reconciled
viewport: n/a, documentation and instruction routing
persistence: unchanged
tests: See checks below; no runtime or browser proof claimed.
review: diff-scoped
```

2026-10-31. Documentation and path-routing changes on HEAD
`43466ba23505c9f751317b4bd9e3ee161158105f`, in the shared primary checkout.
The five edited owners were clean at lane start. Other sessions' dirty and
untracked files were preserved. State: rules-reconciled, agent-verified,
not human-reviewed. No runtime code or user save was changed.

## Changes and evidence

- **RFX2, RPT1-RPT14.** [Player UI path rule](../../../../.claude/rules/player-ui.md) now distinguishes the 2026-10-28 SUI/RPT1-RPT12 defaults from RPT13-RPT14, standing since 2026-10-30. The dates match the [register](../../../RULES_INDEX.md#register-of-rule-sets) and [vision entry](../../../USER_VISION.md#report-voice-for-every-world-as-a-standing-rule-2026-10-30).
- **MR1-MR36, AD38.** [Making path rule](../../../../.claude/rules/making-systems.md) adds potion, dose, mixture, rune and brew filename patterns. The standing rules already applied to all making through the project instructions; this corrects automatic discovery. Existing root-level and nested source matches were checked without a blanket `src/**` pattern.
- **RFX4-RFX5, AR6, MR33.** [SAVES G1 and G8](../../../SAVES.md#6-open-gaps) distinguish the decided drop-and-log default, the ordinary simple-inventory branch, and other paths still requiring real-loader checks. The MR33 override and explicit compatibility decision remain visible with new-state round trips and private-save protection. `src/main.js` warns and skips in the ordinary simple branch; `tests/save_files.test.js` throws from a preflight stub, so it does not prove the unknown-item import path.
- **RFX6, AD5, AD22, AD32, AD46.** [BALANCE](../../../BALANCE.md) identifies the tracked damage-type mechanism and its adjustable proposal values, permits reversible prototype tuning without a separate human sign-off, and describes the second-target risk at the point where admission expands. The live resolver accepts one parameter target and does not yet filter effects by target.
- **RFX3, UR2, AD32, AD42.** [UR2](../../../UI_RULES.md#before-you-build-decide-where-it-belongs) retains Weibao's authority to promote unaccepted features. Existing direction can authorize a home; the authorized slice needs its agent-side evidence, with human review optional. Agent proof does not convert a proposal into accepted direction.

**Already correct.** RFX1's UIV5 remains a proposed check, not a rule; it was not added to the UI rule-code lists. The [systems front door](../../../systems/README.md#cross-cutting-owners) points to the merged [DESIGN.md](../../../../DESIGN.md), with the separate voice draft still proposed. Its rune row points to the [consolidated rune owner](../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#round-4-the-three-companion-palettes-merged-here-2026-10-30); the three donor documents are stubs. These pointers needed verification, not another edit.

## Conditional runtime work

- **G1:** When a save-compatibility slice selects retired IDs, test synthetic ordinary, equipped, special and relevant cross-owner cases through the real loader and literal Import. Distinguish the decided unknown-ID default from malformed or future-envelope failure; confirm stored bytes survive failure. No such end-to-end check ran here.
- **G2:** Reopen actual per-pack save-delta wiring when a selected pack needs that lifecycle. A passing leaf cannot establish live Save/Export/Import integration.
- **RFX8:** When Reports voice coverage is extended, test a real world's own start/work places and reachable control, shared place names across worlds, and the permitted generic exception. The existing source-shape/global-name proxy is not that proof.
- **WDI44:** When parameter admission expands beyond its current target, add target separation and check that two targets coexist without cross-effects. Current admission rejects the second target; there is no demonstrated present cross-target bleed.

## Input identity

SHA-256 of the scoped owners after editing:

```text
c5adca90762a6465a3b478e394b26ed0f6c4875b41bbef4d9f41bbc5ff81f965  .claude/rules/player-ui.md
e1a0fd8c912a763e59036f89434614b52f9103e413c09c9030ec31e54b6f927e  .claude/rules/making-systems.md
818b85aab7622228cfea7faa7d1674e24f5e9ed3e269d11fefe893ec7101942c  docs/SAVES.md
8f3f827244aae2ef24d75c0b62c9af2168dba7e887dd4b7d1a98fb7673ba97b2  docs/BALANCE.md
db7788fd1f3948c919e4b041640ede06546466531a9e43f9e00c6f02b2f0dbc3  docs/UI_RULES.md
```

Selected live runtime inputs inspected, SHA-256:

```text
e29a2bcf2d171f20927b54af28631666a039a012d1e7f3a09f57c4bb96863267  src/main.js
70d1ef3f7e8fbc2561df294a38a1ca5c4d539930b53d6e5fdd7e62271713b1aa  src/save_files.js
ed142e251d0d07f09441b8351598a3eae2cad1d3122e0b522fa1306f272c3c58  tests/save_files.test.js
281be37b5800537f21eadfbe07829102e4c93db98f4ed73ad1fbb1452c5069e8  src/rule_modules.js
16966027fe30a595ab6bea75ea84763e3b9b1e81ce719e75393b4df6663c4e58  src/damage_types.js
```

## Checks

- `npm run check:rules`: pass, 29 register rows, 46 AD codes, 166 relative links and 18 receipts; 17 existing index warnings. The coordinator corrected the initially failing shared checkpoint receipt block before this run.
- `node scripts/check_receipts.mjs --files docs/gm/dispatch/refinement-audits-2026-10-31/R1_RULE_OWNER_RECEIPT.md`: pass, one receipt.
- `npm run check:docs`: fails with 40 findings in existing out-of-lane shared-tree docs; no hits in this lane's edited documents or receipt. The first run flagged the retained UR2 promotion wording in our changed row; adding its existing default framing removed that lane hit without changing the direction.
- Python `pathlib` glob probe against the rule frontmatter: pass for representative potion, dose, mixture, rune, brew and nested invention paths; unrelated `main.js`, `enemies.js`, `save_files.js` and `information_freshness.js` did not match. The targeted patterns matched 78 existing source files in total.
- `git diff --check` on the five tracked edited paths and a trailing-whitespace probe on this receipt: pass. A focused file and heading-link probe checked all 10 receipt links and the new MR33 override link: pass.


## Content reconciliation B489: later authority and exact remaining proof

Historical owner/routing repair, not runtime delivery, under AD32/AD36/AD42/AD43. Preserve RFX1–RFX6/RFX8, G1/G2 and WDI44 distinctions: RPT13–14's standing date differs from earlier defaults; making-path globs correct automatic discovery rather than newly creating the standing making policy. Proposed UIV5 remains proposed. Consolidated design/rune pointers needed verification rather than another donor specification. Reversible authorized tuning does not need an extra taste-approval blocker, but agent proof does not accept an unaccepted feature.

SAVES' decided unknown-ID drop/log default, ordinary inventory warn/skip branch, other loader paths and malformed/future envelopes are different cases. A throw from a preflight stub does not establish actual unknown-item literal-import behavior. G1 real-loader cross-owner cases and G2 selected pack-save wiring remain conditional missing proof; this doc reconciliation does not run them. Current single-target admission does not demonstrate cross-target bleed: add target separation when the actual parameter admission expands, without presenting WDI44's future risk as a reproduced current bug.

Report-voice source-shape/global-name checks are not actual world-start/work-place/control evidence. The historical inspection hashes bind source/read scope at that time, not current runtime compliance. The17 warnings and40 doc diagnostics are original shared-tree results, neither today's gate nor reason to rewrite concurrent owners. Adding default framing removed the original lane's UR2 lint finding without changing authority. This full receipt read does not freshly inspect the five owner bodies, code, golden paths or runtime tests; no renewed rule behavior/save/browser proof, code acceptance or new rule family follows. Retain actual routing, loader and target-consumer reopen conditions in their current owners.
