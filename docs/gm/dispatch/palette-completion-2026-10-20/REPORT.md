# Palette completion and audit repairs

2026-10-20. **All 53 named bounded palette treatments are implemented.** The formerly open 26 now have concrete native consumers, not helper-only modes. The [current checklist](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#palette-by-palette-implementation-checklist-2026-10-20), [coverage and deliberate boundaries](COVERAGE.md) and [solo audit](SOLO_AUDIT.md) explain the scope. Human visual/play acceptance remains open. The [first-pass report](REPORT_FIRST_PASS.md) preserves the earlier incomplete status and usage stop.

Weibao selected full implementation with Luna subagents and audit, then explicitly requested another five included-usage points to finish personally and repair the implementation after self-audit. This continuation used no subagents. Rules AR1–AR16, UR1–UR58, MR custody/native clock rules and AD6–9/15–18/22/32–40 apply. Desktop/laptop stays first; mobile and NPC-heavy/procedural layouts stay deferred. The 90 reference comparison rows remain evidence, not 90 newly implemented mechanics.

## What changed

| Code | Delivered native treatment | Boundary |
|---|---|---|
| D1 | Selected crafting goal retains actual attempts, successes, useful output and remaining intent through stock/skill interruptions and navigation. Explicit Recheck/Continue and Cancel. | Session-only, labelled in the UI, cleared by any save load. Reserves nothing; native material policy, skill caps, transaction and RNG remain authoritative. |
| D2 | Saved finite whole-carcass routine with exact stop target, pause-after-current, resume, cancellation/return and cross-cycle graded-output tally. | The existing clock and native grant/transaction own every completion. Pending work reserves the last completion against overflow. Legacy missing routine is unchanged. |
| D3 | Actual flask squares, discrete carcass completion steps, unequal processing work allocations, same-copy condition segments and dated remembered readouts. | Processing outputs settle atomically. Capacity changes get separate wording; old-copy/load baselines clear. Remembered facts are explicitly non-live. |
| D4 | Observed body recovery and six authored already-known capability responses in the existing Body disclosure. Optional motion, master Effects off and static reduced-motion meaning. | Real amount gain at unchanged capacity; small gains accumulate, loss/load resets. No hidden skill disclosure or invented gameplay benefit. |
| D5 | Household control refresh when native ownership/restore settles; separately released FF3 paid finite wood supply integrated through its own model/host/travel seams. | No tick needed to enable restored controls. A hearth supply does not imply furnace, cooking, ambient light or temperature mechanics. |

The self-audit repaired native boundary/overflow and failed-write handling, copy/capacity history semantics, observation timestamps, pose clobbering and a clipped Body sentence. Full wording now expands within Body; compact physical meaning stays visible. No broad UI-contract exception was added. Earlier independent Luna findings and root repairs remain in [AUDIT](AUDIT.md).

## Final input and verification

Frozen candidate: `/tmp/oops-palette-finish-20261021-release`.
Bundle SHA-256: `05765bac40984d1620bf2303dd086d4bc0a86d053ce20daced6f98af8b0fc30b`.
[FINAL_INPUTS](FINAL_INPUTS.json) records **736 matching live/candidate runtime/style files**, host inputs and regression/journey hashes. Shared dist/index were not rebuilt; generated HTML fingerprint differences in the disposable candidate are recorded separately.

| Check | Evidence |
|---|---|
| Build | PASS, isolated current dirty-input tree through the normal `build.js`; `/tmp/palette-release-build.log`. |
| `npm test` | **2390/2390 PASS**, 39.59 seconds, `/tmp/palette-release-full.log`. Includes finite native craft continuation, rejected routine write rollback, actual known-skill Body response and load reset. |
| `npm run check:arch` | PASS, main -7/display -68 lines versus baseline; 226 grandfathered cyclic edges, no new cycles. `/tmp/palette-release-arch.log`. |
| `npm run check:rules` | PASS with the existing linked untracked gear-depth owner warning; no new warning. `/tmp/palette-release-rules.log`. |
| `npm run check:rule-behavior` | PASS, 36/36; `/tmp/palette-release-rule-behavior.log`. |
| Rebuilt solo completion browser | **10 recorded checks PASS**, `/tmp/oops-palette-release-browser/receipt.json`. Exact paused/finished finite-target Save/reload/Export/literal Import; unequal/discrete work; actual known-skill pose/rest recovery and full Body disclosure; native dialogue/gathering/market/craft route; chest transfer; stale observation; native combat departure; actual 14/21px at 1920×1080 and 1536×864. |
| Retained palette browser | **8/8 recorded checks PASS on the final candidate**, `/tmp/oops-palette-release-baseline/receipt.json`: lamp/fuel/sound, native processing/receipt/persistence, loot visibility without mutation, home scene/actions/fuel, 21px at 1920/1800/1536, high contrast/reduced motion. |
| Released FF3 browser | PASS on the immediately preceding combined candidate, bundle `137e89b9d84e14d45c55bb7054855771151de31b941f27ce5b543d63d5b42843`; `/tmp/oops-palette-final-firewood/browser-receipt.json`. Exact paid stock, finite feed, empty/away/travel/extinguish and persistence. Final change only compacts Body feedback; relevant household/main/model/host inputs are unchanged. |

Browser commands are `node scripts/playtest/palette-finish.mjs <candidate> <evidence>`, `palette-completion.mjs` and `household-firewood.mjs` in the same directory. All origins are disposable. Fixtures explicitly seed selected skills/body/stock/home and access. The shared village route earns gathering XP, receives dialogue tools, buys and crafts through real native controls; one access/ore patch is recorded. Existing native Export can award its normal reward, so literal Import compares the exported post-reward state. Optional missing private-pack manifest requests are the only tolerated browser failures; no unexpected page/console errors.

## Remaining acceptance and state

G1: Weibao's visual/play judgment is the remaining acceptance gate for these named treatments. Whole unseeded campaign acquisition, physical speaker audibility and every illustrative future-world mechanism are not claimed. Crafting session intent is deliberately not durable; the processing target is durable and validated. Existing old-format processing without totals remains readable without invented progress.

No personal saves, commit, push, publish, paid fallback or shared generated-file replacement. The earlier pass stopped at 24%→29%; this continuation began at 30%, ceiling 35%. Final shared reading **34%**, below the 35% ceiling. [Fresh preview](http://127.0.0.1:59992/) serves the frozen candidate on an unseeded origin; app opening returned queued, which is not confirmed foreground delivery. CHECKPOINT records process ownership. Runtime/style source ownership is released after the final identity capture.


Post-verification ownership check: the shared checkout advanced in `src/household_scene.js`, `src/absorb_p23/host_joins/tranche_one_ui.js`, `src/absorb_p23/household/host.js` and `src/absorb_p23/household/model.js`. These newer concurrent edits add household animal/play presentation and control continuity. They are preserved and are not part of this release's preview or audit claim. FINAL_INPUTS records verified and subsequent live hashes separately; the frozen release candidate and its checks remain authoritative for the completed palette treatment. No rollback, adoption or acceptance of the newer lane is implied.
